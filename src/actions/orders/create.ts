import { FastifyReply, FastifyRequest } from 'fastify';
import { transaction } from 'objection';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';
import Product from '../../models/Product';
import { OrderStatus } from '../../models/Order';
import { ValidationError } from 'objection';

interface Item {
  product_id: number;
  quantity: number;
  discount?: number;
}

type Request = FastifyRequest<{ Body: { customer_id: number; items: Item[] } }>;

export default async (
  { body: { customer_id, items } }: Request,
  reply: FastifyReply
) => {

  if (!customer_id || !items) {
    return reply.code(400).send({ message: `customer_id and items are required` });
  }

  const trx = await transaction.start(Order.knex());

  try {
    const productIds = items.map(item => item.product_id);
    const products = await Product.query(trx).findByIds(productIds);

    const productMap = new Map(products.map(product => [product.id, product]));

    let totalPaid = 0;
    let totalDiscount = 0;

    const orderItems = items.map(item => {
      const product = productMap.get(item.product_id);

      if (!product) {
        return reply.code(400).send({ message: `Product with ID ${item.product_id} not found` });
      }

      const itemPaid = product.price * item.quantity;
      const itemDiscount = item.discount ?? 0

      totalPaid += itemPaid;
      totalDiscount += itemDiscount;

      return {
        order_id: null,
        product_id: item.product_id,
        quantity: item.quantity,
        tax: 0,
        shipping: 0,
        discount: itemDiscount,
        paid: itemPaid,
      };
    });

    const order = await Order.query(trx).insert({
      customer_id,
      total_paid: totalPaid,
      total_tax: 0,
      total_shipping: 0,
      total_discount: totalDiscount,
      status: OrderStatus.PaymentPending,
    });

    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    OrderItem.query(trx).insertGraph(orderItemsWithOrderId);
    await trx.commit();

    return reply.code(201).send({
      id: order.id,
      customer_id: order.customer_id,
      total_paid: order.total_paid,
      total_discount: order.total_discount,
      status: order.status,
      items: orderItemsWithOrderId
    });
  } catch (error) {
    await trx.rollback();

    if (error instanceof ValidationError) {
      return reply.code(400).send({
        message: 'Validation error',
        error: {
          name: error.name,
          type: error.type,
          data: error.data,
        },
      });
    }

    return reply.code(500).send({ message: 'Internal server error', error });
  }
};