// src/services/settings.service.ts
import api from '@/lib/axios'

export interface SystemSettings {
  post_limit_per_day?: number
  comments_per_day?: number
  max_file_size_mb?: number
  banned_keywords?: string[]
  auto_report_threshold?: number
  auto_moderation?: boolean
  modules?: {
    groups?: boolean
    chat?: boolean
    notifications?: boolean
  }
  maintenance_mode?: boolean
}

export const fetchSystemSettings = async (): Promise<SystemSettings | null> => {
  // Use the browser's fetch to call the Next.js internal API route relative to origin.
  const resp = await fetch('/api/admin/system-settings')
  if (!resp.ok) throw new Error(`Failed to fetch settings: ${resp.status}`)
  return await resp.json()
}

export const saveSystemSettings = async (data: SystemSettings) => {
  const resp = await fetch('/api/admin/system-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!resp.ok) throw new Error(`Failed to save settings: ${resp.status}`)
  return await resp.json()
}

export default {
  fetchSystemSettings,
  saveSystemSettings,
}
