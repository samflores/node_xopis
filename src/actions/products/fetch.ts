import { FastifyReply, FastifyRequest } from 'fastify';
import Product from '../../models/Product';

type Request = FastifyRequest<{ Params: { id: string } }>;

export default async (
  { params: { id } }: Request,
  reply: FastifyReply
) =>
  Product.query()
    .where('id', id)
    .first()
    .throwIfNotFound()
    .then((product) => reply.send(product))
    .catch(() => reply.status(404).send({ error: 'Product not found' }));
