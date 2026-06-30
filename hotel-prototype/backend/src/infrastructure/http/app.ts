import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { AppError } from '../../domain/errors/AppError';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/healthRoutes';
import authRoutes from './routes/authRoutes';
import habitacionRoutes from './routes/habitacionRoutes';
import reservationRoutes from './routes/reservationRoutes';
import reservaPublicaRoutes from './routes/reservaPublicaRoutes';
import folioRoutes from './routes/folioRoutes';

export const app: Application = express();

// 1. Middlewares Globales de Seguridad y Parsing
app.use(helmet());

// CORS restringido a orígenes conocidos (portal-cliente y panel-admin de Angular).
// Se configuran por variable de entorno; el comodín '*' queda fuera por seguridad.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200,http://localhost:4201')
  .split(',')
  .map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Documentación OpenAPI / Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Hotel API', version: '1.0.0' },
  },
  apis: [
    './src/infrastructure/http/controllers/**/*.ts',
    './src/infrastructure/http/routes/**/*.ts',
  ],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// 3. Montaje de Rutas por Módulo (adaptadores de entrada)
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', habitacionRoutes);
app.use('/api/admin/reservations', reservationRoutes);
app.use('/api/admin/folios', folioRoutes);
app.use('/api/reservas', reservaPublicaRoutes);

// 4. Interceptor de Rutas Inexistentes (404)
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`No se puede encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});

// 5. Interceptor Global de Errores
app.use(errorHandler);
