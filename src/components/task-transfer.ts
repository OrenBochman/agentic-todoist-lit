import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
    buildExportFilename,
    buildExportPayload,
    extractImportedTasks,
    type TaskImportPayload,
    type TransferTask,
} from './task-transfer-utils'

/**
 * Transfer control module for todo import/export.
 *
 * This file isolates file-transfer UX from planner state orchestration so serialization and file
 * handling logic remain reusable. It depends on `task-transfer-utils` for deterministic payload
 * creation and normalization, browser File APIs for user-selected input, and global design tokens
 * for consistent button styling.
 *
 * Contracts and side effects:
 * - Input: `tasks` array from parent state.
 * - Output: emits `import-tasks` with normalized tasks.
 * - Side effects: opens file dialog, creates object URLs, triggers a download, and logs parse
 *   failures.
 */
@customElement('task-transfer')
/**
 * Web component that provides Import and Export actions for todo data.
 *
 * Why this exists:
 * - Keeps transfer concerns in a focused component aligned with the web-component architecture.
 * - Ensures planner components consume validated task data through a single event contract.
 *
 * Contracts:
 * - `tasks` is the current list to serialize during export.
 * - Dispatches `import-tasks` (`CustomEvent<{ tasks: TransferTask[] }>`), bubbling and composed.
 *
 * Data flow:
 * - Export path: `tasks` -> `buildExportPayload` -> Blob -> temporary download link.
 * - Import path: file input -> text read -> JSON parse -> `extractImportedTasks` -> event emit.
 *
 * Edge cases:
 * - Empty selection exits early without side effects.
 * - Input value is reset so selecting the same file again still triggers change.
 * - Invalid JSON is handled with warning logs, preserving current planner state.
 *
 * Dependencies:
 * - Browser APIs: `Blob`, `URL.createObjectURL`, `File.text`, and click-triggered downloads.
 * - Theme tokens: `--ghost-color` and `--focus-ring` for accessible focus and contrast behavior.
 */
export class TaskTransfer extends LitElement {
    @property({ type: Array })
    tasks: TransferTask[] = []

    render() {
        return html`
      <button class="ghost" type="button" @click=${this._openImportDialog}>Import</button>
      <button class="ghost" type="button" @click=${this._exportTasks}>Export</button>
      <input
        id="tasks-import-input"
        type="file"
        accept="application/json"
        @change=${this._handleImportFile}
        hidden
      />
    `
    }

    private _openImportDialog() {
        const importInput = this.renderRoot.querySelector<HTMLInputElement>('#tasks-import-input')
        importInput?.click()
    }

    private _exportTasks() {
        const payload = buildExportPayload(this.tasks)
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
        const downloadUrl = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = downloadUrl
        anchor.download = buildExportFilename()
        anchor.click()
        URL.revokeObjectURL(downloadUrl)
    }

    private async _handleImportFile(event: Event) {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]
        target.value = ''
        if (!file) {
            return
        }

        try {
            const rawText = await file.text()
            const parsed = JSON.parse(rawText) as TaskImportPayload | TransferTask[]
            const nextTasks = extractImportedTasks(parsed)
            this.dispatchEvent(
                new CustomEvent<{ tasks: TransferTask[] }>('import-tasks', {
                    detail: { tasks: nextTasks },
                    bubbles: true,
                    composed: true,
                }),
            )
        } catch (error) {
            console.warn('Unable to import tasks from file', error)
        }
    }

    static styles = css`
    :host {
      display: contents;
    }

    .ghost {
      background: transparent;
      color: var(--ghost-color);
      border: none;
      border-radius: 999px;
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .ghost:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }
  `
}

declare global {
    interface HTMLElementTagNameMap {
        'task-transfer': TaskTransfer
    }
}
