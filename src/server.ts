import fastify from 'fastify';
import userRoutes from './routes/users';

const server = fastify({ logger: true });

server.register(userRoutes, { prefix: '/users' });

export default server;
