import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorHandler from './middleware/error/errorHandler.js';
import healthRoutes from './routes/healthRoutes.js';

const app: Application = express();

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

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', healthRoutes);

// Health check endpoint (legacy - can be removed once routes are fully implemented)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
