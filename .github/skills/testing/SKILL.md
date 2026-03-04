---
name: testing
description: "Design and implement test strategy for TypeScript web apps. Use when asked for unit testing, Playwright UI testing, mocking interface contracts, and coverage reporting workflows."
license: MIT
---

# Testing Workflows Skill

## Overview

This skill defines a practical testing playbook for the Lit monorepo with four pillars:

1. Unit testing
2. Playwright UI testing
3. Interface-contract testing with mocks
4. Coverage reporting and thresholds

Use this skill when adding tests for new features, debugging regressions, or raising quality gates.

## Unit Testing

### Goal

Validate pure logic and component-adjacent behavior with fast, deterministic tests.

### Recommended stack

- `vitest` for test runner and assertions
- `@testing-library/dom` or `@open-wc/testing` for web component behavior

### File conventions

- Logic tests: `tests/**/*.test.ts`
- Co-located optional: `src/**/__tests__/*.test.ts`

### Unit test checklist

- Test happy paths first
- Add invalid input and edge-case coverage
- Use deterministic clocks/IDs via injected factories
- Keep tests isolated from network and real filesystem

### Example commands

```bash
npm run test
npm run test:watch
```

## Playwright UI Testing

### Goal

Verify user-visible flows in real browser contexts.

### Recommended scope

- Smoke test: app loads and primary controls are visible
- Feature flow: create, edit, import, export, filter
- Theme behavior: reacts to system dark mode and toggle actions

### Suggested structure

- E2E tests: `e2e/**/*.spec.ts`
- Config: `playwright.config.ts`

### Example setup

```bash
npm install -D @playwright/test
npx playwright install
```

### Example commands

```bash
npx playwright test
npx playwright test --ui
npx playwright test e2e/import-export.spec.ts
```

### Core assertions to include

- ARIA-visible controls and keyboard access
- File import/export flow completion
- Expected state updates in UI after actions

## Interface-Contract Testing with Mocks

### Goal

Lock API or boundary contracts so refactors do not break integrations.

### What to mock

- Browser APIs: `localStorage`, `matchMedia`, `URL.createObjectURL`, `File`
- Network boundaries: fetch clients, adapters, service layer calls
- Time/ID generators for deterministic output

### Contract strategy

- Define input and output shape expectations explicitly
- Assert both payload content and ordering semantics
- Fail tests on missing required fields or unexpected enum values

### Pattern

1. Build contract fixture payload
2. Run boundary function
3. Assert normalized output shape and side effects
4. Assert error behavior for malformed contract inputs

### Example mock snippets (Vitest)

```ts
vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => undefined)
```

## Coverage Reporting

### Goal

Track confidence level and enforce minimum thresholds.

### Recommended tooling

- Vitest coverage provider (`v8`)
- Optional report formats: text, html, lcov

### Example config (package scripts)

```json
{
  "scripts": {
    "test": "vitest run",
    "coverage": "vitest run --coverage"
  }
}
```

### Threshold guidance

- Statements: >= 85%
- Branches: >= 75%
- Functions: >= 85%
- Lines: >= 85%

Tune thresholds by module criticality. Raise on stable modules, relax on volatile prototypes.

### Example commands

```bash
npm run coverage
```

## Execution Workflow (Recommended)

1. Write unit tests for new logic before wiring UI
2. Add contract tests for boundaries and mocks
3. Add Playwright scenario for the end-user path
4. Run full test suite and coverage
5. Fix regressions, then update docs if behavior changed

## Quality Gates

Before marking a feature done:

- Unit tests pass
- Contract tests pass
- E2E smoke path passes
- Coverage meets threshold for changed modules
- No flaky tests across two consecutive runs

## Notes for This Repository

- Prefer web-component-level testing for reusable controls
- Keep parser and import/export utilities pure for unit coverage
- Avoid relying on persistent theme storage in tests; system mode is source of truth
