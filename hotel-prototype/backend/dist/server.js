"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const database_js_1 = require("./config/database.js");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        // Primero, garantizamos la conexión a la base de datos
        await database_js_1.AppDataSource.initialize();
        console.log('📦 Conexión a PostgreSQL establecida exitosamente mediante TypeORM.');
        // Luego, levantamos el servidor web
        app_js_1.app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('🔥 Error fatal al conectar con la base de datos:', error);
        process.exit(1);
    }
};
startServer();
