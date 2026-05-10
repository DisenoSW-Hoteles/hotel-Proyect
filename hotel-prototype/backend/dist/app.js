"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
<<<<<<< Updated upstream
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const app = (0, express_1.default)();
// Swagger configuration
=======
const AppError_js_1 = require("./utils/errors/AppError.js");
const errorHandler_js_1 = require("./middleware/error/errorHandler.js");
const HabitacionController_js_1 = require("./controllers/reservas/HabitacionController.js");
exports.app = (0, express_1.default)();
// 1. Middlewares Globales
// Estos actúan como la recepción del hotel: aseguran y preparan al cliente
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// 2. Swagger (Configuración de Documentación)
>>>>>>> Stashed changes
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hotel Management System API',
            version: '1.0.0',
            description: 'Centralized Hotel Management System - Backend API',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
<<<<<<< Updated upstream
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Paths to files containing OpenAPI definitions
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Routes
app.use('/api', healthRoutes_1.default);
// Health check endpoint (legacy - can be removed once routes are fully implemented)
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
exports.default = app;
=======
    // Escaneo recursivo para encontrar los bloques @swagger
    apis: ['./src/controllers/**/*.ts', './src/routes/**/*.ts'],
};
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)(swaggerOptions)));
// 3. Inicialización de Controladores
const habitacionCtrl = new HabitacionController_js_1.HabitacionController();
// 4. Rutas de la API
// Analogía: Estas son las puertas de las habitaciones en el pasillo principal.
// Ruta de salud
exports.app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'success', message: 'API operativa' });
});
// Ruta de disponibilidad (Debe estar ANTES del interceptor 404)
exports.app.post('/api/habitaciones/disponibilidad', (req, res, next) => habitacionCtrl.buscarDisponibilidad(req, res, next));
// 5. Interceptor de Rutas Inexistentes (404)
// Analogía: Si el cliente camina por todo el pasillo y no encuentra su puerta,
// al final del pasillo cae en esta "trampa" que lo redirige al error.
exports.app.all('*', (req, _res, next) => {
    next(new AppError_js_1.AppError(`No se puede encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});
// 6. Interceptor Global de Errores
// Esta es la red de seguridad final que atrapa cualquier caída (404, errores de DB, etc.)
exports.app.use(errorHandler_js_1.errorHandler);
>>>>>>> Stashed changes
