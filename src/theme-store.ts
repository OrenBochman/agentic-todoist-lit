/**
 * Global theme state model for mode and palette family.
 *
 * This module exists to keep theme behavior consistent across components and to enforce one
 * source of truth for system-driven light/dark mode. It depends on `matchMedia` for
 * `prefers-color-scheme` updates and writes to `document.documentElement.dataset.theme` so CSS
 * design tokens can react without per-component styling logic.
 *
 * Invariants:
 * - Mode defaults to light, then reflects current system preference when available.
 * - Theme family is runtime state only; no persistence to localStorage or other storage.
 * - Emitted state is immutable to subscribers by returning shallow copies.
 */
export type ThemeMode = 'light' | 'dark'
export type ThemeFamily = 'coffe' | 'teal' | 'rose'

export interface ThemeState {
  mode: ThemeMode
  family: ThemeFamily
}

type ThemeListener = (theme: ThemeState) => void

/**
 * Reactive store that coordinates app theme mode and family.
 *
 * Why this exists:
 * - Centralizes all theme transitions to avoid conflicting updates between components.
 * - Translates state into a DOM-level `data-theme` value consumed by global CSS tokens.
 *
 * Contracts:
 * - `subscribe(listener)` immediately emits current state and returns an unsubscribe function.
 * - `setTheme` and `setThemeFamily` are idempotent when the requested value is already active.
 * - `toggleTheme` flips between light and dark while preserving the selected family.
 *
 * Side effects:
 * - Registers a `matchMedia` change listener when `window` is available.
 * - Updates `document.documentElement.dataset.theme` as `<family>-<mode>`.
 *
 * Edge cases:
 * - In non-browser contexts (`window` or `document` absent), media and DOM effects are skipped.
 * - Listener callbacks execute synchronously; subscribers must remain fast to avoid UI stalls.
 */
class ThemeStore {
  private readonly listeners = new Set<ThemeListener>()

  private readonly mediaQuery =
    typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)')

  private theme: ThemeState = {
    mode: 'light',
    family: 'coffe',
  }

  constructor() {
    if (this.mediaQuery) {
      this.theme.mode = this.mediaQuery.matches ? 'dark' : 'light'
      this.mediaQuery.addEventListener('change', this._handleSystemThemeChange)
    }
    this._applyTheme()
  }

  get currentTheme(): ThemeMode {
    return this.theme.mode
  }

  get currentState(): ThemeState {
    return { ...this.theme }
  }

  subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener)
    listener(this.currentState)

    return () => {
      this.listeners.delete(listener)
    }
  }

  setTheme(nextTheme: ThemeMode): void {
    if (this.theme.mode === nextTheme) {
      return
    }

    this.theme = {
      ...this.theme,
      mode: nextTheme,
    }
    this._applyTheme()
    this._emit()
  }

  toggleTheme(): void {
    this.setTheme(this.theme.mode === 'dark' ? 'light' : 'dark')
  }

  setThemeFamily(nextFamily: ThemeFamily): void {
    if (this.theme.family === nextFamily) {
      return
    }

    this.theme = {
      ...this.theme,
      family: nextFamily,
    }
    this._applyTheme()
    this._emit()
  }

  private _handleSystemThemeChange = (event: MediaQueryListEvent): void => {
    this.setTheme(event.matches ? 'dark' : 'light')
  }

  private _applyTheme(): void {
    if (typeof document === 'undefined') {
      return
    }
    document.documentElement.dataset.theme = `${this.theme.family}-${this.theme.mode}`
  }

  private _emit(): void {
    for (const listener of this.listeners) {
      listener(this.currentState)
    }
  }
}

export const themeStore = new ThemeStore()
