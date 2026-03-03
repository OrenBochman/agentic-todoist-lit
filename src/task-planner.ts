import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

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

  connectedCallback(): void {
    super.connectedCallback()
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
          <p class="eyebrow">Agentic Todoist</p>
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
      background: radial-gradient(circle at 25% 25%, #101828, #03050d 65%);
      color: #f3f6ff;
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

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.2em;
      font-size: 0.75rem;
      color: #9ea8ff;
      margin-bottom: 0.5rem;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 6vw, 3.75rem);
      line-height: 1.1;
    }

    .subtitle {
      margin: 0.75rem 0 1.75rem;
      color: #c6cee8;
      max-width: 40ch;
    }

    .hero-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }

    .hero-metrics article {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 1rem;
      padding: 1rem 1.25rem;
      backdrop-filter: blur(10px);
      background: rgba(17, 24, 39, 0.65);
    }

    .hero-metrics span {
      display: block;
      font-size: 2rem;
      font-weight: 600;
    }

    .hero-metrics label {
      color: #95a0d3;
      font-size: 0.85rem;
    }

    .panel {
      border-radius: 1.25rem;
      padding: 1.5rem;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(120, 132, 255, 0.35);
      box-shadow: 0 20px 60px rgba(3, 5, 13, 0.4);
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
      background: rgba(255, 255, 255, 0.08);
      color: inherit;
      font-size: 1rem;
      transition: border 150ms ease, transform 150ms ease;
    }

    input[type='text']:focus {
      outline: none;
      border-color: #9ea8ff;
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.12);
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
      background: linear-gradient(135deg, #a855f7, #6366f1);
      color: white;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.45);
    }

    .primary:hover {
      transform: translateY(-1px);
    }

    .ghost {
      background: transparent;
      color: #b6bef5;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .chip {
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.35rem 1rem;
      background: rgba(255, 255, 255, 0.06);
      color: #cfd7ff;
      font-size: 0.9rem;
    }

    .chip.active {
      border-color: #c084fc;
      background: rgba(192, 132, 252, 0.2);
      color: white;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
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
      color: #9da9d8;
      font-size: 0.8rem;
    }

    .toggle {
      width: 1.1rem;
      height: 1.1rem;
      accent-color: #c084fc;
      cursor: pointer;
    }

    .task[data-complete='true'] strong {
      text-decoration: line-through;
      color: #7983ad;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      border-radius: 1rem;
      border: 1px dashed rgba(255, 255, 255, 0.2);
      color: #9ba6da;
      background: rgba(255, 255, 255, 0.03);
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
