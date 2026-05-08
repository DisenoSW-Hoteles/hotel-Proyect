import { app } from './app.js';
import { AppDataSource } from './config/database.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Primero, garantizamos la conexión a la base de datos
    await AppDataSource.initialize();
    console.log('📦 Conexión a PostgreSQL establecida exitosamente mediante TypeORM.');

    // Luego, levantamos el servidor web
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('🔥 Error fatal al conectar con la base de datos:', error);
    process.exit(1);
  }
};

startServer();
