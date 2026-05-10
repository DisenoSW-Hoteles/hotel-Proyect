"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
// 1. Importación con llaves (Named Import) para coincidir con app.ts
const app_1 = require("./app");
const database_1 = require("./config/database");
const dotenv_1 = __importDefault(require("dotenv"));
// Cargamos el .env antes de inicializar cualquier cosa
dotenv_1.default.config();
// Definimos el puerto desde la bóveda, con un fallback de seguridad
const PORT = process.env.PORT || 3000;
database_1.AppDataSource.initialize()
    .then(() => {
    app_1.app.listen(PORT, () => {
        console.log(`Server ready on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Database initialization failed', error);
    process.exit(1);
});
