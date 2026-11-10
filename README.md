# shop-use-node

A mini shop built to learn Node from the frontend side: two Products, Google sign-in, a Cart.

- `apps/web` — Vite + React + Tailwind. Proxies `/api` to the API.
- `apps/api` — Node 24 running TypeScript directly, no build step.
- `CONTEXT.md` — domain vocabulary. `docs/adr/` — decisions and why.

## Setup

```sh
nvm use
pnpm install
cp .env.example .env
pnpm db:up      # Postgres in Docker, host port 5433
pnpm dev        # web on :5173, api on :3000
```

## Checks

```sh
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
```
