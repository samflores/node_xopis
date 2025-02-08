import { Model } from 'objection';
import User from './User';

export enum OrderStatus {
  PaymentPending = 'payment_pending',
  FraudReview = 'fraud_review',
  Approved = 'approved',
  Shipped = 'shipped',
  Delivered = 'delivered',
  CustomerCanceled = 'customer_canceled',
  AdminCanceled = 'admin_canceled',
  FraudCanceled = 'fraud_canceled',
}

class Order extends Model {
  static tableName = 'orders';

  id!: number;
  customer_id!: number;
  total_paid!: number;
  total_tax!: number;
  total_shipping!: number;
  total_discount!: number;
  status!: OrderStatus;
  created_at?: Date;
  updated_at?: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['customer_id', 'total_paid', 'total_tax', 'total_shipping', 'total_discount', 'status'],
      properties: {
        id: { type: 'integer' },
        customer_id: { type: 'integer' },
        total_paid: { type: 'number', minimum: 0 },
        total_tax: { type: 'number', minimum: 0 },
        total_shipping: { type: 'number', minimum: 0 },
        total_discount: { type: 'number', minimum: 0 },
        status: { type: 'string', enum: Object.values(OrderStatus) },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static get relationMappings() {
    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'orders.customer_id',
          to: 'users.id',
        }
      }
    };
  }
}

export default Order;
