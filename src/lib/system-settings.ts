// src/lib/system-settings.ts
// Shared system settings module used by both admin and public endpoints

export interface SystemSettings {
  post_limit_per_day: number
  banned_keywords: string[]
  auto_report_threshold: number
  modules: {
    groups: boolean
    chat: boolean
    notifications: boolean
  }
}

const defaultSettings: SystemSettings = {
  post_limit_per_day: 10,
  banned_keywords: [],
  auto_report_threshold: 3,
  modules: { groups: true, chat: true, notifications: true },
}

// In-memory store (shared across both endpoints in the same process)
export let settingsStore: SystemSettings = { ...defaultSettings }

export function getSettings(): SystemSettings {
  return { ...settingsStore }
}

export function updateSettings(updates: Partial<SystemSettings>): SystemSettings {
  settingsStore = {
    ...settingsStore,
    ...updates,
    modules: {
      ...(settingsStore.modules || {}),
      ...(updates.modules || {}),
    },
  }
  return { ...settingsStore }
}

export function resetSettings(): void {
  settingsStore = { ...defaultSettings }
}
