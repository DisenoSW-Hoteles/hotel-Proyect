"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const AppError_1 = require("./utils/errors/AppError");
const errorHandler_1 = require("./middleware/error/errorHandler");
const HabitacionController_1 = require("./controllers/reservas/HabitacionController");
const AuthController_1 = require("./controllers/auth/AuthController");
const AdminController_1 = require("./controllers/admin/AdminController");
const ReservaController_1 = require("./controllers/reservas/ReservaController");
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
exports.app = (0, express_1.default)();
// ─── Middlewares globales ──────────────────────────────────────────────────────
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
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
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)(swaggerOptions)));
// ─── Controladores ────────────────────────────────────────────────────────────
const habitacionCtrl = new HabitacionController_1.HabitacionController();
const authCtrl = new AuthController_1.AuthController();
const adminCtrl = new AdminController_1.AdminController();
const reservaCtrl = new ReservaController_1.ReservaController();
// ─── Rutas: Health ────────────────────────────────────────────────────────────
exports.app.use('/api', healthRoutes_1.default);
// ─── Rutas: Autenticación ─────────────────────────────────────────────────────
exports.app.post('/api/auth/login', (req, res, next) => authCtrl.login(req, res, next));
exports.app.post('/api/auth/refresh', (req, res, next) => authCtrl.refresh(req, res, next));
exports.app.post('/api/auth/logout', (req, res, next) => authCtrl.logout(req, res, next));
// ─── Rutas: Portal Cliente — Disponibilidad y Reservas ───────────────────────
exports.app.post('/api/habitaciones/disponibilidad', (req, res, next) => habitacionCtrl.buscarDisponibilidad(req, res, next));
exports.app.post('/api/reservas', (req, res, next) => reservaCtrl.crearReserva(req, res, next));
// ─── Rutas: Admin — Habitaciones ──────────────────────────────────────────────
exports.app.get('/api/admin/rooms', (req, res, next) => habitacionCtrl.obtenerTodas(req, res, next));
exports.app.patch('/api/admin/rooms/:id/rate', (req, res, next) => adminCtrl.updateRoomRate(req, res, next));
// ─── Rutas: Admin — Reservas (Check-in) ───────────────────────────────────────
exports.app.get('/api/admin/reservations/by-code/:code', (req, res, next) => adminCtrl.getReservationByCode(req, res, next));
exports.app.get('/api/admin/reservations/by-guest/:document', (req, res, next) => adminCtrl.getReservationsByGuest(req, res, next));
exports.app.post('/api/admin/reservations/:id/check-in', (req, res, next) => adminCtrl.executeCheckIn(req, res, next));
// ─── Rutas: Admin — Folios (Check-out) ────────────────────────────────────────
exports.app.get('/api/admin/folios/reservation/:reservationId', (req, res, next) => adminCtrl.getFolioByReservation(req, res, next));
exports.app.post('/api/admin/folios/charges', (req, res, next) => adminCtrl.addCharge(req, res, next));
exports.app.patch('/api/admin/folios/:id/close', (req, res, next) => adminCtrl.closeFolio(req, res, next));
// ─── 404 y manejo de errores ──────────────────────────────────────────────────
exports.app.all('*', (req, _res, next) => {
    next(new AppError_1.AppError(`Ruta ${req.originalUrl} no encontrada en este servidor.`, 404));
});
exports.app.use(errorHandler_1.errorHandler);
