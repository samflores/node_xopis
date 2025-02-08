import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('sku').unique().notNullable();
    table.string('name').notNullable();
    table.string('description');
    table.float('price').notNullable();
    table.integer('stock').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
}
