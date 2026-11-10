import { z } from 'zod';

const DEFAULT_API_PORT = 3000;

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(DEFAULT_API_PORT),
  DATABASE_URL: z.url(),
});

/**
 * The validated configuration the rest of the API works with. Inferred from
 * the schema so the two cannot drift apart: to add a setting, add it to the
 * schema, never to this type by hand.
 */
export type Config = z.infer<typeof schema>;

/**
 * Turns a raw environment into a config that is safe to use without further
 * checks. The environment is passed in instead of read from `process.env`, so
 * tests can feed it plain objects and the entry point stays the only place
 * that touches the real environment.
 *
 * @throws {Error} When any variable is missing or malformed. The message
 * lists every problem at once, so a broken `.env` is fixed in one pass.
 */
export function parseConfig(
  envConfig: Record<string, string | undefined>,
): Config {
  const config = schema.safeParse(envConfig);
  if (!config.success) {
    throw new Error(`Invalid config:\n${z.prettifyError(config.error)}`);
  }
  return config.data;
}
