# AGENT.md

## Project overview

Facelock is an Electron 40 + React 19 + TypeScript desktop password manager. The renderer lives in `app/`; the Electron main process and SQLite integration live in `lib/main/`; typed IPC is implemented under `lib/conveyor/`.

## Development workflow

1. Install dependencies with `npm install`.
2. Run the app with `npm run dev`.
3. Before submitting changes, run the narrowest relevant checks:
   - `npm run format` for formatting;
   - `npm run lint` for ESLint fixes;
   - `npm run vite:build:app` for a production bundle.
4. Keep generated output (`out/`) and local databases out of commits.

## Repository conventions

- Use TypeScript and React components; follow the existing `@/` path aliases.
- Keep renderer-to-main communication inside the Conveyor layer. A new IPC channel needs a schema, API method, handler, and registration.
- Validate IPC arguments and return values with Zod in `lib/conveyor/schemas/`.
- Keep database changes in `lib/main/database.ts` and make schema initialization/migrations safe for an existing user database.
- Preserve the frameless window setup and the existing dark purple visual language unless a task explicitly changes the UI direction.
- Use the existing Prettier and ESLint configuration rather than introducing per-file formatting rules.

## Security-sensitive areas

- Treat master keys, passwords, TOTP secrets, and database paths as sensitive data.
- Do not log credentials or include real secrets in fixtures, screenshots, tests, or documentation.
- The current implementation is not encrypted and has no biometric authentication; do not describe it as a secure encrypted vault until that functionality exists.
- When changing authentication or persistence, test both first-run database creation and an existing database with prior data.

## Documentation

Update `README.md` when commands, supported features, data storage, or security behavior changes. Keep claims tied to the current code: search is client-side title/username filtering, TOTP is stored as an optional field, and authentication currently uses the generated master key.

## Pull request checklist

- [ ] The change is scoped and does not commit generated files or local databases.
- [ ] IPC schemas, APIs, and handlers remain consistent.
- [ ] Database initialization works for a fresh profile and existing profiles.
- [ ] Formatting and linting have been run where applicable.
- [ ] README documentation matches the implementation.
