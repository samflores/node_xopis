import { FastifyInstance } from 'fastify';
import productCreate from '../actions/products/create';
import productsList from '../actions/products/list';

export default async function productRoutes(server: FastifyInstance) {
  server.post('/', productCreate);
  server.get('/', productsList);
}
