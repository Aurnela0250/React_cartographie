# AGENTS.md - Development Commands & Guidelines

## Build/Lint/Test Commands

- `pnpm dev` - Start dev server with Turbo
- `pnpm build` - Build production
- `pnpm lint` - Run all linters (Next.js, Oxlint, ESLint)
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm format` - Format with Prettier
- `pnpm format:check` - Check formatting

## Code Style Guidelines

- Use TypeScript for all code, prefer interfaces over types
- Follow Clean Architecture: core/ (entities), infrastructure/ (repositories), presentation/ (UI)
- Use functional patterns, early returns, descriptive names with auxiliary verbs (isLoading, hasError)
- Prefix event handlers with "handle" (handleClick, handleSubmit)
- Minimize 'use client' directives, favor Server Components
- Use Tailwind CSS with responsive prefixes (mobile-first)
- Import order: React → Next.js → external libs → internal → relative → types
- Error handling: use try/catch with proper error boundaries
- Naming: lowercase-with-dashes for directories, PascalCase for components
