import { FastifyInstance } from 'fastify';
import userCreate from '../actions/users/create';
import usersList from '../actions/users/list';
import userShow from '../actions/users/show';
import userDelete from '../actions/users/delete';
import userUpdate from '../actions/users/update';

export default async function userRoutes(server: FastifyInstance) {
  server.post('/', userCreate);
  server.get('/', usersList);
  server.get('/:id', userShow);
  server.delete('/:id', userDelete);
  server.patch('/:id', userUpdate);
}
