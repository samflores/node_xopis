import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('payments', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().unique().notNullable().references('id').inTable('users');
    table.uuid('confirmation_code').unique().notNullable();
    table.enum('card_issuer', ['VISA', 'MasterCard', 'American Express']).notNullable();
    table.string('card_number').notNullable();
    table.string('card_holder').notNullable();
    table.integer('card_expiration_month').unsigned().notNullable();
    table.integer('card_expiration_year').unsigned().notNullable();
    table.string('card_cvv').notNullable();
    table.float('amount').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('payments');
}
