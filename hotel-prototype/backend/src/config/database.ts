import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './environment.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../models/entities/*.{ts,js}'],
  migrations: [__dirname + '/../../database/migrations/*.{ts,js}'],
  subscribers: [],
});
