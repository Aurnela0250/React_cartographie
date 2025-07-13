# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OrientationMada is a web platform that helps Malagasy high school graduates find higher education institutions. Built with Next.js 15 (App Router), React 19, TypeScript, and follows Clean Architecture principles. The application provides search functionality, detailed institution information, and interactive mapping features for educational establishments in Madagascar.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with Turbo
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run all linters (Next.js, Oxlint, ESLint)
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Development Workflow
1. Always run `npm run lint` and `npm run format:check` before committing
2. Use `npm run lint:fix` to automatically fix most linting issues
3. Development server uses Turbo for faster builds

## Architecture

### Clean Architecture Implementation
The project follows Clean Architecture principles with clear separation of concerns:

```
core/                          # Business logic layer
├── entities/                  # Domain entities
├── interfaces/               # Repository interfaces  
└── filters/                  # Domain filters

infrastructure/               # External concerns layer
├── repositories/            # API implementations
├── server-actions/          # Next.js server actions
├── services/               # External services
└── store/                  # Dependency injection container

presentation/               # UI layer
├── components/             # React components
├── hooks/                  # Custom React hooks
├── providers/              # Context providers
└── schemas/                # Form validation schemas

app/                        # Next.js App Router
├── (auth)/                 # Authentication routes
├── (default)/              # Public routes  
├── admin/                  # Admin interface
└── api/                    # API routes
```

### Key Architectural Concepts

1. **Dependency Injection**: Uses a Container singleton (`infrastructure/store/container.ts`) for managing dependencies
2. **Repository Pattern**: All external data access goes through repository interfaces defined in `core/interfaces/`
3. **Entity-Based**: Domain models in `core/entities/` represent business concepts
4. **Server Actions**: Next.js server actions in `infrastructure/server-actions/` handle form submissions and API calls

### Authentication System
- JWT-based authentication with access/refresh token pattern
- Middleware (`middleware.ts`) handles route protection and token validation
- Auth state managed through custom hooks (`presentation/hooks/use-auth.ts`)
- Environment variables for API configuration via `@t3-oss/env-nextjs`

## Technology Stack

### Core Framework
- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** for type safety

### UI/Styling
- **Tailwind CSS** for styling
- **Shadcn/UI** + **Radix UI** for component library
- **Lucide React** for icons
- **Framer Motion** for animations

### Data & State
- **TanStack Query** for server state management
- **Nuqs** for URL state management  
- **React Hook Form** + **Zod** for forms and validation

### Mapping
- **Leaflet** + **React Leaflet** for interactive maps
- **MapTiler SDK** for map tiles and services
- Environment variable `NEXT_PUBLIC_MAP_API_KEY` required

### Development Tools
- **ESLint** + **Oxlint** for code quality
- **Prettier** for code formatting
- **TypeScript** for static analysis

## Code Conventions

### Following .cursorrules
The project has specific code style guidelines in `.cursorrules`:
- Use TypeScript for all code
- Prefer interfaces over types
- Avoid enums, use const maps instead
- Use functional and declarative patterns
- Follow React 19 and Next.js 15 best practices
- Minimize 'use client' directives, favor Server Components
- Use `useActionState` instead of deprecated `useFormState`
- Handle async params properly: `const params = await props.params`

### Component Structure
- Place components in appropriate feature folders under `presentation/components/features/`
- Use named exports
- Follow the pattern: exports, subcomponents, helpers, types
- Prefix event handlers with "handle"

### File Organization
- Admin features: `app/admin/[feature]/components/`
- Public features: `app/(default)/[feature]/` and `presentation/components/features/`
- Shared UI components: `presentation/components/ui/`
- Business logic: `core/entities/` and `core/interfaces/`
- Data access: `infrastructure/repositories/`

## Environment Setup

### Required Environment Variables
```
# API Configuration
API_PREFIX_URL=http://localhost:8000/api
API_VERSION=v1
AUTH_SECRET=your_auth_secret

# Map Configuration  
MAP_API_KEY=your_maptiler_key
NEXT_PUBLIC_MAP_API_KEY=your_maptiler_key
```

### External Dependencies
- Backend API expected at `http://localhost:8000/api/v1/`
- MapTiler account for mapping functionality
- JWT-based authentication system

## Common Patterns

### Data Fetching
```typescript
// Repository pattern for API calls
const repository = container.getEstablishmentRepository();
const establishments = await repository.getAll(token, paginationParams);
```

### Server Actions
```typescript
// Located in infrastructure/server-actions/
export async function createEstablishment(data: CreateEstablishmentData) {
  const container = Container.getInstance();
  const repository = container.getEstablishmentRepository();
  // Implementation...
}
```

### Form Handling
```typescript
// Using React Hook Form + Zod validation
const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

## Important Notes

- The project is actively being refactored from an older structure
- Some files may reference deprecated patterns - follow the Clean Architecture approach for new code
- Always check existing entity definitions in `core/entities/` before creating new ones
- Use the existing repository interfaces in `core/interfaces/` for data access
- Admin interface uses extensive CRUD operations with consistent patterns across features