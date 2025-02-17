import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('customer_id').unsigned().notNullable().references('id').inTable('users');
    table.float('total_tax').notNullable();
    table.float('total_shipping').notNullable();
    table.float('total_discount').notNullable();
    table.float('total_paid').notNullable();
    table.enum('status', [
      'payment_pending',
      'fraud_review',
      'approved',
      'shipped',
      'delivered',
      'customer_canceled',
      'admin_canceled',
      'fraud_canceled'
    ]
    ).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
}
