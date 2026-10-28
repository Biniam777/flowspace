
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string | null
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export type CreateTaskInput = {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  projectId: string | null
  dueDate: string | null
}

export type UpdateTaskInput = Partial<CreateTaskInput>
