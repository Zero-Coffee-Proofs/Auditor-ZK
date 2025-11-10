Build / lint / test

YOU ARE NOT ALLOWED TO COMMIT ANYTHING NOR PUSH NOR PULL

- Install: pnpm install (repo uses pnpm workspace)
- Dev (web): cd apps/web && pnpm run dev
- Build (all): pnpm run build # runs turbo tasks from root
- Lint: cd apps/web && pnpm run lint (or pnpm run lint at root runs turbo)
- Check types: pnpm run check-types (root) or cd apps/web && pnpm run check-types
- Run all tests (web): cd apps/web && pnpm run test
- Run unit tests (Vitest): cd apps/web && pnpm run test:unit
- Run a single unit test: cd apps/web && pnpm run test:unit -- -t "<test name>" OR vitest path/to/test.spec.ts
- Run Playwright single integration test: cd apps/web && npx playwright test path/to/spec.ts or npx playwright test -g "test name"

Code style (be boringly consistent)

- Formatting: Prettier + prettier-plugin-svelte (use pnpm run format). Don’t bike-shed formatting.
- ESLint: repo uses @repo/eslint-config. Run lint before pushing.
- Imports: prefer explicit relative imports for local files (./Foo), package imports for deps. Keep imports grouped: 1) builtin, 2) external, 3) internal, 4) styles/assets.
- Types: TypeScript is first-class (tsconfig in web). Keep strictness; prefer explicit return types on public functions, use unknown for external data and validate it.
- Naming: camelCase for variables/functions, PascalCase for Svelte components and classes, SCREAMING_SNAKE for constants.
- Error handling: validate inputs early, fail fast, return thrown Errors (typed where helpful). Don’t swallow errors; log with context.
- Tests: one assertion per test ideally; mock external services; prefer deterministic unit tests.

Tooling rules

- There are no Cursor (.cursor/rules or .cursorrules) or GitHub Copilot rules in this repo — no extra constraints found.

If anything here contradicts a local config file, the config file wins. Now go write code that won't make me restart CI.
