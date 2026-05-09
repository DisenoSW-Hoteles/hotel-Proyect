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
const AppError_js_1 = require("./utils/errors/AppError.js");
const errorHandler_js_1 = require("./middleware/error/errorHandler.js");
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
    apis: ['./src/routes/*.js'],
};
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup((0, swagger_jsdoc_1.default)(swaggerOptions)));
// 3. Rutas de la API (Las agregaremos aquí)
exports.app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'success', message: 'API operativa' });
});
// 4. Interceptor de Rutas Inexistentes (404)
exports.app.all('*', (req, _res, next) => {
    next(new AppError_js_1.AppError(`No se puede encontrar la ruta ${req.originalUrl} en este servidor.`, 404));
});
// 5. Interceptor Global de Errores
exports.app.use(errorHandler_js_1.errorHandler);
