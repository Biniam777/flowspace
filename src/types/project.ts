export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed'

export type ProjectColor =
  | 'indigo'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'violet'

export type Project = {
  id: string
  name: string
  description: string
  status: ProjectStatus
  color: ProjectColor
  createdAt: string
  updatedAt: string
  dueDate: string | null
}

export type CreateProjectInput = {
  name: string
  description: string
  status: ProjectStatus
  color: ProjectColor
  dueDate: string | null
}

export type UpdateProjectInput = Partial<CreateProjectInput>
