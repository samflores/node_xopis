import { FastifyReply, FastifyRequest } from 'fastify';
import NotEnoughStockError from '../../errors/NotEnoughStockError';
import ProductNotFoundError from '../../errors/ProductNotFoundError';
import { Order, OrderItem, OrderStatus, Product } from '../../models';
import { CreateOrderRequestType, OrderItemsReplyType } from '../../../src/validations/order.zod';

export default async (
    request: FastifyRequest<{ Body: CreateOrderRequestType }>,
    reply: FastifyReply
) => {
    const { customer_id, items } = request.body;

    try {
        const order = new Order();
        order.customer_id = customer_id;
        order.status = OrderStatus.PaymentPending;
        order.total_discount = items.reduce((acc, item) => {
            acc += item.discount || 0;
            return acc;
        }, 0);
        order.total_paid = 0;
        order.total_shipping = 0;
        order.total_tax = 0;

        const createdOrder = await Order.transaction(async trx => {

            order.items = await Promise.all(items.map(async item => {
                const discount = item.discount || 0;

                const product = await Product.query(trx).findById(item.product_id);
                if (!product) throw new ProductNotFoundError;
                if (product!.stock < item.quantity) throw new NotEnoughStockError;

                const paid = (product.price * item.quantity) - discount;

                const newProductStock = product.stock - item.quantity;
                await product.$query(trx).patch({ stock: newProductStock });

                const orderItem = new OrderItem();
                orderItem.product_id = product.id;
                orderItem.quantity = item.quantity;

                // they are set to 0 for business logic purposes
                orderItem.tax = 0;
                orderItem.shipping = 0;

                orderItem.discount = item.discount || 0;
                orderItem.paid = paid;

                order.total_paid += paid;

                return orderItem;
            }));

            return await order.$query(trx).insertGraphAndFetch(order);
        });

        const responsePayload: OrderCreatedResponsePayload = {
            id: createdOrder.id,
            customer_id: createdOrder.customer_id,
            total_paid: createdOrder.total_paid,
            total_discount: createdOrder.total_discount,
            status: createdOrder.status,
            items
        };

        return reply.status(201).send(responsePayload);
    } catch (error) {
        if (error instanceof ProductNotFoundError) {
            return reply.status(400).send({ message: 'Product not found.' });
        }
        throw error;
    }
};

interface OrderCreatedResponsePayload {
    id: number,
    customer_id: number,
    total_paid: number,
    total_discount: number,
    status: OrderStatus,
    items: OrderItemsReplyType
}
