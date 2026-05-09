import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Habitacion } from '../models/entities/Habitacion.entity.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // CRÍTICO: Debe ser false porque tu compañero ya creó las tablas con SQL nativo
  synchronize: false,
  logging: true,
  entities: [Habitacion], // Aquí conectaremos los modelos más adelante
  subscribers: [],
  migrations: [],
});
