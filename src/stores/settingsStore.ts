import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { TaskPriority, TaskStatus } from '../types/task'

export type WorkspaceSettings = {
  workspaceName: string
  workspaceDescription: string
  defaultTaskStatus: TaskStatus
  defaultTaskPriority: TaskPriority
}

type SettingsStore = WorkspaceSettings & {
  updateSettings: (settings: Partial<WorkspaceSettings>) => void
  resetSettings: () => void
}

const defaultSettings: WorkspaceSettings = {
  workspaceName: 'Flowspace',
  workspaceDescription: 'Personal workspace',
  defaultTaskStatus: 'todo',
  defaultTaskPriority: 'medium',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateSettings: (settings) => {
        set((state) => ({
          ...state,
          ...settings,
        }))
      },

      resetSettings: () => {
        set(defaultSettings)
      },
    }),
    {
      name: 'flowspace-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        workspaceName: state.workspaceName,
        workspaceDescription: state.workspaceDescription,
        defaultTaskStatus: state.defaultTaskStatus,
        defaultTaskPriority: state.defaultTaskPriority,
      }),
    },
  ),
)