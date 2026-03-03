// src/lib/system-settings.ts
// Shared system settings module used by both admin and public endpoints

export interface SystemSettings {
  // Content Limits (per user)
  post_limit_per_day: number
  comments_per_day: number

  // File Upload Limits
  max_file_size_mb: number

  // Moderation & Reporting
  banned_keywords: string[]
  auto_report_threshold: number
  auto_moderation: boolean

  // Feature Modules
  modules: {
    groups: boolean
    chat: boolean
    notifications: boolean
  }

  // Platform Status
  maintenance_mode: boolean
}

const defaultSettings: SystemSettings = {
  post_limit_per_day: 50,
  comments_per_day: 100,
  max_file_size_mb: 10,
  banned_keywords: [],
  auto_report_threshold: 5,
  auto_moderation: true,
  modules: { groups: true, chat: true, notifications: true },
  maintenance_mode: false,
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

