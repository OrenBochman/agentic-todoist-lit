---
description: 'Generate literate block comments for the current file or selection'
agent: 'agent'
model: GPT-5.3-Codex
tools: ['read', 'search', 'edit']
---

Analyze the provided source (TypeScript, HTML, or CSS) and emit high-value block comments that follow literate programming practices: describe purpose, invariants, data flow, and any subtle UX or accessibility considerations so that future readers can treat the code as documentation-first.

### Scope

- Default to the full file: [${fileBasename}](${file}).
- If a selection is present, only document:
```
${selection}
```

### Instructions

1. Read the workspace standards in [.github/copilot-instructions.md](../../copilot-instructions.md) and honor them.
2. For every file-level concept, class, and exported function in scope, generate exactly one preceding block comment:
	- TypeScript/JavaScript: `/** ... */`
	- HTML templates: `<!-- ... -->`
	- CSS: `/* ... */`
3. Each comment must explain **why** the construct exists, its contracts (inputs/outputs/side effects), and notable edge cases. Avoid narrating obvious syntax.
4. Call out dependencies (storage, network, design tokens) by name when they inform the behavior.
5. Keep lines under 100 characters and stay within ASCII.
6. If existing comments already satisfy these goals, return a single sentence stating that no additional documentation is required.

### Output

Return the finalized comments, as a patch in their corresponding blocks, ready to be applied or discarded.
