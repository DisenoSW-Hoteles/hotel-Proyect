import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// Importaciones Arquitectónicas
import { AppError } from './utils/errors/AppError';
import { errorHandler } from './middleware/error/errorHandler';
import { HabitacionController } from './controllers/reservas/HabitacionController';
import { AuthController } from './controllers/auth/AuthController'; // <-- Inyección del nuevo controlador
import healthRoutes from './routes/healthRoutes';

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
  apis: ['./src/controllers/**/*.ts', './src/routes/**/*.ts'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// 3. Inicialización de Controladores
const habitacionCtrl = new HabitacionController();
const authCtrl = new AuthController(); // <-- Instancia del nuevo controlador

// 4. Rutas de la API
app.use('/api', healthRoutes); // Mantenemos la ruta de salud modular si tu compañero la necesita

app.get('/api/admin/rooms', (req, res, next) =>
  habitacionCtrl.obtenerTodas(req, res, next)
);

app.post('/api/habitaciones/disponibilidad', (req, res, next) =>
  habitacionCtrl.buscarDisponibilidad(req, res, next)
);

// Endpoint de Autenticación para el Panel Administrativo
app.post('/api/auth/login', (req, res, next) =>
  authCtrl.login(req, res, next)
);

// 5. Interceptor de Rutas Inexistentes (404)
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`No se puede encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});

// 6. Interceptor Global de Errores
app.use(errorHandler);
