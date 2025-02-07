import { Model } from 'objection';

class User extends Model {
  static tableName = 'users';

  id!: number;
  name!: string;
  email!: string;
  created_at?: Date;
  updated_at?: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', format: 'email' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }
}

export default User;
