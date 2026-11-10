import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Must match PORT in the root .env — the API listens there.
const API_ORIGIN = 'http://localhost:3000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The browser sees web and API as one origin, so auth cookies work
    // without CORS or cross-site cookie settings.
    proxy: { '/api': API_ORIGIN },
  },
});
