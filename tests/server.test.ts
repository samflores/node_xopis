import server from 'src/server';

describe('GET /ping', () => {
  it('should return a pong response', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/ping'
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual('pong!\n');
  });
});
