import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from '../types/project'

type ProjectStore = {
  projects: Project[]
  addProject: (input: CreateProjectInput) => Project
  updateProject: (id: string, input: UpdateProjectInput) => void
  deleteProject: (id: string) => void
  clearProjects: () => void
  getProject: (id: string) => Project | undefined
}

function createId() {
  return crypto.randomUUID()
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],

      addProject: (input) => {
        const now = new Date().toISOString()

        const project: Project = {
          ...input,
          id: createId(),
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          projects: [project, ...state.projects],
        }))

        return project
      },

      updateProject: (id, input) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...input,
                  updatedAt: new Date().toISOString(),
                }
              : project,
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }))
      },

      clearProjects: () => {
        set({ projects: [] })
      },

      getProject: (id) => get().projects.find((project) => project.id === id),
    }),
    {
      name: 'flowspace-projects',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ projects: state.projects }),
    },
  ),
)