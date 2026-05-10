import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Habitacion } from '../models/entities/Habitacion.entity.js';

// Esto carga tu archivo .env en la bóveda global process.env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  // Apuntamos a la bóveda. Si por alguna razón la variable no existe, usamos un "fallback" de seguridad
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'tu_contraseña_aqui', // Ajusta tu fallback si es necesario
  database: process.env.DB_NAME || 'hotel_db',
  synchronize: false,

  logging: true,
  entities: [Habitacion],
  subscribers: [],
});
