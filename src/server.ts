import fastify from 'fastify';
import userRoutes from './routes/users';

const shouldLog = process.env.NODE_ENV !== 'test';
const server = fastify({ logger: shouldLog });

server.register(userRoutes, { prefix: '/users' });

export default server;
