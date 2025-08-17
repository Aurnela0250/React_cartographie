---
trigger: glob
globs: **/*.ts,**/*.tsx,**/*.js
---

---

description: Defines the recommended state management strategies for Next.js 15 applications, including server and client contexts.
globs: app/\*_/_

---

- Use `useActionState` instead of deprecated `useFormState`.
- Leverage enhanced `useFormStatus` with new properties (data, method, action).
- Implement URL state management with 'nuqs'.
- Use Zustand for state management in client components when necessary.-
