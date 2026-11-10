import { createApp } from './app.ts';
import { parseConfig } from './config.ts';
import type { Config } from './config.ts';

let config: Config;
try {
  config = parseConfig(process.env);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}

const port = config.PORT;

createApp().listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
