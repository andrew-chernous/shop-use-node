import type { ErrorRequestHandler, RequestHandler } from 'express';

/**
 * Answers requests that no route handled. An unknown path is not an error in
 * Express — nothing throws — so this is ordinary middleware and must be
 * registered after every route, or it would shadow them.
 */
export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Not found' } });
};

/**
 * Turns any thrown error into a 500 with a fixed message, so stack traces and
 * internal details never reach the client; the real error goes to the log.
 * Express recognises an error handler by its four parameters: removing the
 * unused `_next` would make Express skip this handler. Must be registered last.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
};
