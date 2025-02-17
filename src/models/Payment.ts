import { Model } from 'objection';
import Order from './Order';

class Payment extends Model {
  static tableName = 'payments';

  id!: number;
  order_id!: number;
  confirmation_code!: string;
  card_number!: string;
  card_holder!: string;
  card_expiration_month!: number;
  card_expiration_year!: number;
  card_cvv!: string;
  amount!: number;
  created_at?: Date;
  updated_at?: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['order_id', 'confirmation_code', 'card_number', 'card_holder', 'card_expiration', 'card_cvv', 'amount'],
      properties: {
        order_id: { type: 'integer' },
        confirmation_code: { type: 'string', minLength: 1, maxLength: 255 },
        card_issuer: { type: 'string', enum: ['VISA', 'MasterCard', 'American Express'] },
        card_number: { type: 'string', pattern: '(\\d{4} ){3}\\d{4}' },
        card_holder: { type: 'string', minLength: 1, maxLength: 255 },
        card_expiration_month: { type: 'integer', minimum: 1, maximum: 12 },
        card_expiration_year: { type: 'integer', minimum: 0 },
        card_cvv: { type: 'string', pattern: '\\d{3}' },
        amount: { type: 'number', minimum: 0 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      }
    };
  }

  static get relationMappings() {
    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: 'payments.order_id',
          to: 'orders.id',
        }
      }
    };
  }
}

export default Payment;
