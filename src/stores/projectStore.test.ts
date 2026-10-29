import { beforeEach, describe, expect, it } from 'vitest'
import { useProjectStore } from './projectStore'
import type { CreateProjectInput } from '../types/project'

const projectInput: CreateProjectInput = {
  name: 'Portfolio Website',
  description: 'Build a personal portfolio',
  status: 'active',
  color: 'indigo',
  dueDate: '2026-12-31',
}

describe('projectStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useProjectStore.persist.clearStorage()
    useProjectStore.setState({ projects: [] })
  })

  it('creates a project with an ID and timestamps', () => {
    const project = useProjectStore.getState().addProject(projectInput)

    expect(project.id).toBeTruthy()
    expect(Number.isNaN(Date.parse(project.createdAt))).toBe(false)
    expect(project.updatedAt).toBe(project.createdAt)
    expect(project.name).toBe('Portfolio Website')
    expect(useProjectStore.getState().projects).toHaveLength(1)
  })

  it('updates an existing project and its updated timestamp', () => {
    const project = useProjectStore.getState().addProject(projectInput)

    useProjectStore.getState().updateProject(project.id, {
      name: 'Updated Portfolio',
      status: 'completed',
    })

    const updated = useProjectStore.getState().getProject(project.id)

    expect(updated?.name).toBe('Updated Portfolio')
    expect(updated?.status).toBe('completed')
    expect(updated?.updatedAt).toBeTruthy()
    expect(updated?.createdAt).toBe(project.createdAt)
  })

  it('deletes only the selected project', () => {
    const first = useProjectStore.getState().addProject(projectInput)
    const second = useProjectStore.getState().addProject({
      ...projectInput,
      name: 'Second Project',
    })

    useProjectStore.getState().deleteProject(first.id)

    expect(useProjectStore.getState().projects).toHaveLength(1)
    expect(useProjectStore.getState().getProject(first.id)).toBeUndefined()
    expect(useProjectStore.getState().getProject(second.id)?.name).toBe(
      'Second Project',
    )
  })

  it('returns undefined when a project does not exist', () => {
    expect(useProjectStore.getState().getProject('missing-project')).toBeUndefined()
  })
})