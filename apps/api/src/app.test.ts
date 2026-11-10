import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from './app.ts';
import { errorHandler } from './errors.ts';

describe('GET /api/health', () => {
  it('reports that the API is up', async () => {
    const res = await request(createApp()).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('unknown routes', () => {
  it('answers an unknown path with 404 in the error format', async () => {
    const res = await request(createApp()).get('/api/nope');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: expect.any(String) },
    });
  });

  it('answers a known path with the wrong method with 404', async () => {
    const res = await request(createApp()).post('/api/health');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('errorHandler', () => {
  const SECRET_DETAIL = 'db password is hunter2';

  // createApp() has no route that fails, so the handler is mounted on a
  // throwaway app whose only routes throw.
  function createFailingApp() {
    const app = express();
    app.get('/sync', () => {
      throw new Error(SECRET_DETAIL);
    });
    app.get('/async', async () => {
      throw new Error(SECRET_DETAIL);
    });
    app.use(errorHandler);
    return app;
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['/sync', '/async'])(
    'turns an error thrown from %s into a 500 without leaking details',
    async (path) => {
      const logged = vi.spyOn(console, 'error').mockImplementation(() => {});

      const res = await request(createFailingApp()).get(path);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        error: { code: 'INTERNAL_ERROR', message: expect.any(String) },
      });
      expect(res.text).not.toContain(SECRET_DETAIL);
      expect(res.text).not.toContain('at ');
      expect(logged).toHaveBeenCalled();
    },
  );
});
