# Agent Notes

## Bun-Native Rule

- Use what Bun ships before adding an npm package: `bun test`, `bun build`, `bun run` / `Bun.$`, `Bun.password`, `Bun.YAML`, and the built-in `.env` loading. Don't add Jest, Vitest, tsx, ts-node, rimraf, esbuild, tsup, dotenv, argon2, js-yaml, Prettier, ESLint, oxlint, oxfmt, husky or lint-staged.
- `bun run check:bun-native` (it runs in CI) fails when one of those is added. If one is really needed, add it to `ALLOWED` in `scripts/check-bun-native.ts` and give the reason.
