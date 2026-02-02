---
description: Use Bun with Next.js (App Router).
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

Default to Bun for package management and scripts, and follow Next.js
conventions (App Router).

- Use `bun install` instead of `npm install` or `yarn install`
- Use `bun run dev` for local development
- Use `bun run build` and `bun run start` for production
- Use `bunx <package> <command>` instead of `npx <package> <command>`
- Bun automatically loads `.env`, so avoid dotenv

## Next.js

- Use the App Router (`app/`) for routes and layouts
- API routes live in `app/api/**/route.ts`
- Prefer Next.js primitives: `next/link`, `next/image`, `next/navigation`
- Global styles live in `styles/globals.css`

## Testing

Use `bun test` for unit tests when added. For Next.js component or
integration tests, prefer the existing repo setup and add new tooling
only if requested.
