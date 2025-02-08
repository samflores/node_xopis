import { FastifyReply, FastifyRequest } from 'fastify';
import User from '../../models/User';
import { UniqueViolationError } from 'objection';

type Request = FastifyRequest<{ Body: { name: string; email: string } }>;

export default async (
  { body: { name, email } }: Request,
  reply: FastifyReply
) =>
  User.query()
    .insert({ name, email })
    .then((user) => reply.code(201).send(user))
    .catch((error) => {
      if (error instanceof UniqueViolationError) {
        if (error.columns.includes('email')) {
          return reply.code(400).send({ message: 'email already taken' });
        }
      }
      return reply.send(error);
    });
