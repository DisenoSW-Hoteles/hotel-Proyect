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
// Importaciones Arquitectónicas
const AppError_1 = require("./utils/errors/AppError");
const errorHandler_1 = require("./middleware/error/errorHandler");
const HabitacionController_1 = require("./controllers/reservas/HabitacionController");
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
exports.app = (0, express_1.default)();
// 1. Middlewares Globales
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// 2. Swagger (Configuración Básica)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: { title: 'Hotel API', version: '1.0.0' },
    },
    apis: ['./src/controllers/**/*.ts', './src/routes/**/*.ts'],
};
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)(swaggerOptions)));
// 3. Inicialización de Controladores
const habitacionCtrl = new HabitacionController_1.HabitacionController();
// 4. Rutas de la API
exports.app.use('/api', healthRoutes_1.default); // Mantenemos la ruta de salud modular si tu compañero la necesita
exports.app.post('/api/habitaciones/disponibilidad', (req, res, next) => habitacionCtrl.buscarDisponibilidad(req, res, next));
// 5. Interceptor de Rutas Inexistentes (404)
exports.app.all('*', (req, _res, next) => {
    next(new AppError_1.AppError(`No se puede encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});
// 6. Interceptor Global de Errores
exports.app.use(errorHandler_1.errorHandler);
