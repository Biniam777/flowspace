
import type { Project } from '../../types/project'

type ProjectCardProps = {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

const statusStyles = {
  planning: 'bg-slate-100 text-slate-700',
  active: 'bg-emerald-50 text-emerald-700',
  'on-hold': 'bg-amber-50 text-amber-700',
  completed: 'bg-brand-50 text-brand-700',
} as const

const statusLabels = {
  planning: 'Planning',
  active: 'Active',
  'on-hold': 'On hold',
  completed: 'Completed',
} as const

const colorStyles = {
  indigo: 'bg-indigo-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
} as const

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default function ProjectCard({
  project,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-panel border border-line bg-surface p-5 shadow-card transition-shadow duration-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          aria-hidden="true"
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${colorStyles[project.color]} text-lg font-bold text-white`}
        >
          {project.name.trim().charAt(0).toUpperCase() || 'P'}
        </div>

        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[project.status]}`}
        >
          {statusLabels[project.status]}
        </span>
      </div>

      <h2 className="mt-4 truncate text-base font-semibold tracking-tight text-ink-950">
        {project.name}
      </h2>

      <p className="mt-2 min-h-10 whitespace-pre-wrap break-words text-sm leading-5 text-ink-500">
        {project.description || 'No description added yet.'}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div className="min-w-0">
          <p className="text-xs text-ink-500">Due date</p>
          <p className="mt-1 text-sm font-medium text-ink-800">
            {project.dueDate ? formatDate(project.dueDate) : 'Not set'}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(project)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.name}`}
            className="rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
