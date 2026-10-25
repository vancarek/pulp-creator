# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For the generic app structure this repo follows (folder layout, routing
pattern, naming conventions, testing split, CI/CD) see
[`maat-core/STRUCTURE.md`](https://github.com/maat-apps/maat-core/blob/main/STRUCTURE.md).
For the "verify each change exactly once" principle, see
[`maat-core/VERIFICATION.md`](https://github.com/maat-apps/maat-core/blob/main/VERIFICATION.md).
What follows here is what's specific to **pulp-creator**: a character
creator and sheet for Pulp Cthulhu (Polish edition), for one gaming group.
Product design and roadmap: [`docs/PLAN.md`](./docs/PLAN.md).

## Project Snapshot

- Vite + React + TypeScript, Tailwind v4, shadcn (`base-nova`, Base UI).
- Phones and desktops alike (no MobileGate); a PWA on GitHub Pages.
- UI copy is Polish only — no i18n layer (a deliberate deviation from
  STRUCTURE.md: one group, one language).

## Commands

| Purpose   | Command                 |
| --------- | ----------------------- |
| Dev       | `npm run dev`           |
| Build     | `npm run build`         |
| Lint      | `npm run lint:fix`      |
| Format    | `npm run format`        |
| Typecheck | `npm run typecheck`     |
| Unit test | `npm run test:coverage` |
| E2E test  | `npm run test:e2e`      |
| Validate  | `npm run validate`      |

## What we take from maat-core — and what not

- **Taken:** folder layout and conventions, `@maat-apps/config`
  (ESLint/Prettier/TS), `@maat-apps/core` (`/sw` now; `/github`, `/crypto`,
  `/validation` for the data repository), Valibot at trust boundaries,
  Vitest/Playwright split, the reusable CI/CD workflows.
- **Not taken:** `@maat-apps/ui` and its theme (true black on Outfit), the
  app lock (access here is a per-character password set by the keeper), i18n.

## Design

- The look follows the official Polish character sheet (Black Monk): paper
  `#f7dbb4`, navy `#41437e`, red `#d04f5a`, salmon band `#e8916b`. Tokens
  live in `src/app/globals.css` under shadcn's names, so generated
  components pick them up; don't hardcode colors in components.
- Fonts (self-hosted via Fontsource, so they work offline): Barlow Condensed
  for headings/labels (stands in for Verlag Condensed / Myriad Pro Bold
  Cond), Source Sans 3 for text (Myriad's open sibling), Rye for the logo.
- `.pulp-heading` / `SectionHeading` for section titles, `ValueBox` for
  every value box (full value only, no half/fifth). Section names and skill names match the printed
  sheet exactly.
- `src/components/ui/` holds shadcn-generated primitives. The shadcn
  registry may be unreachable from cloud sessions; generate with
  `npx shadcn add <component>` locally when possible.
- Printing is the PDF export: both tabs print (see the `[hidden]` override
  in `globals.css`), app chrome is `print:hidden`.

## Data

- `src/lib/character.ts` is the stored format (Valibot schema). Skills and
  weapons parse entry by entry. Changing a field's meaning is a data
  migration for `pulp-data`.
- Rules data in `src/lib/rules/`. `skills.ts` matches the printed sheet;
  `archetypes.ts` and `talents.ts` are drafts to verify against the book.

## Workflow Rules

- Don't re-run the full validate gate locally before pushing once CI exists
  for it — see VERIFICATION.md.
- Never edit or commit directly on `main`.
