---
trigger: glob
globs: **/*.js,**/*.tsx,**/*.ts
---

---

description: Specifies the best practices for building React components within the Next.js 15 App Router structure.
globs: app/\*_/_

---

- Favor React Server Components (RSC) where possible.
- Minimize `use client`, `useEffect`, and `setState`.
- Implement proper error boundaries.
- Wrap client components in `Suspense` with fallback.
- Follow Next.js 15 docs for Data Fetching, Rendering, and Routing.
- Optimize for performance and Web Vitals.
- Favor server components and Next.js SSR.
- Use only for Web API access in small components.
- Avoid for data fetching or state management.
- Structure project as Progressive Web App (PWA) with offline capabilities, app-like experience, and installability across devices.
- Target **Next.js 15+** and leverage the App Router, React Server Components (RSC), and SSR capabilities.
