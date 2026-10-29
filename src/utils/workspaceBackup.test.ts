import { describe, expect, it } from 'vitest'
import { createWorkspaceBackup } from './workspaceBackup'
import type { Project } from '../types/project'
import type { Task } from '../types/task'
import type { WorkspaceSettings } from '../stores/settingsStore'

describe('createWorkspaceBackup', () => {
  it('includes the app metadata, projects, tasks, and settings', () => {
    const projects: Project[] = []
    const tasks: Task[] = []

    const settings: WorkspaceSettings = {
      workspaceName: 'My Workspace',
      workspaceDescription: 'A test workspace',
      defaultTaskStatus: 'todo',
      defaultTaskPriority: 'high',
    }

    const backup = createWorkspaceBackup({
      projects,
      tasks,
      settings,
    })

    expect(backup.app).toBe('Flowspace')
    expect(backup.version).toBe(1)
    expect(backup.data.projects).toBe(projects)
    expect(backup.data.tasks).toBe(tasks)
    expect(backup.data.settings).toEqual(settings)
  })

  it('includes a valid export timestamp', () => {
    const backup = createWorkspaceBackup({
      projects: [],
      tasks: [],
      settings: {
        workspaceName: 'Flowspace',
        workspaceDescription: 'Personal workspace',
        defaultTaskStatus: 'todo',
        defaultTaskPriority: 'medium',
      },
    })

    expect(Number.isNaN(Date.parse(backup.exportedAt))).toBe(false)
  })
})