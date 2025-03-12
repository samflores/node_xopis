import 'tests/setup';
import server from 'src/server';
import Order from 'src/models/Order';
import OrderItem from 'src/models/OrderItem';
import Product from 'src/models/Product';
import { LightMyRequestResponse } from 'fastify';

describe('POST /orders', () => {
    describe('when the input is valid', () => {
        it('when pass all the parameters', async () => {
            const { product1Id, product2Id } = await createTestProducts();

            const input = {
                customer_id: 1,
                items: [
                    { product_id: product1Id, quantity: 2, discount: 3.98 },
                    { product_id: product2Id, quantity: 1, discount: 0.99 }
                ]
            };

            const response = await makeRequest(input);

            expect(response.statusCode).toBe(201);
            expect(response.json()).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    customer_id: input.customer_id,
                    total_paid: 99,
                    total_discount: 4.97,
                    status: "payment_pending",
                    items: expect.any(Object)
                })
            );
        });

        it('when a discount does not exist', async () => {
            const { product1Id, product2Id } = await createTestProducts();

            const input = {
                customer_id: 1,
                items: [{ product_id: product1Id, quantity: 1 }]
            };

            const response = await makeRequest(input);
            expect(response.statusCode).toBe(201);
            expect(response.json()).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    customer_id: input.customer_id,
                    total_paid: 42.00,
                    total_discount: 0,
                    status: "payment_pending",
                    items: expect.any(Object)
                })
            );
        });
    });

    describe('when a product does not exist', () => {
        const input = {
            customer_id: 1,
            items: [{ product_id: 999, quantity: 1 }]
        };

        it('returns a bad request response', async () => {
            const response = await makeRequest(input);
            expect(response.statusCode).toBe(400);
            expect(response.json()).toEqual(
                expect.objectContaining({
                    message: expect.stringContaining('Product with ID 999 not found'),
                })
            );
        });
    });

    describe('when the input is invalid', () => {
        it('returns 400 for the missing customer_id payload parameters', async () => {
            const input = {
                items: [{ product_id: 1, quantity: 1 }]
            };

            const response = await makeRequest(input);
            expect(response.statusCode).toBe(400);
            expect(response.json()).toEqual({
                message: 'customer_id and items are required',
            });
        });

        it('returns 400 for the missing items payload parameters', async () => {
            const input = {
                "customer_id": 1
            };

            const response = await makeRequest(input);
            expect(response.statusCode).toBe(400);
            expect(response.json()).toEqual({
                message: 'customer_id and items are required',
            });
        });

        it('returns 400 for wrong typeof input', async () => {
            const { product1Id } = await createTestProducts();

            const response = await makeRequest({
                customer_id: 1,
                items: [
                    { product_id: product1Id, quantity: 2, discount: 'invalid' }
                ]
            });

            expect(response.statusCode).toBe(400);
            expect(response.json()).toEqual(
                expect.objectContaining({
                    message: 'Validation error',
                    error: expect.objectContaining({
                        name: 'ValidationError',
                        type: 'ModelValidation',
                        data: expect.objectContaining({
                            "total_discount": expect.arrayContaining([
                                expect.objectContaining({
                                    message: 'must be number',
                                    keyword: 'type',
                                    params: expect.objectContaining({
                                        type: 'number',
                                    }),
                                }),
                            ]),
                        }),
                    }),
                })
            );
        });
    });

    const makeRequest = async (input: any) =>
        server.inject({
            method: 'POST',
            url: '/orders',
            body: input,
        });

    async function createTestProducts(): Promise<{ product1Id: number; product2Id: number }> {
        const product1: Partial<Product> = {
            name: 'Video Game',
            sku: 'ATUSJN',
            description: 'Video Game',
            price: 42.0,
            stock: 100,
        };

        const product2: Partial<Product> = {
            name: 'Notebook',
            sku: 'ASJDND',
            description: 'Le novo',
            price: 15.0,
            stock: 200,
        };

        const response1 = await makeRequestProduct(product1);
        const response2 = await makeRequestProduct(product2);

        const jsonResponse1 = response1.json<Product>();
        const jsonResponse2 = response2.json<Product>();

        return {
            product1Id: jsonResponse1.id,
            product2Id: jsonResponse2.id,
        };
    }

    const makeRequestProduct = (input: Partial<Product>) =>
        server.inject({
            method: 'POST',
            url: '/products',
            body: input,
        });
});