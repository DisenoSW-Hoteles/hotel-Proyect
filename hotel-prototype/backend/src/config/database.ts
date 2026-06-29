import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Habitacion } from '../models/entities/Habitacion.entity';
import { Sucursal } from '../models/entities/Sucursal.entity';
import { Cliente } from '../models/entities/Cliente.entity';
import { Reserva } from '../models/entities/Reserva.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'tu_contraseña_aqui',
  database: process.env.DB_NAME || 'hotel_mvp',
  synchronize: false,
  logging: true,
  entities: [Habitacion, Sucursal, Cliente, Reserva],
  subscribers: [],
});
