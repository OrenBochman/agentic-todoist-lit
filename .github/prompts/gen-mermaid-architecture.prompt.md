---
description: 'Generate Mermaid architecture/UML diagrams from selection or current file'
agent: 'agent'
tools: ['read', 'search', 'edit']
---

Generate Mermaid diagram(s) for architecture or UML documentation by using the Mermaid skill:
[uml-mermaid skill](../../skills/uml-mermaid/SKILL.md).

## Scope
- If there is a selection, use only this input as the source context:
```
${selection}
```
- Otherwise, analyze the full open file: [${fileBasename}](${file}).

## Instructions
1. Follow the Mermaid workflow and syntax guidance in the referenced skill.
2. Infer the most appropriate diagram type from context:
   - `flowchart` for process/workflow
   - `sequenceDiagram` for interactions
   - `classDiagram` for domain/model structure
   - `erDiagram` for data relationships
   - `stateDiagram-v2` for stateful behavior
3. For architecture requests, prefer one high-level system diagram first, then add one focused detail diagram if useful.
4. Use concise labels and clear direction (`LR` or `TD`) for readability.
5. Include only valid Mermaid fenced blocks, ready to paste into Markdown.
6. If context is insufficient, ask 1-3 targeted questions before generating diagrams.

## Output
Return only Mermaid fenced code block(s) and a one-line title above each block.
