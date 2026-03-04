import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import './components/theme-switcher.ts'
import { themeStore, type ThemeMode } from './theme-store'

type TaskFilter = 'all' | 'active' | 'completed'

interface TaskItem {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

@customElement('task-planner')
export class TaskPlanner extends LitElement {
  private static readonly STORAGE_KEY = 'task-planner-tasks'

  @property({ type: Array })
  tasks: TaskItem[] = []

  @state()
  private filter: TaskFilter = 'all'

  @state()
  private newTask = ''

  @state()
  private theme: ThemeMode = 'light'

  private unsubscribeTheme?: () => void

  connectedCallback(): void {
    super.connectedCallback()
    this.unsubscribeTheme = themeStore.subscribe((theme) => {
      this.theme = theme
    })

    const stored = localStorage.getItem(TaskPlanner.STORAGE_KEY)
    if (stored) {
      try {
        const parsed: TaskItem[] = JSON.parse(stored)
        this.tasks = parsed.sort((a, b) => b.createdAt - a.createdAt)
      } catch (error) {
        console.warn('Unable to parse stored tasks', error)
      }
    }
  }

  disconnectedCallback(): void {
    this.unsubscribeTheme?.()
    this.unsubscribeTheme = undefined
    super.disconnectedCallback()
  }

  protected updated(changed: Map<string | number | symbol, unknown>): void {
    if (changed.has('tasks')) {
      localStorage.setItem(TaskPlanner.STORAGE_KEY, JSON.stringify(this.tasks))
    }
  }

  render() {
    const filteredTasks = this._filteredTasks
    const { total, active, completed } = this._stats

    return html`
      <section class="planner-shell">
        <header class="planner-hero">
          <div class="hero-topbar">
            <p class="eyebrow">Agentic Todoist</p>
            <theme-switcher .theme=${this.theme}></theme-switcher>
          </div>
          <h1>Design your day with intent.</h1>
          <p class="subtitle">
            Capture tasks, track focus, and keep momentum with a fast, tactile board.
          </p>
          <div class="hero-metrics">
            <article>
              <span>${total}</span>
              <label>Total</label>
            </article>
            <article>
              <span>${active}</span>
              <label>In Flight</label>
            </article>
            <article>
              <span>${completed}</span>
              <label>Shipped</label>
            </article>
          </div>
        </header>

        <div class="panel">
          <div class="composer">
            <input
              type="text"
              placeholder="Capture a new task…"
              .value=${this.newTask}
              @input=${this._handleInput}
              @keyup=${this._handleKeyUp}
            />
            <button class="primary" @click=${this._addTask}>Add Task</button>
          </div>
          <div class="filters" role="radiogroup" aria-label="Task filters">
            ${this._renderFilterButton('all', 'All')}
            ${this._renderFilterButton('active', 'Active')}
            ${this._renderFilterButton('completed', 'Completed')}
          </div>
        </div>

        <ul class="task-list" aria-live="polite">
          ${filteredTasks.length
            ? filteredTasks.map((task) => this._renderTask(task))
            : html`<li class="empty-state">
                <p>No tasks in this view yet.</p>
                <small>Use the composer above to add your first one.</small>
              </li>`}
        </ul>

        <footer class="panel actions">
          <button class="ghost" ?disabled=${completed === 0} @click=${this._clearCompleted}>
            Clear completed
          </button>
          <span>${active} task${active === 1 ? '' : 's'} remaining</span>
        </footer>
      </section>
    `
  }

  private get _filteredTasks(): TaskItem[] {
    if (this.filter === 'active') {
      return this.tasks.filter((task) => !task.completed)
    }
    if (this.filter === 'completed') {
      return this.tasks.filter((task) => task.completed)
    }
    return this.tasks
  }

  private get _stats() {
    const total = this.tasks.length
    const completed = this.tasks.filter((task) => task.completed).length
    return {
      total,
      completed,
      active: total - completed,
    }
  }

  private _handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    this.newTask = target.value
  }

