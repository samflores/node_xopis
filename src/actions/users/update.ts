import { FastifyReply, FastifyRequest } from 'fastify';
import User from '../../models/User';

type Request = FastifyRequest<{ Params: { id: string }; Body: { name: string; email: string } }>;

export default async (
  { body: { name, email }, params: { id } }: Request,
  reply: FastifyReply
) =>
  User.query()
    .patchAndFetchById(id, { name, email })
    .then((user) => {
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      } else {
        return reply.send(user);
      }
    });
