# shop-use-node

Learning repo: a frontend developer learning Node by building a mini shop. Domain vocabulary is in `CONTEXT.md`, decisions in `docs/adr/`.

## How we work here

- **Andrew writes everything in `apps/api`** (server code, and from the Cart ticket on, its tests). Do not write it for him, even when asked to "implement" a ticket — give theory and examples, then review what he wrote.
- **Claude writes** `apps/web`, configs, and the API tests for the tickets before the Cart ticket.
- Before each point of a ticket: a short theory note plus an example on a _neighbouring_ problem, never the ticket's own solution.
- Tickets and explanations are in Russian. Code, comments, commit messages and branch names are in English.
- One branch + PR per ticket, PR body ends with `Closes #N`.

## Commands

- `pnpm dev` (web :5173 + api :3000), `pnpm db:up` (Postgres on host port 5433)
- `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`

## Gotchas

- TypeScript is pinned to 6: typescript-eslint does not support TS 7 yet.
- `apps/api` runs `.ts` natively in Node: no `enum`, no parameter properties, relative imports end in `.ts`.
- `.env*` files are behind a Read deny rule — ask Andrew to edit them.

## Git (overrides the global git constraints for this repo only)

- Allowed: `git commit`, `git push` to ticket branches (never force), `gh pr create`, and creating / editing / closing GitHub issues with `gh`.
- Still forbidden without asking: pushing to `main`, `git tag`, `git rebase`, `git reset --hard`, force-push.

## Agent skills

### Issue tracker

Issues live in GitHub Issues (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context. See `docs/agents/domain.md`.
