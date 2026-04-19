# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

This project uses pnpm (v10+) and requires Node.js >= 20.

```bash
pnpm install          # Install dependencies
pnpm build            # Compile TypeScript (uses tsdown)
pnpm test             # Run Jest tests
pnpm pretty:check     # Check Prettier formatting
pnpm pretty:fix       # Fix formatting issues
```

To run a single test file:
```bash
pnpm test src/__tests__/rss2.spec.ts
```

## Architecture

This library generates RSS 2.0, Atom 1.0, and JSON Feed 1.0 feeds from a common data model.

**Core Pattern**: The `Feed` class (`src/feed.ts`) stores feed configuration and items. Three renderer functions transform this data into different output formats:

- `src/feed.ts` - Main Feed class with `rss2()`, `atom1()`, `json1()` methods
- `src/rss2.ts` - RSS 2.0 XML renderer
- `src/atom1.ts` - Atom 1.0 XML renderer
- `src/json.ts` - JSON Feed 1.0 renderer
- `src/typings/index.ts` - TypeScript interfaces (Item, Author, Category, Enclosure, FeedOptions)

**Dependencies**: Uses `xml-js` for XML generation. Path alias `@app/*` maps to `src/*`.

**Testing**: Jest with snapshot testing. Snapshots in `src/__tests__/__snapshots__/` ensure output consistency across formats.
