import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../types/task'

type TaskStore = {
  tasks: Task[]
  addTask: (input: CreateTaskInput) => Task
  updateTask: (id: string, input: UpdateTaskInput) => void
  deleteTask: (id: string) => void
  clearTasks: () => void
  getTask: (id: string) => Task | undefined
}

function createId() {
  return crypto.randomUUID()
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (input) => {
        const now = new Date().toISOString()

        const task: Task = {
          ...input,
          id: createId(),
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          tasks: [task, ...state.tasks],
        }))

        return task
      },

      updateTask: (id, input) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...input,
                  updatedAt: new Date().toISOString(),
                }
              : task,
          ),
        }))
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      clearTasks: () => {
        set({ tasks: [] })
      },

      getTask: (id) => get().tasks.find((task) => task.id === id),
    }),
    {
      name: 'flowspace-tasks',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks }),
    },
  ),
)