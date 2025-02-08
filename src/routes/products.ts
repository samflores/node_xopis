import { FastifyInstance } from 'fastify';
import productCreate from '../actions/products/create';

export default async function productRoutes(server: FastifyInstance) {
  server.post('/', productCreate);
}
