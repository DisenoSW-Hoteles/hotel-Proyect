"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const Habitacion_entity_1 = require("../models/entities/Habitacion.entity");
// Esto carga tu archivo .env en la bóveda global process.env
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    // Apuntamos a la bóveda. Si por alguna razón la variable no existe, usamos un "fallback" de seguridad
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'tu_contraseña_aqui', // Ajusta tu fallback si es necesario
    database: process.env.DB_NAME || 'hotel_db',
    synchronize: false,
    logging: true,
    entities: [Habitacion_entity_1.Habitacion],
    subscribers: [],
});
