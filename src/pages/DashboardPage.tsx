
import { Link } from 'react-router-dom'
import { useProjectStore } from '../stores/projectStore'
import type { Project, ProjectStatus } from '../types/project'

const statusConfig: Record<
  ProjectStatus,
  { label: string; badge: string; bar: string }
> = {
  planning: {
    label: 'Planning',
    badge: 'bg-slate-100 text-slate-700',
    bar: 'bg-slate-400',
  },
  active: {
    label: 'Active',
    badge: 'bg-emerald-50 text-emerald-700',
    bar: 'bg-emerald-500',
  },
  'on-hold': {
    label: 'On hold',
    badge: 'bg-amber-50 text-amber-700',
    bar: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    badge: 'bg-brand-50 text-brand-700',
    bar: 'bg-brand-500',
  },
}

function formatDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T12:00:00`)

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  iconStyle,
}: {
  label: string
  value: number
  description: string
  icon: string
  iconStyle: string
}) {
  return (
    <article className="rounded-panel border border-line bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <span
          aria-hidden="true"
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-lg ${iconStyle}`}
        >
          {icon}
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-ink-950">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-ink-500">{description}</p>
    </article>
  )
}

function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${config.badge}`}
    >
      {config.label}
    </span>
  )
}

function RecentProjectRow({ project }: { project: Project }) {
  return (
    <li className="flex min-w-0 items-center gap-3 py-4 first:pt-0 last:pb-0">
      <span
        aria-hidden="true"
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
          project.color === 'indigo'
            ? 'bg-indigo-100 text-indigo-700'
            : project.color === 'blue'
              ? 'bg-blue-100 text-blue-700'
              : project.color === 'emerald'
                ? 'bg-emerald-100 text-emerald-700'
                : project.color === 'amber'
                  ? 'bg-amber-100 text-amber-700'
                  : project.color === 'rose'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-violet-100 text-violet-700'
        }`}
      >
        {project.name.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-800">
          {project.name}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          {project.dueDate
            ? `Due ${formatDate(project.dueDate)}`
            : 'No due date'}
        </p>
      </div>

      <ProjectStatusBadge status={project.status} />
    </li>
  )
}

export default function DashboardPage() {
  const projects = useProjectStore((state) => state.projects)

  const totalProjects = projects.length
  const activeProjects = projects.filter(
    (project) => project.status === 'active',
  ).length
  const completedProjects = projects.filter(
    (project) => project.status === 'completed',
  ).length
  const onHoldProjects = projects.filter(
    (project) => project.status === 'on-hold',
  ).length

  const statusOrder: ProjectStatus[] = [
    'active',
    'planning',
    'on-hold',
    'completed',
  ]

  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    )
    .slice(0, 5)

  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-600">
            Your workspace
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base sm:leading-7">
            Here’s an overview of your projects and the work you’re moving
            forward.
          </p>
        </div>

        <Link
          to="/projects"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>
          View projects
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total projects"
          value={totalProjects}
          description="Across your workspace"
          icon="▦"
          iconStyle="bg-brand-50 text-brand-600"
        />
        <SummaryCard
          label="Active projects"
          value={activeProjects}
          description="Currently in progress"
          icon="↗"
          iconStyle="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          label="Completed"
          value={completedProjects}
          description="Marked as completed"
          icon="✓"
          iconStyle="bg-indigo-50 text-indigo-600"
        />
        <SummaryCard
          label="On hold"
          value={onHoldProjects}
          description="Waiting to resume"
          icon="Ⅱ"
          iconStyle="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-ink-950">
              Project status
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              How your projects are distributed
            </p>
          </div>

          {totalProjects === 0 ? (
            <p className="rounded-xl bg-canvas px-4 py-6 text-center text-sm leading-6 text-ink-500">
              Your status breakdown will appear here when you add a project.
            </p>
          ) : (
            <div className="space-y-5">
              {statusOrder.map((status) => {
                const count = projects.filter(
                  (project) => project.status === status,
                ).length
                const percentage = (count / totalProjects) * 100
                const config = statusConfig[status]

                return (
                  <div key={status}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-ink-600">
                        {config.label}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-ink-800">
                        {count}
                        <span className="ml-2 text-xs font-normal text-ink-500">
                          {Math.round(percentage)}%
                        </span>
                      </span>
                    </div>

                    <div
                      role="progressbar"
                      aria-label={`${config.label} projects`}
                      aria-valuemin={0}
                      aria-valuemax={totalProjects}
                      aria-valuenow={count}
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
                    >
                      <div
                        className={`h-full rounded-full transition-all ${config.bar}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 border-t border-line pt-5">
            <Link
              to="/projects"
              className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              Manage projects <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="min-w-0 rounded-panel border border-line bg-surface p-5 shadow-card sm:p-6 xl:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-ink-950">
                Recent projects
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Your most recently updated work
              </p>
            </div>

            {projects.length > 0 && (
              <Link
                to="/projects"
                className="shrink-0 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
              >
                View all
              </Link>
            )}
          </div>

          {recentProjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
              <div
                aria-hidden="true"
                className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-50 text-xl text-brand-600"
              >
                ▦
              </div>
              <h3 className="mt-4 text-sm font-semibold text-ink-800">
                No projects to show yet
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-ink-500">
                Create your first project to see its status and details here.
              </p>
              <Link
                to="/projects"
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Create a project
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {recentProjects.map((project) => (
                <RecentProjectRow key={project.id} project={project} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  )
}
