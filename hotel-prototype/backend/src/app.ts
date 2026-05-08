import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { AppError } from './utils/errors/AppError.js';
import { errorHandler } from './middleware/error/errorHandler.js';

export const app: Application = express();

// 1. Middlewares Globales
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Swagger (Configuración Básica)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Hotel API', version: '1.0.0' },
  },
  apis: ['./src/routes/*.js'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// 3. Rutas de la API (Las agregaremos aquí)
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API operativa' });
});

// 4. Interceptor de Rutas Inexistentes (404)
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`No se puede encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});

// 5. Interceptor Global de Errores
app.use(errorHandler);
