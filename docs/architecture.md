# System Architecture

## 1. Technology Stack & Rationale

| Layer          | Technology          | Key Rationale                                                           |
| :------------- | :------------------ | :---------------------------------------------------------------------- |
| **Core**       | **React 19**        | Embracing the latest concurrent features.                               |
| **Build**      | **Vite**            | Instant server start and HMR.                                           |
| **Language**   | **TypeScript 5**    | Strict mode enabled. "Zero Any" policy.                                 |
| **Styling**    | **Tailwind CSS v3** | Utility-first approach. Pinned to v3 for Shadcn UI compatibility.       |
| **UI Kit**     | **Shadcn UI**       | Headless architecture. Full ownership of component code.                |
| **State**      | **Zustand**         | Minimalist client state (Auth, Theme).                                  |
| **Async Data** | **TanStack Query**  | Manages server state (caching, deduplication) separately from UI state. |
| **Routing**    | **React Router v7** | Utilizing the **Data Router** pattern (Loaders/Actions).                |
| **Forms**      | **React Hook Form** | Uncontrolled components for optimal performance.                        |
| **Validation** | **Zod**             | Schema-first validation shared between forms and API types.             |

## 2. Directory Structure (Feature-Based)

We adopt a **Feature-Sliced** inspired approach to keep business logic encapsulated.

```text
src/
├── api/                # Shared API clients and interceptors
├── components/         # Shared UI components
│   ├── ui/             # Shadcn primitives (Button, Input)
│   └── common/         # App-specific shared components
├── features/           # 📦 Business Domains (Self-contained modules)
│   ├── auth/           # Login logic, guards, session hooks
│   ├── dashboard/      # Analytics charts, KPI cards
│   └── users/          # User management (Tables, Modals, API)
├── hooks/              # Global utility hooks
├── layouts/            # Layout shells
├── lib/                # Static configuration (utils, constants)
├── pages/              # Route entry points (Composition layer only)
├── router/             # Router configuration
├── stores/             # Global Zustand stores
└── types/              # Shared TS interfaces
```

## 3. Data Flow Strategy

1.  **Server State:** Handled by `TanStack Query`. Components subscribe to query keys.
2.  **Client State:** Handled by `Zustand` (e.g., `useAuthStore`).
3.  **Prop Drilling:** Avoided. Use Composition or Context for compound components.
