import fastify from 'fastify';

const server = fastify({ logger: true });

server.get('/ping', async () => {
  return 'pong!\n';
});

export default server;
