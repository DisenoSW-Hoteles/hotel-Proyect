import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { AppError } from './utils/errors/AppError';
import { errorHandler } from './middleware/error/errorHandler';
import { HabitacionController } from './controllers/reservas/HabitacionController';
import { AuthController } from './controllers/auth/AuthController';
import { AdminController } from './controllers/admin/AdminController';
import { ReservaController } from './controllers/reservas/ReservaController';
import healthRoutes from './routes/healthRoutes';

export const app: Application = express();

// ─── Middlewares globales ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger ──────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel API',
      version: '1.0.0',
      description: 'Sistema Centralizado de Gestión Hotelera',
    },
  },
  apis: ['./src/controllers/**/*.ts', './src/routes/**/*.ts'],
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

// ─── Controladores ────────────────────────────────────────────────────────────
const habitacionCtrl = new HabitacionController();
const authCtrl = new AuthController();
const adminCtrl = new AdminController();
const reservaCtrl = new ReservaController();

// ─── Rutas: Health ────────────────────────────────────────────────────────────
app.use('/api', healthRoutes);

// ─── Rutas: Autenticación ─────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res, next) => authCtrl.login(req, res, next));
app.post('/api/auth/refresh', (req, res, next) => authCtrl.refresh(req, res, next));
app.post('/api/auth/logout', (req, res, next) => authCtrl.logout(req, res, next));

// ─── Rutas: Portal Cliente — Disponibilidad y Reservas ───────────────────────
app.post('/api/habitaciones/disponibilidad', (req, res, next) =>
  habitacionCtrl.buscarDisponibilidad(req, res, next),
);

app.post('/api/reservas', (req, res, next) => reservaCtrl.crearReserva(req, res, next));

// ─── Rutas: Admin — Habitaciones ──────────────────────────────────────────────
app.get('/api/admin/rooms', (req, res, next) => habitacionCtrl.obtenerTodas(req, res, next));

app.patch('/api/admin/rooms/:id/rate', (req, res, next) =>
  adminCtrl.updateRoomRate(req, res, next),
);

// ─── Rutas: Admin — Reservas (Check-in) ───────────────────────────────────────
app.get('/api/admin/reservations/by-code/:code', (req, res, next) =>
  adminCtrl.getReservationByCode(req, res, next),
);

app.get('/api/admin/reservations/by-guest/:document', (req, res, next) =>
  adminCtrl.getReservationsByGuest(req, res, next),
);

app.post('/api/admin/reservations/:id/check-in', (req, res, next) =>
  adminCtrl.executeCheckIn(req, res, next),
);

// ─── Rutas: Admin — Folios (Check-out) ────────────────────────────────────────
app.get('/api/admin/folios/reservation/:reservationId', (req, res, next) =>
  adminCtrl.getFolioByReservation(req, res, next),
);

app.post('/api/admin/folios/charges', (req, res, next) => adminCtrl.addCharge(req, res, next));

app.patch('/api/admin/folios/:id/close', (req, res, next) => adminCtrl.closeFolio(req, res, next));

// ─── 404 y manejo de errores ──────────────────────────────────────────────────
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Ruta ${req.originalUrl} no encontrada en este servidor.`, 404));
});

app.use(errorHandler);
