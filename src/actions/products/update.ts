import { FastifyReply, FastifyRequest } from 'fastify';
import Product from '../../models/Product';

type Request = FastifyRequest<{
  Params: { id: string };
  Body: {
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock: number;
  }
}>;

export default async (
  { body: { name, sku, description, price, stock }, params: { id } }: Request,
  reply: FastifyReply
) =>
  Product.query()
    .patchAndFetchById(id, { name, sku, description, price, stock })
    .then((product) => {
      if (!product) {
        return reply.status(404).send({ error: 'Product not found' });
      } else {
        return reply.send(product);
      }
    });
