# Agentic Task Planner

A Lit + Vite single-page experience designed for quick task capture and completion management. Tasks persist locally, support completion toggles and deletion, and can be filtered across active, completed, and all states.

## Features
- Fast composer for adding tasks via button, Enter key, or keyboard shortcuts
- Toggle completion inline with tactile checkbox controls
- Filter by all, active, or completed workstreams and clear completed items in bulk
- LocalStorage persistence so the board survives refreshes
- Responsive, expressive visual system with hero metrics and accessible controls

## Tech Stack
- [Lit](https://lit.dev) for declarative, reactive web components
- Vite for development server, bundling, and preview
- TypeScript for type safety
- ESLint (typescript-eslint + lit plugins) and Prettier for linting and formatting

## Scripts
- `npm run dev` – start the Vite dev server
- `npm run build` – type-check and create a production bundle
- `npm run preview` – serve the production bundle locally
- `npm run lint` – run ESLint across the workspace
- `npm run format` – check formatting with Prettier

## Getting Started
1. Install dependencies: `npm install`
2. Start developing: `npm run dev` and open the provided localhost URL
3. Build for production: `npm run build`
4. Preview the production build: `npm run preview`

## Custom Copilot Configuration
Workspace-specific Copilot instructions live in `.github/copilot-instructions.md`, and custom agent definitions live under `.github/agents/` (see `Reviewer.agent.md`). Adjust those files to guide Copilot responses for this project.
