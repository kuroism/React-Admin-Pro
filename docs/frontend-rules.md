# Frontend Development Guidelines

To maintain code quality and consistency, all contributors must adhere to the following rules.

## 1. General Principles

- **Strict TypeScript:** No implicit `any`. All props and API responses must be typed.
- **Functional Paradigm:** Use Functional Components and Hooks exclusively.
- **Colocation:** Keep related files (styles, tests, logic) close to the component.

## 2. Component Design

- **Shadcn UI First:** Always check `@/components/ui` before building custom components.
- **Headless Logic:** Separate business logic (hooks) from UI rendering where possible.
- **Tailwind Usage:**
  - Use utility classes for layout and spacing.
  - Avoid arbitrary values (e.g., `w-[123px]`).
  - Use `cn()` utility for conditional class merging.

## 3. State Management Rules

- **Do NOT** put API data into Zustand/Redux. Use `TanStack Query` for all async data.
- **Do NOT** use `useEffect` for data fetching.
- **Do** use `Zustand` for global UI state (Sidebar toggle, Theme, User Session).

## 4. Routing & Data Loading

- Use **Loaders** for critical data pre-fetching.
- Use **Lazy Loading** (`React.lazy`) for all route pages.

## 5. Form Handling

- All forms must use **React Hook Form**.
- All validation logic must be defined via **Zod Schemas**.
- **Pattern:**
  ```typescript
  const formSchema = z.object({ ... });
  type FormValues = z.infer<typeof formSchema>;
  ```

## 6. Git & Commit Convention

- Follow **Conventional Commits**:
  - `feat: ...` for new features
  - `fix: ...` for bug fixes
  - `refactor: ...` for code restructuring
  - `chore: ...` for tooling/config changes
