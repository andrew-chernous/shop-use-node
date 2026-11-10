import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from './app.ts';
import { errorHandler } from './errors.ts';
import type { Product, ProductRepository } from './products.ts';

const PRODUCTS: Product[] = [
  { id: 'mug', name: 'Test mug', priceCents: 1250 },
  { id: 'cap', name: 'Test cap', priceCents: 1999 },
  { id: 'pin', name: 'Test pin', priceCents: 300 },
];

// A repository written inside the test: the routes must work with anything
// that satisfies the interface, not only with the in-memory implementation.
function createStubProductRepository(
  findAll: ProductRepository['findAll'] = async () => PRODUCTS,
): ProductRepository {
  return { findAll };
}

function createTestApp(productRepository = createStubProductRepository()) {
  return createApp({ productRepository });
}

describe('GET /api/health', () => {
  it('reports that the API is up', async () => {
    const res = await request(createTestApp()).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/products', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the Products of the injected repository', async () => {
    const res = await request(createTestApp()).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual(PRODUCTS);
  });

  it('returns an empty array when there are no Products', async () => {
    const app = createTestApp(createStubProductRepository(async () => []));

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('answers 500 in the error format when the repository fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const app = createTestApp(
      createStubProductRepository(async () => {
        throw new Error('storage is down');
      }),
    );

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(res.text).not.toContain('storage is down');
  });
});

describe('unknown routes', () => {
  it('answers an unknown path with 404 in the error format', async () => {
    const res = await request(createTestApp()).get('/api/nope');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      error: { code: 'NOT_FOUND', message: expect.any(String) },
    });
  });

  it('answers a known path with the wrong method with 404', async () => {
    const res = await request(createTestApp()).post('/api/health');

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