  private _handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this._addTask()
    }
    if (event.key === 'Escape') {
      this.newTask = ''
    }
  }

  private _addTask() {
    const title = this.newTask.trim()
    if (!title) return

    const newTask: TaskItem = {
      id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      title,
      completed: false,
      createdAt: Date.now(),
    }

    this.tasks = [newTask, ...this.tasks]
    this.newTask = ''
  }

  private _toggleTask(taskId: string) {
    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    )
  }

  private _deleteTask(taskId: string) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId)
  }

  private _setFilter(filter: TaskFilter) {
    this.filter = filter
  }

  private _clearCompleted() {
    this.tasks = this.tasks.filter((task) => !task.completed)
  }

  private _renderTask(task: TaskItem) {
    return html`
      <li class="task" data-complete=${task.completed}>
        <label class="task-main">
          <input
            class="toggle"
            type="checkbox"
            .checked=${task.completed}
            @change=${() => this._toggleTask(task.id)}
            aria-label="Toggle ${task.title}"
          />
          <span>
            <strong>${task.title}</strong>
            <small>${this._formatTimestamp(task.createdAt)}</small>
          </span>
        </label>
        <button class="ghost" @click=${() => this._deleteTask(task.id)} aria-label="Delete ${task.title}">
          ✕
        </button>
      </li>
    `
  }

  private _renderFilterButton(value: TaskFilter, label: string) {
    const isActive = this.filter === value
    return html`
      <button
        class=${isActive ? 'chip active' : 'chip'}
        @click=${() => this._setFilter(value)}
        aria-pressed=${isActive}
      >
        ${label}
      </button>
    `
  }

  private _formatTimestamp(timestamp: number) {
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric',
    })
    return formatter.format(timestamp)
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      padding: 3rem clamp(1rem, 5vw, 5rem);
      background: var(--planner-host-bg);
      color: var(--color-text-primary);
      font-family: 'Space Grotesk', 'IBM Plex Sans', system-ui, sans-serif;
    }

    .planner-shell {
      max-width: 960px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .planner-hero {
      text-align: left;
      animation: slideDown 600ms ease;
    }

    .hero-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
      color: var(--color-text-accent);
      margin: 0;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 6vw, 3.75rem);
      line-height: 1.1;
    }

    .subtitle {
      margin: 0.75rem 0 1.75rem;
      color: var(--color-text-secondary);
      max-width: 40ch;
    }

    .hero-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }

    .hero-metrics article {
      border: 1px solid var(--metric-border);
      border-radius: 1rem;
      padding: 1rem 1.25rem;
      backdrop-filter: blur(10px);
      background: var(--metric-bg);
    }

    .hero-metrics span {
      display: block;
      font-size: 2rem;
      font-weight: 600;
    }

    .hero-metrics label {
      color: var(--color-text-tertiary);
      font-size: 0.85rem;
    }

    .panel {
      border-radius: 1.25rem;
      padding: 1.5rem;
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      box-shadow: var(--panel-shadow);
    }

    .composer {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    @media (min-width: 600px) {
      .composer {
        flex-direction: row;
      }
    }

    input[type='text'] {
      flex: 1;
      border-radius: 999px;
      border: 1px solid transparent;
      padding: 0.75rem 1.25rem;
      background: var(--input-bg);
      color: inherit;
      font-size: 1rem;
      transition: border 150ms ease, transform 150ms ease;
    }

    input[type='text']:focus {
      outline: none;
      border-color: var(--input-focus-border);
      transform: translateY(-2px);
      background: var(--input-bg-focus);
    }

    input[type='text']:focus-visible,
    button:focus-visible {
      outline: 2px solid var(--focus-ring);
      outline-offset: 2px;
    }

    button {
      border: none;
      border-radius: 999px;
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 180ms ease, box-shadow 180ms ease;
      font-family: inherit;
    }

    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .primary {
      background: var(--primary-gradient);
      color: var(--button-text-on-primary);
      box-shadow: var(--primary-shadow);
    }

    .primary:hover {
      transform: translateY(-1px);
    }

    .ghost {
      background: transparent;
      color: var(--ghost-color);
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .chip {
      border-radius: 999px;
      border: 1px solid var(--chip-border);
      padding: 0.35rem 1rem;
      background: var(--chip-bg);
      color: var(--chip-color);
      font-size: 0.9rem;
    }

    .chip.active {
      border-color: var(--chip-active-border);
      background: var(--chip-active-bg);
      color: var(--chip-active-color);
      box-shadow: inset 0 0 0 1px var(--chip-active-inner);
    }

    .task-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .task {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.25rem;
      border-radius: 1rem;
      background: var(--task-bg);
      border: 1px solid var(--task-border);
      animation: fadeIn 220ms ease;
    }

    .task-main {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex: 1;
    }

    .task strong {
      display: block;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .task small {
      color: var(--muted-text);
      font-size: 0.8rem;
    }

    .toggle {
      width: 1.1rem;
      height: 1.1rem;
      accent-color: var(--toggle-accent);
      cursor: pointer;
    }

    .task[data-complete='true'] strong {
      text-decoration: line-through;
      color: var(--task-complete-text);
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      border-radius: 1rem;
      border: 1px dashed var(--empty-border);
      color: var(--muted-text);
      background: var(--empty-bg);
    }

    .actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    @media (max-width: 520px) {
      .actions {
        flex-direction: column;
        align-items: stretch;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'task-planner': TaskPlanner
  }
}
