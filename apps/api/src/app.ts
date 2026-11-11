import express, { type RequestHandler } from 'express';
import { errorHandler, notFoundHandler } from './errors.ts';
import type { ProductRepository } from './products.ts';

/**
 * Everything the app needs from the outside world. Passed in rather than
 * created here, so the entry point chooses the real storage and a test can
 * hand in its own.
 */
export interface AppDeps {
  productRepository: ProductRepository;
}

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
export function createApp({ productRepository }: AppDeps) {
  const app = express();
  app.use(requestLogger);
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.get('/api/products', async (_req, res) => {
    res.json(await productRepository.findAll());
  });
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
