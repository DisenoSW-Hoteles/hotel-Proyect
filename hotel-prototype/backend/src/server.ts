import 'reflect-metadata';
import app from './app';
import { AppDataSource } from '@config/database';
import { env } from '@config/environment';

AppDataSource.initialize()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server ready on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed', error);
    process.exit(1);
  });
