import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { themeStore, type ThemeFamily, type ThemeMode } from '../theme-store'

/**
 * Theme control surface for the app header.
 *
 * This module exists to keep theme interactions local to one web component while delegating all
 * state authority to `themeStore`. The component receives mode and family as reactive inputs,
 * then emits user intent through store calls rather than mutating global DOM state directly.
 *
 * Contracts and side effects:
 * - Inputs: `theme` and `family` properties from parent state.
 * - Outputs: calls to `themeStore.toggleTheme()` and `themeStore.setThemeFamily()`.
 * - Side effects: store updates propagate to document-level theme attributes and CSS tokens.
 *
 * UX and a11y notes:
 * - Uses native `button` and `select` semantics for keyboard support.
 * - Preserves visible focus indicators via shared design tokens (`--focus-ring`).
 * - Restricts family options to sanctioned themes so unsupported palettes are never requested.
 */
@customElement('theme-switcher')
/**
 * Header theme switcher web component.
 *
 * Why this exists:
 * - Separates presentation of theme controls from the planner screen logic.
 * - Keeps light/dark toggling and theme-family selection reusable across layouts.
 *
 * Contracts:
 * - `theme`: current mode (`light` or `dark`) used to compute labels and pressed state.
 * - `family`: current palette key (`coffe`, `teal`, `rose`) reflected in the select control.
 *
 * Data flow:
 * - Parent passes state into properties.
 * - User actions call store APIs, store notifies subscribers, parent re-renders with new props.
 *
 * Edge cases:
 * - Casts select values to `ThemeFamily`; option list must stay aligned with store unions.
 * - If parent props lag behind store updates, controls can momentarily show stale values.
 *
 * Dependencies:
 * - `themeStore` for global theme state transitions.
 * - Global CSS tokens (`--chip-*`, `--focus-ring`, `--color-text-tertiary`) for themed styling.
 */
export class ThemeSwitcher extends LitElement {
  @property({ type: String })
  theme: ThemeMode = 'light'

  @property({ type: String })
  family: ThemeFamily = 'coffe'

  render() {
    const darkModeEnabled = this.theme === 'dark'
    return html`
      <div class="theme-controls">
        <button
          class="theme-toggle"
          type="button"
          @click=${this._toggleTheme}
          aria-label=${darkModeEnabled ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed=${darkModeEnabled}
        >
          <span aria-hidden="true">${darkModeEnabled ? '☀️' : '🌙'}</span>
          <span>${darkModeEnabled ? 'Light mode' : 'Dark mode'}</span>
        </button>

        <label class="theme-family-label" for="theme-family-select">Theme</label>
        <select
          id="theme-family-select"
          class="theme-family"
          .value=${this.family}
          @change=${this._changeThemeFamily}
          aria-label="Select theme family"
        >
          <option value="coffe">Coffe</option>
          <option value="teal">Teal</option>
          <option value="rose">Rose</option>
        </select>
      </div>
    `
  }

  private _toggleTheme(): void {
    themeStore.toggleTheme()
  }

  private _changeThemeFamily(event: Event): void {
    const target = event.target as HTMLSelectElement
    themeStore.setThemeFamily(target.value as ThemeFamily)
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    .theme-controls {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .theme-toggle {
      border: 1px solid var(--chip-border);
      border-radius: 999px;
      padding: 0.45rem 0.9rem;
      background: var(--chip-bg);
      color: var(--chip-color);
      font: inherit;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
    }

    .theme-toggle:hover {
      transform: translateY(-1px);
    }

    .theme-toggle:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }

    .theme-family-label {
      font-size: 0.8rem;
      color: var(--color-text-tertiary);
    }

    .theme-family {
      border: 1px solid var(--chip-border);
      border-radius: 999px;
      padding: 0.45rem 0.85rem;
      background: var(--chip-bg);
      color: var(--chip-color);
      font: inherit;
      cursor: pointer;
    }

    .theme-family:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-switcher': ThemeSwitcher
  }
}
