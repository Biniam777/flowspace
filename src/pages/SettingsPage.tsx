import { useState, type FormEvent } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { useProjectStore } from '../stores/projectStore'
import { useTaskStore } from '../stores/taskStore'
import {
  createWorkspaceBackup,
  downloadWorkspaceBackup,
} from '../utils/workspaceBackup'
import type { TaskPriority, TaskStatus } from '../types/task'

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

const inputClassName =
  'mt-1.5 block w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink-950 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-bold text-ink-950">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-ink-500">{description}</p>
      </div>

      {children}
    </section>
  )
}

export default function SettingsPage() {
  const settings = useSettingsStore()
  const projects = useProjectStore((state) => state.projects)
  const clearProjects = useProjectStore((state) => state.clearProjects)
  const tasks = useTaskStore((state) => state.tasks)
  const clearTasks = useTaskStore((state) => state.clearTasks)

  const [workspaceName, setWorkspaceName] = useState(settings.workspaceName)
  const [workspaceDescription, setWorkspaceDescription] = useState(
    settings.workspaceDescription,
  )
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>(
    settings.defaultTaskStatus,
  )
  const [defaultTaskPriority, setDefaultTaskPriority] =
    useState<TaskPriority>(settings.defaultTaskPriority)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [showFullResetConfirmation, setShowFullResetConfirmation] =
    useState(false)

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = workspaceName.trim()
    const trimmedDescription = workspaceDescription.trim()

    if (!trimmedName) {
      setError('Please enter a workspace name.')
      setMessage('')
      return
    }

    if (trimmedName.length > 60) {
      setError('Workspace names must be 60 characters or fewer.')
      setMessage('')
      return
    }

    if (trimmedDescription.length > 200) {
      setError('Workspace descriptions must be 200 characters or fewer.')
      setMessage('')
      return
    }

    settings.updateSettings({
      workspaceName: trimmedName,
      workspaceDescription: trimmedDescription,
      defaultTaskStatus,
      defaultTaskPriority,
    })

    setWorkspaceName(trimmedName)
    setWorkspaceDescription(trimmedDescription)
    setError('')
    setMessage('Your preferences have been saved.')
  }

  function handleReset() {
    settings.resetSettings()
    setWorkspaceName('Flowspace')
    setWorkspaceDescription('Personal workspace')
    setDefaultTaskStatus('todo')
    setDefaultTaskPriority('medium')
    setError('')
    setMessage('Your preferences have been restored to their defaults.')
    setShowResetConfirmation(false)
  }

  function handleFullReset() {
    clearProjects()
    clearTasks()
    settings.resetSettings()

    setWorkspaceName('Flowspace')
    setWorkspaceDescription('Personal workspace')
    setDefaultTaskStatus('todo')
    setDefaultTaskPriority('medium')

    setError('')
    setMessage(
      'Your workspace has been reset. All projects and tasks were deleted, and preferences were restored.',
    )
    setShowFullResetConfirmation(false)
  }

  function handleExport() {
    const backup = createWorkspaceBackup({
      projects,
      tasks,
      settings: {
        workspaceName: settings.workspaceName,
        workspaceDescription: settings.workspaceDescription,
        defaultTaskStatus: settings.defaultTaskStatus,
        defaultTaskPriority: settings.defaultTaskPriority,
      },
    })

    downloadWorkspaceBackup(backup)
    setMessage('Your workspace backup has been downloaded.')
    setError('')
  }

  return (
    <section className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="text-sm font-semibold text-brand-600">
          Personalize your workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">
          Settings
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base sm:leading-7">
          Manage your workspace details and choose how new tasks should start.
        </p>
      </div>

      <form onSubmit={handleSave} noValidate className="space-y-5">
        <SettingsSection
          title="Workspace profile"
          description="Choose a name and description for your personal workspace."
        >
          <div className="space-y-5">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="workspace-name"
                  className="text-sm font-semibold text-ink-800"
                >
                  Workspace name
                </label>
                <span className="text-xs text-ink-500">
                  {workspaceName.length}/60
                </span>
              </div>

              <input
                id="workspace-name"
                name="workspaceName"
                type="text"
                maxLength={60}
                value={workspaceName}
                onChange={(event) => {
                  setWorkspaceName(event.target.value)
                  setError('')
                  setMessage('')
                }}
                placeholder="e.g. My workspace"
                className={inputClassName}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'settings-error' : undefined}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label
                  htmlFor="workspace-description"
                  className="text-sm font-semibold text-ink-800"
                >
                  Description
                </label>
                <span className="text-xs text-ink-500">
                  {workspaceDescription.length}/200
                </span>
              </div>

              <textarea
                id="workspace-description"
                name="workspaceDescription"
                rows={3}
                maxLength={200}
                value={workspaceDescription}
                onChange={(event) => {
                  setWorkspaceDescription(event.target.value)
                  setError('')
                  setMessage('')
                }}
                placeholder="What is this workspace for?"
                className={`${inputClassName} resize-y`}
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Task defaults"
          description="Set the initial status and priority for tasks you create."
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="default-task-status"
                className="block text-sm font-semibold text-ink-800"
              >
                Default status
              </label>

              <select
                id="default-task-status"
                name="defaultTaskStatus"
                value={defaultTaskStatus}
                onChange={(event) => {
                  setDefaultTaskStatus(event.target.value as TaskStatus)
                  setMessage('')
                }}
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
                htmlFor="default-task-priority"
                className="block text-sm font-semibold text-ink-800"
              >
                Default priority
              </label>

              <select
                id="default-task-priority"
                name="defaultTaskPriority"
                value={defaultTaskPriority}
                onChange={(event) => {
                  setDefaultTaskPriority(event.target.value as TaskPriority)
                  setMessage('')
                }}
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
        </SettingsSection>

        {error && (
          <p
            id="settings-error"
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {message}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              setWorkspaceName(settings.workspaceName)
              setWorkspaceDescription(settings.workspaceDescription)
              setDefaultTaskStatus(settings.defaultTaskStatus)
              setDefaultTaskPriority(settings.defaultTaskPriority)
              setError('')
              setMessage('')
            }}
            className="min-h-11 rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-ink-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Discard changes
          </button>

          <button
            type="submit"
            className="min-h-11 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            Save preferences
          </button>
        </div>
      </form>

      <div className="mt-8">
        <SettingsSection
          title="Data management"
          description="Keep a local backup of your Flowspace workspace data."
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-ink-800">
                Export workspace
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-6 text-ink-500">
                Download your projects, tasks, and saved preferences as a JSON
                file. Keep the file somewhere safe so you have a copy of your
                workspace.
              </p>
              <p className="mt-2 text-xs text-ink-500">
                Includes {projects.length}{' '}
                {projects.length === 1 ? 'project' : 'projects'} and{' '}
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M10 2.75v9m0 0 3.25-3.25M10 11.75 6.75 8.5M3.75 12.75v3.5h12.5v-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Export workspace
            </button>
          </div>
        </SettingsSection>
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-ink-950">
              Reset preferences
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-ink-600">
              Restore the default workspace name, description, task status, and
              task priority. Your projects and tasks will not be deleted.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirmation(true)}
            className="min-h-10 shrink-0 rounded-xl border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            Reset preferences
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/70 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-rose-900">
              Reset entire workspace
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-rose-800">
              Permanently delete every project and task stored in this browser
              and restore default workspace preferences. This action cannot be
              undone. Export a backup first if you may need this data later.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowFullResetConfirmation(true)}
            className="min-h-10 shrink-0 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
          >
            Reset entire workspace
          </button>
        </div>
      </div>

      {showResetConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowResetConfirmation(false)
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-settings-title"
            aria-describedby="reset-settings-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="reset-settings-title"
              className="text-lg font-bold text-ink-950"
            >
              Reset workspace preferences?
            </h2>

            <p
              id="reset-settings-description"
              className="mt-2 text-sm leading-6 text-ink-600"
            >
              This restores the default preferences. Your projects and tasks
              will remain unchanged.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowResetConfirmation(false)}
                className="min-h-10 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="min-h-10 rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              >
                Confirm reset
              </button>
            </div>
          </section>
        </div>
      )}

      {showFullResetConfirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowFullResetConfirmation(false)
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="full-reset-title"
            aria-describedby="full-reset-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="full-reset-title"
              className="text-lg font-bold text-rose-900"
            >
              Delete all workspace data?
            </h2>

            <p
              id="full-reset-description"
              className="mt-2 text-sm leading-6 text-ink-600"
            >
              This will permanently delete all {projects.length}{' '}
              {projects.length === 1 ? 'project' : 'projects'} and {tasks.length}{' '}
              {tasks.length === 1 ? 'task' : 'tasks'}, then restore the default
              workspace preferences. You cannot undo this action.
            </p>

            <p className="mt-3 text-sm font-semibold text-rose-800">
              If you want to keep your data, cancel and export a backup first.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowFullResetConfirmation(false)}
                className="min-h-10 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink-600 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleFullReset}
                className="min-h-10 rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
              >
                Yes, delete everything
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}