import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import type { ProjectStatus } from '../types/project'
import type { TaskPriority, TaskStatus } from '../types/task'

const projectStatusConfig: {
  status: ProjectStatus
  label: string
  color: string
}[] = [
  { status: 'planning', label: 'Planning', color: 'bg-violet-500' },
  { status: 'active', label: 'Active', color: 'bg-brand-500' },
  { status: 'on-hold', label: 'On hold', color: 'bg-amber-500' },
  { status: 'completed', label: 'Completed', color: 'bg-emerald-500' },
]

const taskStatusConfig: {
  status: TaskStatus
  label: string
  color: string
  trackColor: string
}[] = [
  {
    status: 'todo',
    label: 'To do',
    color: 'bg-slate-500',
    trackColor: 'bg-slate-100',
  },
  {
    status: 'in-progress',
    label: 'In progress',
    color: 'bg-brand-500',
    trackColor: 'bg-brand-50',
  },
  {
    status: 'done',
    label: 'Done',
    color: 'bg-emerald-500',
    trackColor: 'bg-emerald-50',
  },
]

const priorityConfig: {
  priority: TaskPriority
  label: string
  color: string
  trackColor: string
}[] = [
  {
    priority: 'high',
    label: 'High',
    color: 'bg-rose-500',
    trackColor: 'bg-rose-50',
  },
  {
    priority: 'medium',
    label: 'Medium',
    color: 'bg-amber-500',
    trackColor: 'bg-amber-50',
  },
  {
    priority: 'low',
    label: 'Low',
    color: 'bg-slate-500',
    trackColor: 'bg-slate-100',
  },
]

function formatPercentage(value: number): string {
  return `${Math.round(value)}%`
}

function formatDueDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function MetricCard({
  label,
  value,
  description,
  icon,
}: {
  label: string
  value: string | number
  description: string
  icon: string
}) {
  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink-600">{label}</p>

        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-lg text-brand-600"
        >
          {icon}
        </span>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-ink-950">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-ink-500">{description}</p>
    </article>
  )
}

