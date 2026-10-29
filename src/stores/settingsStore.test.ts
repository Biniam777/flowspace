import { beforeEach, describe, expect, it } from 'vitest'
import { useSettingsStore } from './settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useSettingsStore.persist.clearStorage()
    useSettingsStore.getState().resetSettings()
  })

  it('starts with the default workspace settings', () => {
    expect(useSettingsStore.getState()).toMatchObject({
      workspaceName: 'Flowspace',
      workspaceDescription: 'Personal workspace',
      defaultTaskStatus: 'todo',
      defaultTaskPriority: 'medium',
    })
  })

  it('updates only the supplied settings', () => {
    useSettingsStore.getState().updateSettings({
      workspaceName: 'My Workspace',
      defaultTaskPriority: 'high',
    })

    expect(useSettingsStore.getState()).toMatchObject({
      workspaceName: 'My Workspace',
      workspaceDescription: 'Personal workspace',
      defaultTaskStatus: 'todo',
      defaultTaskPriority: 'high',
    })
  })

  it('resets settings to their defaults', () => {
    useSettingsStore.getState().updateSettings({
      workspaceName: 'Changed Workspace',
      workspaceDescription: 'Changed description',
      defaultTaskStatus: 'in-progress',
      defaultTaskPriority: 'low',
    })

    useSettingsStore.getState().resetSettings()

    expect(useSettingsStore.getState()).toMatchObject({
      workspaceName: 'Flowspace',
      workspaceDescription: 'Personal workspace',
      defaultTaskStatus: 'todo',
      defaultTaskPriority: 'medium',
    })
  })
})