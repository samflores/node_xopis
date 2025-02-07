import { FastifyInstance } from 'fastify';
import userCreate from '../actions/users/create';
import usersList from '../actions/users/list';

export default async function userRoutes(server: FastifyInstance) {
  server.post('/', userCreate);
  server.get('/', usersList);
}
