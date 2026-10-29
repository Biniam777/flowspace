import type { Project } from '../types/project'
import type { Task } from '../types/task'
import type { WorkspaceSettings } from '../stores/settingsStore'

export type WorkspaceBackup = {
  app: 'Flowspace'
  version: 1
  exportedAt: string
  data: {
    projects: Project[]
    tasks: Task[]
    settings: WorkspaceSettings
  }
}

type CreateWorkspaceBackupInput = {
  projects: Project[]
  tasks: Task[]
  settings: WorkspaceSettings
}

export function createWorkspaceBackup({
  projects,
  tasks,
  settings,
}: CreateWorkspaceBackupInput): WorkspaceBackup {
  return {
    app: 'Flowspace',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      projects,
      tasks,
      settings: {
        workspaceName: settings.workspaceName,
        workspaceDescription: settings.workspaceDescription,
        defaultTaskStatus: settings.defaultTaskStatus,
        defaultTaskPriority: settings.defaultTaskPriority,
      },
    },
  }
}

export function downloadWorkspaceBackup(
  backup: WorkspaceBackup,
): void {
  const json = JSON.stringify(backup, null, 2)
  const blob = new Blob([json], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `flowspace-backup-${new Date()
    .toISOString()
    .replace(/[:.]/g, '-')}.json`

  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}