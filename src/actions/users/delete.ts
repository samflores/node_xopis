import { FastifyReply, FastifyRequest } from 'fastify';
import User from '../../models/User';

type Request = FastifyRequest<{ Params: { id: string } }>;

export default async (
  { params: { id } }: Request,
  reply: FastifyReply
) =>
  User.query()
    .delete()
    .where('id', id)
    .throwIfNotFound()
    .then(() => reply.send(id))
    .catch(() => reply.status(404).send({ error: 'User not found' }));
