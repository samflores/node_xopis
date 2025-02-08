import fastify from 'fastify';
import userRoutes from './routes/users';
import productRoutes from './routes/products';

const shouldLog = process.env.NODE_ENV !== 'test';
const server = fastify({ logger: shouldLog });

server.register(userRoutes, { prefix: '/users' });
server.register(productRoutes, { prefix: '/products' });

export default server;
