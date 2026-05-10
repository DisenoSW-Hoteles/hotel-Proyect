import 'reflect-metadata';
// 1. Importación con llaves (Named Import) para coincidir con app.ts
import { app } from './app';
import { AppDataSource } from './config/database';
import dotenv from 'dotenv';

// Cargamos el .env antes de inicializar cualquier cosa
dotenv.config();

// Definimos el puerto desde la bóveda, con un fallback de seguridad
const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server ready on http://localhost:${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Database initialization failed', error);
    process.exit(1);
  });
