import { useState, type FormEvent } from 'react'
import { useProjectStore } from '../../stores/projectStore'
import { useSettingsStore } from '../../stores/settingsStore'
import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
} from '../../types/task'

type TaskFormProps = {
  task?: Task | null
  onSubmit: (input: CreateTaskInput) => void
  onCancel: () => void
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
]

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function TaskForm({
  task,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const projects = useProjectStore((state) => state.projects)

  const defaultTaskStatus = useSettingsStore(
    (state) => state.defaultTaskStatus,
  )
  const defaultTaskPriority = useSettingsStore(
    (state) => state.defaultTaskPriority,
  )

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState<TaskStatus>(
    task?.status ?? defaultTaskStatus,
  )
  const [priority, setPriority] = useState<TaskPriority>(
    task?.priority ?? defaultTaskPriority,
  )
  const [projectId, setProjectId] = useState(task?.projectId ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      setError('Please enter a task title.')
      return
    }

    if (trimmedTitle.length > 100) {
      setError('Task titles must be 100 characters or fewer.')
      return
    }

    if (trimmedDescription.length > 500) {
      setError('Descriptions must be 500 characters or fewer.')
      return
    }

    onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      status,
      priority,
      projectId: projectId || null,
      dueDate: dueDate || null,
    })
  }

  const inputClassName =
    'mt-1.5 block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-semibold text-ink-800"
          >
            Task title <span className="text-rose-600">*</span>
          </label>

          <input
            id="task-title"
            name="title"
            type="text"
            autoFocus
            required
            maxLength={100}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setError('')
            }}
            placeholder="e.g. Design the landing page"
            className={inputClassName}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'task-form-error' : undefined}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="task-description"
              className="block text-sm font-semibold text-ink-800"
            >
              Description
            </label>

            <span className="text-xs text-ink-500">
              {description.length}/500
            </span>
          </div>

          <textarea
            id="task-description"
            name="description"
            rows={3}
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Add useful details about this task..."
            className={`${inputClassName} resize-y`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-status"
              className="block text-sm font-semibold text-ink-800"
            >
              Status
            </label>

            <select
              id="task-status"
              name="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as TaskStatus)
              }
              className={inputClassName}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="block text-sm font-semibold text-ink-800"
            >
              Priority
            </label>

            <select
              id="task-priority"
              name="priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as TaskPriority)
              }
              className={inputClassName}
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="task-project"
            className="block text-sm font-semibold text-ink-800"
          >
            Project <span className="font-normal text-ink-500">(optional)</span>
          </label>

          <select
            id="task-project"
            name="projectId"
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className={inputClassName}
          >
            <option value="">No project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="task-due-date"
            className="block text-sm font-semibold text-ink-800"
          >
            Due date <span className="font-normal text-ink-500">(optional)</span>
          </label>

          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={inputClassName}
          />
        </div>

        {error && (
          <p
            id="task-form-error"
            role="alert"
            className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
          >
            {error}
          </p>
        )}
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="min-h-10 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="min-h-10 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {task ? 'Save changes' : 'Create task'}
        </button>
      </div>
    </form>
  )
}