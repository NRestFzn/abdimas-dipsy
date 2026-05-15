# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run watch:dev` — run the API with `tsx --watch` against `src/main.ts` (dev mode, no build needed)
- `npm run build` — clean `dist/` then `tsc` + `tsc-alias` (resolves the `@/*` path aliases in emitted JS)
- `npm run start:prod` — run the compiled `dist/main.js`
- `npm run generate:secret` — runs `dist/helper/keyGenerate.js` to produce JWT/crypto keys (requires a prior `build`)
- Sequelize CLI scripts (`db:create`, `db:drop`, `db:migrate`, `db:migrate:refresh` = undo all, `db:seed`, `db:reset` = drop→create→migrate→seed). **All of these require `npm run build` first** — `.sequelizerc` points the CLI at `./dist/...`, not `./src/...`. Running `db:migrate` against fresh TypeScript sources will silently do nothing.

There is no test runner, linter, or formatter wired into `package.json` (only `.prettierrc` exists). Don't invent commands; if a workflow needs testing, ask.

## Architecture

Express 5 + TypeScript + Sequelize (MySQL) + `sequelize-typescript` decorators. CommonJS output; path alias `@/*` → `src/*` (see `tsconfig.json` and the `tsc-alias` post-build step). `reflect-metadata` is imported at the top of `databaseConnection.ts` to enable decorator metadata.

### Request lifecycle

`src/main.ts` → `App` class in `src/config/app.config.ts` registers middleware in order: pino http logger → json/urlencoded → static `/public` → compression → cookies → helmet → cors → hpp → request-ip → user-agent → `expressRateLimit` → `expressWithState` → `expressUserAgent` → `langHandler`. Routes mount under `/v1` via `src/routes/index.route.ts` → `src/routes/version1/version1.route.ts`. A catch-all 404 throws `ErrorResponse.NotFound`. Error middleware runs in order via `App.create`: `expressErrorValidation` (Yup) → `expressErrorSequelize` → `expressCryptoError` → `expressErrorHandler`. Throw `ErrorResponse.*` from anywhere — controllers are wrapped in `asyncHandler` so thrown errors reach the handler chain.

### State on Request

`expressWithState` attaches helpers onto `req` via `WithState` (`src/libs/module/withState.ts`): `req.getBody()`, `req.getQuery()`, `req.getParams()`, `req.getState(path)`, `req.setState(obj)`, plus multer helpers. **Always use these getters in controllers** — the codebase does not read `req.body` / `req.query` directly. `req.t` (translation object) and `req.lang` are set by `langHandler` and used as `req.t.auth.loginSuccess` etc.

### Feature module pattern

Each domain lives in `src/features/<name>/` with `repository/<name>Repository.ts`, `dto.ts`, and `schema.ts` (Yup schemas). The HTTP layer lives separately in `src/routes/version1/controller/<name>.controller.ts` and is mounted in `version1.route.ts`. Controllers:

1. instantiate the repository,
2. pull data with `req.getBody()` / `req.getParams()` / `req.getQuery()`,
3. validate with `schema.validateSync(...)`,
4. call repository methods,
5. wrap the response with `HttpResponse.get|created|updated|deleted({ message: req.t.*, data })` and `res.status(...).json(...)`.

Auth-gated routes chain `authorization()` (decodes JWT into `req.state.userLoginState`) and optionally `permissionAccess([RoleId.x, ...])` (loads the user + roles, allows if any role matches). Roles are UUIDs hard-coded in `src/libs/constant/roleIds.ts` (`user`, `adminDesa`, `adminMedis`, `kaderDesa`).

### Database

Models in `src/database/model/` use `sequelize-typescript` decorators and extend `BaseSchema` (UUID `id`, `createdAt`, `updatedAt`). `databaseConnection.ts` auto-loads every model file in that directory. Models can declare scopes (e.g. `User.scope('withPassword')`) and `@BeforeCreate` / `@BeforeUpdate` hooks (e.g. `User` auto-hashes `password` via argon2 in `src/config/hash.config.ts`).

Migrations and seeders live in `src/database/migration/` and `src/database/seed/` but the Sequelize CLI is configured (via `.sequelizerc`) to read the **compiled** versions from `dist/`. The workflow when adding migrations: write under `src/database/migration/`, `npm run build`, then `npm run db:migrate`.

### Sensitive fields

NIK (Indonesian national ID) is stored encrypted. `Encryption` (`src/libs/encryption.ts`) uses `CRYPTO_ENCRYPTION_KEY` (must be 32 chars) for AES-256-CBC and `BLIND_INDEX_KEY` for an HMAC-SHA256 "blind index" used to look up records without decrypting. See `AuthRepository.loginWithNik` and `register` for the pattern: store ciphertext in `nikEncrypted`, store HMAC in `nikHash`, query by `nikHash`.

### i18n

`src/locales/{en,id}.ts` export deeply nested translation maps. `langHandler` picks the language from `env.APP_LANG` → `x-lang` header → `accept-language` and attaches `req.t` (typed as `Translation`). Error messages thrown from repositories typically pass a translation key string (e.g. `'auth.loginFailed'`) which middleware resolves; controllers pass already-resolved strings via `req.t.*`.

### Config & env

All env access goes through `src/config/env.config.ts` — never read `process.env` directly elsewhere. `validate.number` / `validate.boolean` coerce strings. The defaults baked into `env.config.ts` are insecure placeholders meant only for local boot; real values come from `.env` (see `.env.example`).
