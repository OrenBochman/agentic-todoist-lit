# Agentic Task Planner

A Lit + Vite single-page experience designed for quick task capture and completion management. Tasks persist locally, support completion toggles and deletion, and can be filtered across active, completed, and all states.

## Features

- Fast composer for adding tasks via button, Enter key, or keyboard shortcuts
- Toggle completion inline with tactile checkbox controls
- Filter by all, active, or completed workstreams and clear completed items in bulk
- LocalStorage persistence so the board survives refreshes
- Export and import todos as JSON files for manual backup and restore
- Material-style theme families (`coffe`, `teal`, `rose`) with light/dark variants
- Responsive, expressive visual system with hero metrics and accessible controls

## Web Components

- `task-planner`: app shell for task CRUD, filtering, persistence, and import/export actions
- `theme-switcher`: global header control for light/dark toggling and theme-family selection
- `task-transfer`: import/export control that transfers tasks as JSON and emits import events

## Tech Stack

- [Lit](https://lit.dev) for declarative, reactive web components
- [Vite](https://vitejs.dev) for development server, bundling, and preview
- [TypeScript](https://www.typescriptlang.org) for type safety
- [ESLint](https://eslint.org) (typescript-eslint + lit plugins) for linting and
- [Prettier](https://prettier.io) for formatting

## Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – type-check and create a production bundle
- `npm run preview` – serve the production bundle locally
- `npm run lint` – run ESLint across the workspace
- `npm run test` – run unit tests for utility logic
- `npm run test:watch` – run unit tests in watch mode
- `npm run format` – check formatting with Prettier

## Getting Started

1. Install dependencies: `npm install`
2. Start developing: `npm run dev` and open the provided localhost URL
3. Build for production: `npm run build`
4. Preview the production build: `npm run preview`

## Custom Copilot Configuration

Workspace-specific Copilot instructions live in `.github/copilot-instructions.md`, and custom agent definitions live under `.github/agents/` (see `Reviewer.agent.md`). Adjust those files to guide Copilot responses for this project.
Local reusable skills live under `.github/skills/` including `.github/skills/testing/SKILL.md` for unit, Playwright, mock-contract, and coverage workflows.

## Using Skills and Prompts

For faster onboarding and consistent output, start with these reusable assets:

- Skills:
  - `.github/skills/testing/SKILL.md`
  - `.github/skills/uml-mermaid/SKILL.md`
  - `.github/skills/uml-planet/SKILL.md`
- Prompts:
  - `.github/prompts/gen-testing-plan.prompt.md`
  - `.github/prompts/gen-tests.prompt.md`
  - `.github/prompts/gen-docs-comments.prompt.md`
  - `.github/prompts/lint.prompt.md`

Usage pattern:

1. Pick a skill for domain guidance (testing/diagrams).
2. Use a prompt for task-specific output shape (plan, tests, docs, linting).
3. Cross-check with `.github/copilot-instructions.md` for repo rules and completion criteria.
