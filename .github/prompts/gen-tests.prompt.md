---
description: 'Generate unit tests for the current file'
agent: 'agent'
tools: ['search', 'read', 'edit']
---
Generate unit tests for [${fileBasename}](${file}).

* Place the test file in the same directory: ${fileDirname}
* Name the test file: ${fileBasenameNoExtension}.test.ts
* Test framework: ${input:framework:jest or vitest}
* Follow testing conventions in: [testing.md](../docs/testing.md)

If there is a selection, only generate tests for this code:
${selection}