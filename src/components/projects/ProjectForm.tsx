
import { useState, type FormEvent } from 'react'
import type {
  CreateProjectInput,
  Project,
  ProjectColor,
  ProjectStatus,
} from '../../types/project'

type ProjectFormProps = {
  project?: Project | null
  onSubmit: (input: CreateProjectInput) => void
  onCancel: () => void
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On hold' },
  { value: 'completed', label: 'Completed' },
]

const colorOptions: { value: ProjectColor; label: string; className: string }[] =
  [
    { value: 'indigo', label: 'Indigo', className: 'bg-indigo-500' },
    { value: 'blue', label: 'Blue', className: 'bg-blue-500' },
    { value: 'emerald', label: 'Emerald', className: 'bg-emerald-500' },
    { value: 'amber', label: 'Amber', className: 'bg-amber-500' },
    { value: 'rose', label: 'Rose', className: 'bg-rose-500' },
    { value: 'violet', label: 'Violet', className: 'bg-violet-500' },
  ]

export default function ProjectForm({
  project,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? 'planning',
  )
  const [color, setColor] = useState<ProjectColor>(
    project?.color ?? 'indigo',
  )
  const [dueDate, setDueDate] = useState(project?.dueDate ?? '')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Please enter a project name.')
      return
    }

    if (trimmedName.length > 80) {
      setError('Project names must be 80 characters or fewer.')
      return
    }

    if (description.length > 500) {
      setError('Descriptions must be 500 characters or fewer.')
      return
    }

    onSubmit({
      name: trimmedName,
      description: description.trim(),
      status,
      color,
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
            htmlFor="project-name"
            className="block text-sm font-semibold text-ink-800"
          >
            Project name <span className="text-rose-600">*</span>
          </label>
          <input
            id="project-name"
            name="name"
            type="text"
            autoFocus
            required
            maxLength={100}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
            placeholder="e.g. Website redesign"
            className={inputClassName}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'project-form-error' : undefined}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="project-description"
              className="block text-sm font-semibold text-ink-800"
            >
              Description
            </label>
            <span className="text-xs text-ink-500">
              {description.length}/500
            </span>
          </div>
          <textarea
            id="project-description"
            name="description"
            rows={3}
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this project about?"
            className={`${inputClassName} resize-y`}
          />
        </div>

        <div>
          <label
            htmlFor="project-status"
            className="block text-sm font-semibold text-ink-800"
          >
            Status
          </label>
          <select
            id="project-status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ProjectStatus)}
            className={inputClassName}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-ink-800">
            Project color
          </legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {colorOptions.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="project-color"
                  value={option.value}
                  checked={color === option.value}
                  onChange={() => setColor(option.value)}
                  className="peer sr-only"
                />
                <span
                  title={option.label}
                  className={`flex size-9 items-center justify-center rounded-full ${option.className} text-white ring-offset-2 transition peer-focus-visible:outline-2 peer-focus-visible:outline-brand-500 peer-checked:ring-2 peer-checked:ring-brand-600`}
                >
                  {color === option.value ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    <span className="sr-only">{option.label}</span>
                  )}
                </span>
                <span className="sr-only">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="project-due-date"
            className="block text-sm font-semibold text-ink-800"
          >
            Due date <span className="font-normal text-ink-500">(optional)</span>
          </label>
          <input
            id="project-due-date"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={inputClassName}
          />
        </div>

        {error && (
          <p
            id="project-form-error"
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
          {project ? 'Save changes' : 'Create project'}
        </button>
      </div>
    </form>
  )
}
