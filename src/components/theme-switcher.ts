import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { themeStore, type ThemeMode } from '../theme-store'

@customElement('theme-switcher')
export class ThemeSwitcher extends LitElement {
  @property({ type: String })
  theme: ThemeMode = 'light'

  render() {
    const darkModeEnabled = this.theme === 'dark'
    return html`
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
    `
  }

  private _toggleTheme(): void {
    themeStore.toggleTheme()
  }

  static styles = css`
    :host {
      display: inline-flex;
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
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-switcher': ThemeSwitcher
  }
}
