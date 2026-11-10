# shop-use-node

Learning repo: a frontend developer learning Node by building a mini shop. Domain vocabulary is in `CONTEXT.md`, decisions in `docs/adr/`.

## How we work here

- **Andrew writes everything in `apps/api`** (server code, and from the Cart ticket on, its tests). Do not write it for him, even when asked to "implement" a ticket — give theory and examples, then review what he wrote.
- **Claude writes** `apps/web`, configs, and the API tests for the tickets before the Cart ticket.
- Before each point of a ticket: a short theory note plus an example on a _neighbouring_ problem, never the ticket's own solution.
- English only in everything that is stored: files in this repo, GitHub issues, PRs, commit messages, branch names. Chat explanations may be in Russian.
- One branch + PR per ticket, PR body ends with `Closes #N`.

## Ticket workflow

Tickets are GitHub issues #17–#30 (spec is #16), worked in order of their "Blocked by" edges. When Andrew says "start #N":

1. Read the issue (`gh issue view N`). `main` must be up to date; branch `N-short-slug` from it.
2. Move the card to In Progress on the board (see below).
3. For tickets before the Cart (#27): write failing tests on the branch and commit them. Tell Andrew the file and export names the tests fix.
4. In chat, give theory + a neighbouring example for each task point. Then review what he writes: run test, typecheck, lint, format:check and read the code before answering.
5. He commits, or asks Claude to commit, push and open the PR (`Closes #N` in the body). He merges.
6. After the merge: pull `main`, move the card to Done.

Board: GitHub Project 4 of `andrew-chernous` (needs `gh` logged in with the `project` scope).

- Item id for an issue: `gh project item-list 4 --owner andrew-chernous --format json --limit 50`
- Move: `gh project item-edit --project-id PVT_kwHOAJywls4Bq-Jb --id <item-id> --field-id PVTSSF_lAHOAJywls4Bq-JbzhpS4GE --single-select-option-id <option>`
- Status options: Todo `f75ad846`, In Progress `47fc9ee4`, Done `98236657`

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
