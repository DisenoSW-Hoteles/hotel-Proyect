import 'reflect-metadata';
import app from './app.js';
import { AppDataSource } from './config/database.js';
import { env } from './config/environment.js';

AppDataSource.initialize()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server ready on http://localhost:${env.port}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Database initialization failed', error);
    process.exit(1);
  });
