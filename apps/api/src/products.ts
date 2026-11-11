/**
 * An item offered for sale, in the shape `GET /api/products` returns it. This
 * is the API contract the web app reads, not a mirror of whatever the storage
 * happens to hold: adding a column to the database must not change it.
 */
export interface Product {
  /**
   * Stable identifier a Cart Item will later refer to. Must be unique across
   * the catalogue, or two Products would collapse into one Cart Item.
   */
  id: string;
  name: string;
  /**
   * The Price as a whole number of US cents (`1999` is $19.99). Never a
   * fraction of a dollar: floats cannot represent most decimal amounts
   * (`0.1 + 0.2 !== 0.3`), so totals summed from them drift by a cent.
   * Formatting as dollars is the frontend's job.
   */
  priceCents: number;
}

/**
 * The only way routes reach Products (see ADR-0002). Routes depend on this
 * interface and never on an implementation, so the in-memory storage can be
 * replaced with Postgres without touching them.
 */
export interface ProductRepository {
  /**
   * Asynchronous even though an array could answer synchronously: a database
   * cannot, and changing the signature later would mean rewriting every call
   * site.
   */
  findAll(): Promise<Product[]>;
}

/**
 * The fixed catalogue kept in process memory. It stands in for the database
 * until the Postgres implementation exists, and stays useful afterwards for
 * running the API without one.
 */
export function createInMemoryProductRepository(): ProductRepository {
  const products: Product[] = [
    { id: 'espresso-cup', name: 'Espresso cup', priceCents: 1250 },
    { id: 'french-press', name: 'French press', priceCents: 3499 },
  ];

  return {
    async findAll() {
      // Copies of the list and of each Product: a caller that sorts or edits
      // the result must not change what the next caller receives.
      return products.map((product) => ({ ...product }));
    },
  };
}
