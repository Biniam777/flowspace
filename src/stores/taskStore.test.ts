import { beforeEach, describe, expect, it } from 'vitest'
import { useTaskStore } from './taskStore'
import type { CreateTaskInput } from '../types/task'

const taskInput: CreateTaskInput = {
  title: 'Build dashboard',
  description: 'Implement dashboard widgets',
  status: 'todo',
  priority: 'high',
  projectId: null,
  dueDate: '2026-12-31',
}

describe('taskStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useTaskStore.persist.clearStorage()
    useTaskStore.setState({ tasks: [] })
  })

  it('creates a task with an ID and timestamps', () => {
    const task = useTaskStore.getState().addTask(taskInput)

    expect(task.id).toBeTruthy()
    expect(Number.isNaN(Date.parse(task.createdAt))).toBe(false)
    expect(task.updatedAt).toBe(task.createdAt)
    expect(task.title).toBe('Build dashboard')
    expect(useTaskStore.getState().tasks).toHaveLength(1)
  })

  it('updates an existing task without changing its creation timestamp', () => {
    const task = useTaskStore.getState().addTask(taskInput)

    useTaskStore.getState().updateTask(task.id, {
      title: 'Updated dashboard',
      status: 'in-progress',
      priority: 'medium',
    })

    const updated = useTaskStore.getState().getTask(task.id)

    expect(updated?.title).toBe('Updated dashboard')
    expect(updated?.status).toBe('in-progress')
    expect(updated?.priority).toBe('medium')
    expect(updated?.createdAt).toBe(task.createdAt)
    expect(updated?.updatedAt).toBeTruthy()
  })

  it('deletes only the selected task', () => {
    const first = useTaskStore.getState().addTask(taskInput)
    const second = useTaskStore.getState().addTask({
      ...taskInput,
      title: 'Second task',
    })

    useTaskStore.getState().deleteTask(first.id)

    expect(useTaskStore.getState().tasks).toHaveLength(1)
    expect(useTaskStore.getState().getTask(first.id)).toBeUndefined()
    expect(useTaskStore.getState().getTask(second.id)?.title).toBe(
      'Second task',
    )
  })

  it('returns undefined when a task does not exist', () => {
    expect(useTaskStore.getState().getTask('missing-task')).toBeUndefined()
  })

  it('clears all tasks', () => {
    useTaskStore.getState().addTask(taskInput)
    useTaskStore.getState().addTask({
      ...taskInput,
      title: 'Second task',
    })

    useTaskStore.getState().clearTasks()

    expect(useTaskStore.getState().tasks).toEqual([])
  })
})