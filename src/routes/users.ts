import { FastifyInstance } from 'fastify';
import userCreate from '../actions/users/create';

export default async function userRoutes(server: FastifyInstance) {
  server.post('/', userCreate);
}
