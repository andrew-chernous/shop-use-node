import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseConfig } from './config.ts';

const DATABASE_URL = 'postgres://shop:shop@localhost:5433/shop';

describe('parseConfig', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the typed config for a complete environment', () => {
    const config = parseConfig({ PORT: '4000', DATABASE_URL });

    expect(config).toEqual({ PORT: 4000, DATABASE_URL });
  });

  it('falls back to port 3000 when PORT is not set', () => {
    const config = parseConfig({ DATABASE_URL });

    expect(config.PORT).toBe(3000);
  });

  // process.env carries the whole shell environment; none of it may leak
  // into the config object.
  it('drops variables the schema does not describe', () => {
    const config = parseConfig({ DATABASE_URL, HOME: '/Users/someone' });

    expect(config).toEqual({ PORT: 3000, DATABASE_URL });
  });

  it('names DATABASE_URL when it is missing', () => {
    expect(() => parseConfig({})).toThrow(/DATABASE_URL/);
  });

  it('rejects a DATABASE_URL that is not a URL', () => {
    expect(() => parseConfig({ DATABASE_URL: 'not a url' })).toThrow(
      /DATABASE_URL/,
    );
  });

  it.each(['abc', '3000.5'])('rejects PORT=%s and names PORT', (port) => {
    expect(() => parseConfig({ PORT: port, DATABASE_URL })).toThrow(/PORT/);
  });

  it('lists every problem at once, not only the first one', () => {
    expect(() => parseConfig({ PORT: 'abc' })).toThrow(
      /PORT[\s\S]*DATABASE_URL|DATABASE_URL[\s\S]*PORT/,
    );
  });

  it('reads only the object it is given, never process.env', () => {
    vi.stubEnv('DATABASE_URL', DATABASE_URL);

    expect(() => parseConfig({})).toThrow(/DATABASE_URL/);
  });
});
