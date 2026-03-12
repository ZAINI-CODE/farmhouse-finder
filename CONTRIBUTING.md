# Contributing to BookFarm

Thank you for your interest in contributing to BookFarm! This guide will help you get started.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style Guidelines](#code-style-guidelines)
- [Making Changes](#making-changes)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create a branch** for your changes
4. **Make your changes** following the guidelines below
5. **Submit a pull request**

---

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

```bash
# Clone your fork
git clone <YOUR_FORK_URL>
cd bookfarm

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images and media
│   ├── components/
│   │   ├── home/            # Homepage sections
│   │   ├── layout/          # Navbar, Footer
│   │   ├── messaging/       # Messaging components
│   │   ├── properties/      # Property-related components
│   │   ├── reviews/         # Review components
│   │   └── ui/              # shadcn/ui base components
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Backend client and types (auto-generated)
│   ├── lib/                 # Utility functions
│   └── pages/               # Route page components
├── supabase/
│   ├── functions/           # Backend functions
│   └── config.toml          # Backend configuration
└── PROJECT_DOCUMENTATION.md # Full project documentation
```

---

## Code Style Guidelines

### General

- Use **TypeScript** for all new files
- Follow existing patterns and conventions in the codebase
- Keep components small and focused — one responsibility per component

### React & Components

- Use **functional components** with hooks
- Use `React.FC` or explicit return types
- Prefer named exports over default exports for components
- Place reusable components in `src/components/ui/`
- Place feature-specific components in their respective directories

### Styling

- Use **Tailwind CSS** utility classes
- **Always use semantic design tokens** from `index.css` — never hardcode colors
- Use CSS variables like `--primary`, `--background`, `--foreground`, etc.
- Ensure both light and dark mode compatibility

```tsx
// ✅ Correct
<div className="bg-background text-foreground border-border">

// ❌ Incorrect
<div className="bg-white text-black border-gray-200">
```

### State Management

- Use **TanStack Query** for server state (data fetching)
- Use **React Hook Form** + **Zod** for form handling and validation
- Use React `useState` / `useReducer` for local UI state

### File Naming

- Components: `PascalCase.tsx` (e.g., `PropertyCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.tsx`)
- Pages: `PascalCase.tsx` (e.g., `Dashboard.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)

---

## Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in small, logical commits

3. Test your changes thoroughly:
   - Verify the feature works in both light and dark mode
   - Check responsiveness on mobile and desktop viewports
   - Ensure no TypeScript errors (`npm run build`)

4. Update documentation if your changes affect:
   - New pages or routes → update `PROJECT_DOCUMENTATION.md`
   - New features → add an entry to `CHANGELOG.md`

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short description>
```

### Types

| Type       | Description                          |
|------------|--------------------------------------|
| `feat`     | A new feature                        |
| `fix`      | A bug fix                            |
| `docs`     | Documentation changes                |
| `style`    | Code style changes (no logic change) |
| `refactor` | Code refactoring                     |
| `test`     | Adding or updating tests             |
| `chore`    | Maintenance tasks                    |

### Examples

```
feat(booking): add service add-on selection step
fix(auth): resolve session persistence on refresh
docs(readme): update development setup instructions
```

---

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Fill out the PR template with:
   - **Description** of what changed and why
   - **Screenshots** for any UI changes
   - **Testing steps** to verify the change
3. Request a review from a maintainer
4. Address any feedback promptly
5. Once approved, a maintainer will merge your PR

---

## Reporting Bugs

When reporting a bug, please include:

- **Description**: Clear explanation of the issue
- **Steps to Reproduce**: Numbered steps to trigger the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, screen size

Use the **Bug Report** issue template if available.

---

## Suggesting Features

We welcome feature suggestions! Please include:

- **Problem**: What problem does this feature solve?
- **Proposed Solution**: How should it work?
- **Alternatives Considered**: Any other approaches you thought of?
- **Additional Context**: Mockups, examples, or references

Use the **Feature Request** issue template if available.

---

## Important Notes

- **Do not modify** auto-generated files:
  - `src/integrations/supabase/client.ts`
  - `src/integrations/supabase/types.ts`
  - `supabase/config.toml`
  - `.env`
- **Database changes** must go through migration files in `supabase/migrations/`
- **Never store secrets** or API keys in code — use environment variables

---

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions. We are committed to providing a welcoming and harassment-free experience for everyone.

---

Thank you for helping make BookFarm better! 🏡
