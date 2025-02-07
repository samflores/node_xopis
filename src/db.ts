import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knexfile';
import './models';

const env = process.env.NODE_ENV || 'development';
const knex = Knex(knexConfig[env]);

Model.knex(knex);

export default knex;