function DistributionRow({
  label,
  count,
  total,
  color,
  trackColor,
}: {
  label: string
  count: number
  total: number
  color: string
  trackColor: string
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-600">{label}</span>

        <span className="text-sm font-semibold tabular-nums text-ink-800">
          {count}
          <span className="ml-2 text-xs font-normal text-ink-500">
            {formatPercentage(percentage)}
          </span>
        </span>
      </div>

      <div
        className={`h-2.5 overflow-hidden rounded-full ${trackColor}`}
        role="progressbar"
        aria-label={`${label} distribution`}
        aria-valuemin={0}
        aria-valuemax={total || 1}
        aria-valuenow={count}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)

  const totalProjects = projects.length
  const activeProjects = projects.filter(
    (project) => project.status === 'active',
  ).length
  const completedProjects = projects.filter(
    (project) => project.status === 'completed',
  ).length

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(
    (task) => task.status === 'done',
  ).length
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress',
  ).length

  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === 'done') {
      return false
    }

    const dueDate = new Date(`${task.dueDate}T00:00:00`)
    return dueDate < today
  })

  const projectStatusCounts = projectStatusConfig.map((item) => ({
    ...item,
    count: projects.filter((project) => project.status === item.status).length,
  }))

  const taskStatusCounts = taskStatusConfig.map((item) => ({
    ...item,
    count: tasks.filter((task) => task.status === item.status).length,
  }))

  const priorityCounts = priorityConfig.map((item) => ({
    ...item,
    count: tasks.filter((task) => task.priority === item.priority).length,
  }))

  const allUpcomingTasks = tasks
    .filter(
      (task) =>
        task.status !== 'done' &&
        task.dueDate !== null &&
        new Date(`${task.dueDate}T00:00:00`) >= today,
    )
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))

  const upcomingTasks = allUpcomingTasks.slice(0, 5)

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-600">
          Flowspace workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          Analytics
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base sm:leading-7">
          Understand your progress and see how your work is moving forward.
        </p>
      </div>

      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-base font-bold text-ink-950">
            Workspace overview
          </h2>

          <p className="mt-1 text-sm text-ink-500">
            A snapshot of your projects and tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total projects"
            value={totalProjects}
            description={`${activeProjects} currently active`}
            icon="◫"
          />

          <MetricCard
            label="Completed projects"
            value={completedProjects}
            description={
              totalProjects > 0
                ? `${formatPercentage((completedProjects / totalProjects) * 100)} of all projects`
                : 'No projects created yet'
            }
            icon="✓"
          />

          <MetricCard
            label="Total tasks"
            value={totalTasks}
            description={`${inProgressTasks} currently in progress`}
            icon="☷"
          />

          <MetricCard
            label="Task completion"
            value={formatPercentage(completionRate)}
            description={`${completedTasks} of ${totalTasks} tasks completed`}
            icon="↗"
          />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-ink-950">
              Project status
            </h2>

            <p className="mt-1 text-sm text-ink-500">
              See how your projects are distributed.
            </p>
          </div>

          {totalProjects > 0 ? (
            <div className="space-y-5">
              {projectStatusCounts.map((item) => (
                <DistributionRow
                  key={item.status}
                  label={item.label}
                  count={item.count}
                  total={totalProjects}
                  color={item.color}
                  trackColor="bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center">
              <p className="text-sm font-medium text-ink-700">
                No project data yet
              </p>

              <p className="mt-1 text-xs leading-5 text-ink-500">
                Create a project to see its status here.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-ink-950">Task status</h2>

            <p className="mt-1 text-sm text-ink-500">
              Track how work moves across your board.
            </p>
          </div>

          {totalTasks > 0 ? (
            <div className="space-y-5">
              {taskStatusCounts.map((item) => (
                <DistributionRow
                  key={item.status}
                  label={item.label}
                  count={item.count}
                  total={totalTasks}
                  color={item.color}
                  trackColor={item.trackColor}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center">
              <p className="text-sm font-medium text-ink-700">
                No task data yet
              </p>

              <p className="mt-1 text-xs leading-5 text-ink-500">
                Add tasks to see your workflow distribution.
              </p>
            </div>
          )}
        </section>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-ink-950">
              Task priorities
            </h2>

            <p className="mt-1 text-sm text-ink-500">
              Understand where your attention is needed.
            </p>
          </div>

          {totalTasks > 0 ? (
            <div className="space-y-5">
              {priorityCounts.map((item) => (
                <DistributionRow
                  key={item.priority}
                  label={item.label}
                  count={item.count}
                  total={totalTasks}
                  color={item.color}
                  trackColor={item.trackColor}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line px-4 py-10 text-center">
              <p className="text-sm font-medium text-ink-700">
                No priorities to report
              </p>

              <p className="mt-1 text-xs leading-5 text-ink-500">
                Task priority data will appear here.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <div className="mb-6">
            <h2 className="text-base font-bold text-ink-950">
              Due date overview
            </h2>

            <p className="mt-1 text-sm text-ink-500">
              Keep an eye on overdue work and upcoming deadlines.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-rose-50 p-4">
              <p className="text-xs font-medium text-rose-700">
                Overdue tasks
              </p>

              <p className="mt-2 text-2xl font-bold text-rose-700">
                {overdueTasks.length}
              </p>
            </div>

            <div className="rounded-xl bg-brand-50 p-4">
              <p className="text-xs font-medium text-brand-700">
                Upcoming tasks
              </p>

              <p className="mt-2 text-2xl font-bold text-brand-700">
                {allUpcomingTasks.length}
              </p>
            </div>
          </div>

          {upcomingTasks.length > 0 ? (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 border-t border-line pt-3 first:border-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-ink-800">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-ink-500">
                      {task.status === 'in-progress'
                        ? 'In progress'
                        : 'To do'}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-ink-600">
                    {formatDueDate(task.dueDate!)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center">
              <p className="text-sm font-medium text-ink-700">
                No upcoming deadlines
              </p>

              <p className="mt-1 text-xs leading-5 text-ink-500">
                Add due dates to your open tasks to plan ahead.
              </p>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}