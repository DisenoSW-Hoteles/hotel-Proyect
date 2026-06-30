import 'reflect-metadata';
import { app } from './infrastructure/http/app';
import { AppDataSource } from './infrastructure/config/database';
import { env } from './infrastructure/config/environment';

const PORT = env.port;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server ready on http://localhost:${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Database initialization failed', error);
    process.exit(1);
  });
