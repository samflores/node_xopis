import { FastifyInstance } from 'fastify';
import productCreate from '../actions/products/create';
import productsList from '../actions/products/list';
import productFetch from '../actions/products/fetch';

export default async function productRoutes(server: FastifyInstance) {
  server.post('/', productCreate);
  server.get('/', productsList);
  server.get('/:id', productFetch);
}
