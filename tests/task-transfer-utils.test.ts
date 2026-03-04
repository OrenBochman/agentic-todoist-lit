/// <reference path="./vitest-shim.d.ts" />
import { describe, expect, it } from 'vitest'
import {
    buildExportFilename,
    buildExportPayload,
    extractImportedTasks,
    type TaskImportPayload,
    type TransferTask,
} from '../src/components/task-transfer-utils'

describe('task-transfer-utils', () => {
    it('buildExportPayload returns a stable envelope with metadata and tasks', () => {
        const tasks: TransferTask[] = [
            { id: 'a', title: 'Ship', completed: false, createdAt: 1700000000000 },
        ]
        const exportedAt = new Date('2026-03-04T12:00:00.000Z')

        const payload = buildExportPayload(tasks, exportedAt)

        expect(payload).toEqual({
            version: 1,
            exportedAt: '2026-03-04T12:00:00.000Z',
            tasks,
        })
    })

    it('buildExportFilename returns date-stamped filenames', () => {
        const filename = buildExportFilename(new Date('2026-03-04T08:00:00.000Z'))
        expect(filename).toBe('task-planner-2026-03-04.json')
    })

    it('extractImportedTasks parses wrapped payload and sorts by createdAt descending', () => {
        const parsed: TaskImportPayload = {
            tasks: [
                { id: 'old', title: 'Old', completed: false, createdAt: 100 },
                { id: 'new', title: 'New', completed: true, createdAt: 300 },
            ],
        }

        const tasks = extractImportedTasks(parsed)

        expect(tasks.map((task) => task.id)).toEqual(['new', 'old'])
    })

    it('extractImportedTasks sanitizes invalid items and uses fallbacks', () => {
        const parsed = [
            null,
            42,
            {},
            { title: '   ' },
            { title: 'Valid task', createdAt: 'NaN', completed: 'yes' },
        ] as unknown as TransferTask[]

        const tasks = extractImportedTasks(parsed, {
            now: () => 1234,
            idFactory: () => 'fallback-id',
        })

        expect(tasks).toEqual([
            {
                id: 'fallback-id',
                title: 'Valid task',
                completed: true,
                createdAt: 1234,
            },
        ])
    })

    it('extractImportedTasks returns empty for non-array payloads', () => {
        const tasks = extractImportedTasks({ tasks: { nope: true } } as unknown as TaskImportPayload)
        expect(tasks).toEqual([])
    })
})
