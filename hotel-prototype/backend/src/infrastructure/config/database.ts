import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './environment';
import { Habitacion } from '../../domain/entities/Habitacion.entity';

/**
 * DataSource de TypeORM (PostgreSQL) — adaptador de persistencia.
 *
 * Toda la configuración proviene de `env`, única fuente de verdad para las
 * variables de entorno. Sin credenciales escritas a mano en este archivo.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: false,
  logging: env.nodeEnv === 'development',
  entities: [Habitacion],
  subscribers: [],
});
