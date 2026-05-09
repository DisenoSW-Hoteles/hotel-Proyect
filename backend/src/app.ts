import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { AppError } from './utils/errors/AppError.js';
import { errorHandler } from './middleware/error/errorHandler.js';
import { HabitacionController } from './controllers/reservas/HabitacionController.js';

export const app: Application = express();

// 1. Middlewares Globales
// Estos actúan como la recepción del hotel: aseguran y preparan al cliente
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Swagger (Configuración de Documentación)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Hotel API', version: '1.0.0' },
  },
  // Escaneo recursivo para encontrar los bloques @swagger
  apis: ['./src/controllers/**/*.ts', './src/routes/**/*.ts'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// 3. Inicialización de Controladores
const habitacionCtrl = new HabitacionController();

// 4. Rutas de la API
// Analogía: Estas son las puertas de las habitaciones en el pasillo principal.

// Ruta de salud
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API operativa' });
});

// Ruta de disponibilidad (Debe estar ANTES del interceptor 404)
app.post('/api/habitaciones/disponibilidad', (req, res, next) =>
  habitacionCtrl.buscarDisponibilidad(req, res, next)
);

// 5. Interceptor de Rutas Inexistentes (404)
// Analogía: Si el cliente camina por todo el pasillo y no encuentra su puerta,
// al final del pasillo cae en esta "trampa" que lo redirige al error.
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`No se puede encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});

// 6. Interceptor Global de Errores
// Esta es la red de seguridad final que atrapa cualquier caída (404, errores de DB, etc.)
app.use(errorHandler);
