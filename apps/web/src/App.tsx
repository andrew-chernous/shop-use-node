import { useEffect, useState } from 'react';

/**
 * A Product as `GET /api/products` returns it. Declared again here because
 * there is no shared types package yet: it must be kept in step with the
 * `Product` type in `apps/api` by hand.
 */
interface Product {
  id: string;
  name: string;
  /** Whole US cents; divided by `CENTS_PER_DOLLAR` only for display. */
  priceCents: number;
}

const CENTS_PER_DOLLAR = 100;

const priceFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ProductsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; products: Product[] };

export function App() {
  const [state, setState] = useState<ProductsState>({ status: 'loading' });

  useEffect(() => {
    // Aborting on cleanup stops a response that arrives after unmount (or
    // after StrictMode's first, discarded mount) from setting state.
    const controller = new AbortController();
    fetch('/api/products', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
        return res.json() as Promise<Product[]>;
      })
      .then((products) => setState({ status: 'loaded', products }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'error' });
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">Shop</h1>
      {state.status === 'loading' && (
        <p className="mt-2 text-gray-600">Loading products…</p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="mt-2 text-red-700">
          Could not load the products. Is the API running?
        </p>
      )}
      {state.status === 'loaded' && (
        <ul className="mt-6 divide-y divide-gray-200">
          {state.products.map((product) => (
            <li key={product.id} className="flex justify-between py-3">
              <span>{product.name}</span>
              <span className="tabular-nums">
                {priceFormat.format(product.priceCents / CENTS_PER_DOLLAR)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
