export interface TransferTask {
    id: string
    title: string
    completed: boolean
    createdAt: number
}

export interface TaskImportPayload {
    tasks: unknown
}

interface ImportOptions {
    now?: () => number
    idFactory?: () => string
}

export function buildExportPayload(tasks: TransferTask[], exportedAt = new Date()) {
    return {
        version: 1,
        exportedAt: exportedAt.toISOString(),
        tasks,
    }
}

export function buildExportFilename(now = new Date()) {
    return `task-planner-${now.toISOString().slice(0, 10)}.json`
}

export function extractImportedTasks(
    parsed: TaskImportPayload | TransferTask[],
    options: ImportOptions = {},
): TransferTask[] {
    const resolveNow = options.now ?? (() => Date.now())
    const resolveId = options.idFactory ?? (() => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)

    const candidate = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object' && 'tasks' in parsed
            ? parsed.tasks
            : []

    if (!Array.isArray(candidate)) {
        return []
    }

    return candidate
        .map((item): TransferTask | null => {
            if (!item || typeof item !== 'object') {
                return null
            }

            const taskRecord = item as Record<string, unknown>
            const title = typeof taskRecord.title === 'string' ? taskRecord.title.trim() : ''
            if (!title) {
                return null
            }

            const parsedCreatedAt = Number(taskRecord.createdAt)
            const createdAt = Number.isFinite(parsedCreatedAt) ? parsedCreatedAt : resolveNow()
            const id = typeof taskRecord.id === 'string' && taskRecord.id.trim() ? taskRecord.id : resolveId()

            return {
                id,
                title,
                completed: Boolean(taskRecord.completed),
                createdAt,
            }
        })
        .filter((task): task is TransferTask => task !== null)
        .sort((a, b) => b.createdAt - a.createdAt)
}
