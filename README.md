# React Admin Pro

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg?logo=tailwindcss)

> **A production-ready, high-performance admin dashboard template.**
> Built with React 19, TypeScript, Shadcn UI, and TanStack Query.

## ✨ Features

- **Authentication & Authorization** - Role-based access control with protected routes
- **Permissions Management** - Create, edit, and delete permissions with type (page/action) and unique identifier

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20 (recommended: use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) for version management)
- pnpm >= 8.0.0 (recommended) or npm

### Node.js Version Management

This project uses Node.js 20. We recommend using a version manager:

**Using fnm (Fast Node Manager - recommended):**

```bash
# Install fnm: https://github.com/Schniz/fnm
fnm install
fnm use
```

**Using nvm:**

```bash
# Install nvm: https://github.com/nvm-sh/nvm
nvm install
nvm use
```

The project includes a `.nvmrc` file that both fnm and nvm can read automatically.

### Installation

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## 🛠️ Development Tools

### Code Quality

- **ESLint** - JavaScript/TypeScript linting with React and TypeScript support
- **Prettier** - Code formatting for consistent style
- **TypeScript** - Static type checking

### Git Hooks (via Husky)

- **pre-commit** - Automatically runs:
  - `lint-staged` - Lints and formats only staged files
  - `test` - Runs test suite (if configured)
- **commit-msg** - Validates commit messages using Commitlint

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes
- `revert:` - Revert previous commits

## 📖 Documentation

For detailed architectural decisions and guidelines, please refer to the documentation folder:

- [Product Requirements (PRD)](./docs/prd.md)
- [System Architecture](./docs/architecture.md)
- [Frontend Rules](./docs/frontend-rules.md)

## 📄 License

This project is licensed under the MIT License.
