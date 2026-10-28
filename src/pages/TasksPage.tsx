import { useState } from 'react'
import TaskForm from '../components/tasks/TaskForm'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import type { CreateTaskInput, TaskStatus } from '../types/task'

const columns: {
  status: TaskStatus
  title: string
  description: string
  accent: string
}[] = [
  {
    status: 'todo',
    title: 'To do',
    description: 'Ready to get started',
    accent: 'bg-slate-400',
  },
  {
    status: 'in-progress',
    title: 'In progress',
    description: 'Work currently underway',
    accent: 'bg-brand-500',
  },
  {
    status: 'done',
    title: 'Done',
    description: 'Completed work',
    accent: 'bg-emerald-500',
  },
]

const priorityStyles = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-amber-50 text-amber-700',
  high: 'bg-rose-50 text-rose-700',
} as const

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
} as const

function formatDueDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function TasksPage() {
  const tasks = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  const projects = useProjectStore((state) => state.projects)

  const [isCreating, setIsCreating] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  const editingTask =
    tasks.find((task) => task.id === editingTaskId) ?? null

  const deletingTask =
    tasks.find((task) => task.id === deletingTaskId) ?? null

  function handleCloseDialog() {
    setIsCreating(false)
    setEditingTaskId(null)
    setDeletingTaskId(null)
  }

  function handleSubmit(input: CreateTaskInput) {
    if (editingTaskId) {
      updateTask(editingTaskId, input)
    } else {
      addTask(input)
    }

    handleCloseDialog()
  }

  function handleDeleteTask() {
    if (!deletingTaskId) {
      return
    }

    deleteTask(deletingTaskId)
    handleCloseDialog()
  }

  return (
    <section>
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-brand-600">
            Flowspace workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
            Tasks
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base sm:leading-7">
            Turn your plans into progress, one task at a time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            handleCloseDialog()
            setIsCreating(true)
          }}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>
          New task
        </button>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink-800">Task board</h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-600">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className="-mx-1 overflow-x-auto px-1 pb-4">
        <div className="grid min-w-[900px] grid-cols-3 items-start gap-4">
          {columns.map((column) => {
            const columnTasks = tasks.filter(
              (task) => task.status === column.status,
            )

            return (
              <section
                key={column.status}
                aria-labelledby={`column-${column.status}`}
                className="min-h-80 rounded-2xl border border-line bg-slate-50/80 p-3"
              >
                <div className="mb-4 flex items-start justify-between gap-3 px-1 pt-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`size-2.5 rounded-full ${column.accent}`}
                      />

                      <h3
                        id={`column-${column.status}`}
                        className="text-sm font-bold text-ink-950"
                      >
                        {column.title}
                      </h3>
                    </div>

                    <p className="mt-1.5 text-xs text-ink-500">
                      {column.description}
                    </p>
                  </div>

                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-semibold text-ink-600 ring-1 ring-line">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => {
                      const project = projects.find(
                        (item) => item.id === task.projectId,
                      )

                      return (
                        <article
                          key={task.id}
                          className="rounded-xl border border-line bg-white p-4 shadow-card transition-shadow hover:shadow-md"
                        >
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${priorityStyles[task.priority]}`}
                            >
                              {priorityLabels[task.priority]} priority
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  handleCloseDialog()
                                  setEditingTaskId(task.id)
                                }}
                                aria-label={`Edit ${task.title}`}
                                className="rounded-lg px-2 py-1.5 text-xs font-semibold text-brand-600 transition hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleCloseDialog()
                                  setDeletingTaskId(task.id)
                                }}
                                aria-label={`Delete ${task.title}`}
                                className="rounded-lg px-2 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <h4 className="text-sm font-semibold leading-5 text-ink-950">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-ink-500">
                              {task.description}
                            </p>
                          )}

                          {(project || task.dueDate) && (
                            <div className="mt-4 space-y-2 border-t border-line pt-3">
                              {project && (
                                <p className="flex items-start gap-2 text-xs text-ink-600">
                                  <span
                                    aria-hidden="true"
                                    className="mt-1.5 size-2 shrink-0 rounded-sm bg-brand-500"
                                  />

                                  <span className="break-words">
                                    {project.name}
                                  </span>
                                </p>
                              )}

                              {task.dueDate && (
                                <p className="flex items-center gap-2 text-xs text-ink-500">
                                  <span aria-hidden="true">◷</span>

                                  <span>
                                    Due {formatDueDate(task.dueDate)}
                                  </span>
                                </p>
                              )}
                            </div>
                          )}
                        </article>
                      )
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-8 text-center">
                      <p className="text-sm font-medium text-ink-600">
                        No tasks yet
                      </p>

                      <p className="mt-1 text-xs leading-5 text-ink-500">
                        Tasks in this stage will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </div>

      <p className="mt-1 text-xs text-ink-500">
        Tip: On smaller screens, scroll horizontally to view all three columns.
      </p>

      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDialog()
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-dialog-title"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-xl sm:p-7"
          >
            <div className="mb-6">
              <h2
                id="task-dialog-title"
                className="text-xl font-bold tracking-tight text-ink-950"
              >
                Create a task
              </h2>

              <p className="mt-2 text-sm leading-6 text-ink-500">
                Add a task and choose where it belongs on your board.
              </p>
            </div>

            <TaskForm
              key="new-task"
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </section>
        </div>
      )}

      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDialog()
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-task-dialog-title"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-xl sm:p-7"
          >
            <div className="mb-6">
              <h2
                id="edit-task-dialog-title"
                className="text-xl font-bold tracking-tight text-ink-950"
              >
                Edit task
              </h2>

              <p className="mt-2 text-sm leading-6 text-ink-500">
                Update the details or move this task to another stage.
              </p>
            </div>

            <TaskForm
              key={editingTask.id}
              task={editingTask}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </section>
        </div>
      )}

      {deletingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseDialog()
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-task-dialog-title"
            aria-describedby="delete-task-dialog-description"
            className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl sm:p-7"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="size-5"
              >
                <path
                  d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              id="delete-task-dialog-title"
              className="mt-4 text-lg font-bold tracking-tight text-ink-950"
            >
              Delete this task?
            </h2>

            <p
              id="delete-task-dialog-description"
              className="mt-2 text-sm leading-6 text-ink-600"
            >
              You are about to delete{' '}
              <span className="font-semibold text-ink-950">
                {deletingTask.title}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="min-h-10 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteTask}
                className="min-h-10 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
              >
                Delete task
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}