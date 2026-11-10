import express, { type RequestHandler } from 'express';
import { errorHandler, notFoundHandler } from './errors.ts';

const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = performance.now();
  res.on('finish', () => {
    const ms = Math.round(performance.now() - startedAt);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
};

/**
 * Builds the Express app without starting a server, so tests can send
 * requests into it through supertest without binding a port.
 */
export function createApp() {
  const app = express();
  app.use(requestLogger);
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
