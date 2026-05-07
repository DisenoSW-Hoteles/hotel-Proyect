"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const healthRoutes_js_1 = __importDefault(require("./routes/healthRoutes.js"));
const errorHandler_js_1 = __importDefault(require("./middleware/error/errorHandler.js"));
const app = (0, express_1.default)();
// Swagger configuration
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
app.use('/api', healthRoutes_js_1.default);
// Health check endpoint (legacy - can be removed once routes are fully implemented)
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Error handling middleware (must be last)
app.use(errorHandler_js_1.default);
exports.default = app;
