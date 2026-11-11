import { describe, expect, it } from 'vitest';
import { createInMemoryProductRepository } from './products.ts';

describe('createInMemoryProductRepository', () => {
  it('holds two Products with an id, a name and a Price in cents', async () => {
    const products = await createInMemoryProductRepository().findAll();

    expect(products).toHaveLength(2);
    for (const product of products) {
      expect(product).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        priceCents: expect.any(Number),
      });
      expect(product.name).not.toBe('');
      expect(Number.isInteger(product.priceCents)).toBe(true);
      expect(product.priceCents).toBeGreaterThan(0);
    }
  });

  it('gives every Product its own id', async () => {
    const products = await createInMemoryProductRepository().findAll();

    expect(new Set(products.map((product) => product.id)).size).toBe(2);
  });

  // A caller that sorts or filters the result in place must not change what
  // the next caller sees.
  it('does not let a caller change the stored list', async () => {
    const repository = createInMemoryProductRepository();

    const first = await repository.findAll();
    first.length = 0;

    expect(await repository.findAll()).toHaveLength(2);
  });
});
