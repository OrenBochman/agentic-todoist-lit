---
description: "Generate a practical test plan for a feature using unit tests, Playwright, contract mocks, and coverage goals"
agent: "agent"
model: GPT-5.3-Codex
tools: ["read", "search", "edit"]
---

Create a concise, actionable testing plan for the requested feature in this repository.

## Inputs

- Feature scope and acceptance criteria
- Changed files and affected modules/components
- Existing test infrastructure in the workspace

## Requirements

1. Include unit testing strategy for pure logic and component behavior.
2. Include Playwright UI testing strategy for critical user flows.
3. Include interface-contract testing using mocks/stubs for boundaries.
4. Include code-coverage approach with recommended thresholds.
5. Prioritize tests by risk and likely regression impact.
6. Propose exact file paths for new/updated test files.
7. Include runnable commands for local verification.

## Output format

Return sections in this order:

1. **Test Scope**
2. **Unit Tests**
3. **Playwright Tests**
4. **Contract Tests with Mocks**
5. **Coverage Plan**
6. **Execution Commands**
7. **Suggested File Changes**

Keep the plan practical and specific to this codebase. Avoid generic checklists.