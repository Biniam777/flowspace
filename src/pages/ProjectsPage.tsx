
import { useState } from 'react'
import ProjectCard from '../components/projects/ProjectCard'
import ProjectForm from '../components/projects/ProjectForm'
import { useProjectStore } from '../stores/projectStore'
import type { CreateProjectInput, Project } from '../types/project'

export default function ProjectsPage() {
  const projects = useProjectStore((state) => state.projects)
  const addProject = useProjectStore((state) => state.addProject)
  const updateProject = useProjectStore((state) => state.updateProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This action cannot be undone.`,
    )

    if (confirmed) {
      deleteProject(project.id)
    }
  }

  function handleCreate() {
    setEditingProject(null)
    setIsCreating(true)
  }

  function handleEdit(project: Project) {
    setEditingProject(project)
    setIsCreating(true)
  }

  function handleCloseDialog() {
    setIsCreating(false)
    setEditingProject(null)
  }

  function handleSubmit(input: CreateProjectInput) {
    if (editingProject) {
      updateProject(editingProject.id, input)
    } else {
      addProject(input)
    }

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
            Projects
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base sm:leading-7">
            Organize your work into projects and keep every next step visible.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>
          New project
        </button>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink-800">All projects</h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-ink-600">
          {projects.length} {projects.length === 1 ? 'project' : 'projects'}
        </span>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-panel border border-dashed border-slate-300 bg-surface px-5 py-12 shadow-card sm:px-10 sm:py-16">
          <div className="mx-auto max-w-md text-center">
            <div
              aria-hidden="true"
              className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-600"
            >
              ▦
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-tight text-ink-950">
              No projects yet
            </h2>

            <p className="mt-2 text-sm leading-6 text-ink-500">
              Start by creating your first project. Add a description, choose
              a color, and set a due date to keep your work organized.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 inline-flex min-h-10 items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              Create your first project
            </button>
          </div>
        </div>
      )}

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
            aria-labelledby="project-dialog-title"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-xl sm:p-7"
          >
            <div className="mb-6">
              <h2
                id="project-dialog-title"
                className="text-xl font-bold tracking-tight text-ink-950"
              >
                {editingProject ? 'Edit project' : 'Create a project'}
              </h2>

              <p className="mt-2 text-sm leading-6 text-ink-500">
                {editingProject
                  ? 'Update your project details below.'
                  : 'Give your project a name and set it up for success.'}
              </p>
            </div>

            <ProjectForm
              key={editingProject?.id ?? 'new-project'}
              project={editingProject}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </section>
        </div>
      )}
    </section>
  )
}
