export type ThemeMode = 'light' | 'dark'

type ThemeListener = (theme: ThemeMode) => void

class ThemeStore {
  private readonly listeners = new Set<ThemeListener>()

  private readonly mediaQuery =
    typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)')

  private theme: ThemeMode = 'light'

  constructor() {
    if (this.mediaQuery) {
      this.theme = this.mediaQuery.matches ? 'dark' : 'light'
      this.mediaQuery.addEventListener('change', this._handleSystemThemeChange)
    }
    this._applyTheme()
  }

  get currentTheme(): ThemeMode {
    return this.theme
  }

  subscribe(listener: ThemeListener): () => void {
    this.listeners.add(listener)
    listener(this.theme)

    return () => {
      this.listeners.delete(listener)
    }
  }

  setTheme(nextTheme: ThemeMode): void {
    if (this.theme === nextTheme) {
      return
    }

    this.theme = nextTheme
    this._applyTheme()
    this._emit()
  }

  toggleTheme(): void {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
  }

  private _handleSystemThemeChange = (event: MediaQueryListEvent): void => {
    this.setTheme(event.matches ? 'dark' : 'light')
  }

  private _applyTheme(): void {
    if (typeof document === 'undefined') {
      return
    }
    document.documentElement.dataset.theme = this.theme
  }

  private _emit(): void {
    for (const listener of this.listeners) {
      listener(this.theme)
    }
  }
}

export const themeStore = new ThemeStore()
