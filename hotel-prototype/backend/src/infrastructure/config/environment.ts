import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuración centralizada y tipada de variables de entorno.
 * Única fuente de verdad para el resto de la aplicación.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER || 'postgres',
    // Aceptamos DB_PASS (estándar del proyecto) o DB_PASSWORD por compatibilidad.
    password: process.env.DB_PASS || process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hotel_mvp',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev_access_secret_change_me',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    accessExpiresInSeconds: Number(process.env.JWT_ACCESS_EXPIRES_SECONDS || 900),
  },
};
