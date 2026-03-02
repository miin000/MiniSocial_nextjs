// src/components/SystemSettingsForm.tsx
'use client'

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { SystemSettings, fetchSystemSettings, saveSystemSettings } from '@/services/settings.service'

interface Props {
  onSaved?: () => void
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 rounded-full p-1 flex items-center transition ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
      aria-pressed={checked}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  )
}

const SystemSettingsForm = forwardRef(({ onSaved }: Props, ref) => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [settings, setSettings] = useState<SystemSettings>({
    post_limit_per_day: 50,
    // add comments_per_day field on frontend; backend store is flexible
    banned_keywords: ['spam', 'scam', 'fake', 'inappropriate'],
    auto_report_threshold: 5,
    modules: { groups: true, chat: true, notifications: true },
  })

  const [commentsPerDay, setCommentsPerDay] = useState<number>(100)
  const [maxFileSizeMB, setMaxFileSizeMB] = useState<number>(10)
  const [autoModeration, setAutoModeration] = useState<boolean>(true)
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false)
  const [newKeyword, setNewKeyword] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchSystemSettings()
        if (!mounted) return
        if (data) {
          setSettings(prev => ({
            ...prev,
            post_limit_per_day: data.post_limit_per_day ?? prev.post_limit_per_day,
            banned_keywords: data.banned_keywords ?? prev.banned_keywords,
            auto_report_threshold: data.auto_report_threshold ?? prev.auto_report_threshold,
            modules: {
              groups: data.modules?.groups ?? prev.modules?.groups,
              chat: data.modules?.chat ?? prev.modules?.chat,
              notifications: data.modules?.notifications ?? prev.modules?.notifications,
            }
          }))
          // Optional extra fields
          if ((data as any).comments_per_day) setCommentsPerDay((data as any).comments_per_day)
          if ((data as any).max_file_size_mb) setMaxFileSizeMB((data as any).max_file_size_mb)
          if ((data as any).auto_moderation !== undefined) setAutoModeration((data as any).auto_moderation)
          if ((data as any).maintenance_mode !== undefined) setMaintenanceMode((data as any).maintenance_mode)
        }
      } catch (err) {
        console.error('Failed to load system settings', err)
        if (mounted) setError('Failed to load settings')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  useImperativeHandle(ref, () => ({
    save: async () => await handleSave(),
  }))

  const addKeyword = () => {
    const k = newKeyword.trim()
    if (!k) return
    if ((settings.banned_keywords || []).includes(k)) {
      setNewKeyword('')
      return
    }
    setSettings(prev => ({ ...prev, banned_keywords: [...(prev.banned_keywords || []), k] }))
    setNewKeyword('')
  }

  const removeKeyword = (k: string) => {
    setSettings(prev => ({ ...prev, banned_keywords: (prev.banned_keywords || []).filter(x => x !== k) }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const payload: any = {
        ...settings,
        comments_per_day: commentsPerDay,
        max_file_size_mb: maxFileSizeMB,
        auto_moderation: autoModeration,
        maintenance_mode: maintenanceMode,
      }

      await saveSystemSettings(payload)
      setSuccess('Settings saved')
      onSaved?.()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow font-['Times_New_Roman'] text-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-medium text-slate-800">
            System Settings
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Configure system wide settings
          </p>
        </div>
        <div>
          {success && <div className="text-green-600 mb-2">{success}</div>}
        </div>
      </div>

      {error && <div className="mb-3 text-red-700">{error}</div>}

      {/* Content Limits */}
      <section className="mt-6 border rounded p-4">
        <h3 className="text-sm font-medium text-slate-700">Content Limits</h3>
        <p className="text-xs text-slate-400 mb-3">Limits that apply per user</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-600">Posts per Day (per user)</label>
            <input type="number" min={0} value={settings.post_limit_per_day ?? ''} onChange={e => setSettings(prev => ({ ...prev, post_limit_per_day: Number(e.target.value) }))} className="mt-1 w-full p-2 border rounded" />
          </div>
          <div>
            <label className="text-xs text-slate-600">Comments per Day (per user)</label>
            <input type="number" min={0} value={commentsPerDay} onChange={e => setCommentsPerDay(Number(e.target.value))} className="mt-1 w-full p-2 border rounded" />
          </div>
        </div>
      </section>

      {/* Moderation Settings */}
      <section className="mt-6 border rounded p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700">Moderation Settings</h3>
            <p className="text-xs text-slate-400">Controls for automatic moderation and reporting</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500">Auto-Moderation</div>
            <Switch checked={autoModeration} onChange={setAutoModeration} />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-slate-600">Auto-Report Threshold</label>
          <input type="number" min={0} value={settings.auto_report_threshold ?? 0} onChange={e => setSettings(prev => ({ ...prev, auto_report_threshold: Number(e.target.value) }))} className="mt-1 w-48 p-2 border rounded" />
          <p className="text-xs text-slate-400 mt-1">Number of reports before content is automatically hidden</p>
        </div>
      </section>

      {/* Banned Keywords */}
      <section className="mt-6 border rounded p-4">
        <h3 className="text-sm font-medium text-slate-700">Banned Keywords</h3>
        <p className="text-xs text-slate-400 mb-3">Keywords to automatically flag or block</p>

        <div className="flex gap-2 items-start">
          <input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} placeholder="Add banned keyword..." className="p-2 border rounded w-full" />
          <button onClick={addKeyword} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(settings.banned_keywords || []).map(k => (
            <div key={k} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <span>{k}</span>
              <button onClick={() => removeKeyword(k)} className="text-pink-700 font-bold">×</button>
            </div>
          ))}
        </div>
      </section>

      {/* Module Settings */}
      <section className="mt-6 border rounded p-4">
        <h3 className="text-sm font-medium text-slate-700">Module Settings</h3>
        <p className="text-xs text-slate-400 mb-3">Enable or disable site modules</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="text-sm font-medium">Groups Module</div>
              <div className="text-xs text-slate-400">Enable/disable groups and communities</div>
            </div>
            <Switch checked={!!settings.modules?.groups} onChange={v => setSettings(prev => ({ ...prev, modules: { ...(prev.modules || {}), groups: v } }))} />
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="text-sm font-medium">Chat Module</div>
              <div className="text-xs text-slate-400">Enable/disable direct messaging</div>
            </div>
            <Switch checked={!!settings.modules?.chat} onChange={v => setSettings(prev => ({ ...prev, modules: { ...(prev.modules || {}), chat: v } }))} />
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="text-sm font-medium">Notifications Module</div>
              <div className="text-xs text-slate-400">Enable/disable push notifications</div>
            </div>
            <Switch checked={!!settings.modules?.notifications} onChange={v => setSettings(prev => ({ ...prev, modules: { ...(prev.modules || {}), notifications: v } }))} />
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="text-sm font-medium">File Uploads</div>
              <div className="text-xs text-slate-400">Allow users to upload images and videos</div>
            </div>
            <Switch checked={true} onChange={() => {}} />
          </div>

          <div className="col-span-2 mt-2">
            <label className="text-xs text-slate-600">Maximum File Size (MB)</label>
            <input type="number" min={0} value={maxFileSizeMB} onChange={e => setMaxFileSizeMB(Number(e.target.value))} className="mt-1 w-48 p-2 border rounded" />
          </div>
        </div>
      </section>

      {/* Maintenance Mode */}
      <section className="mt-6 border rounded p-4 bg-yellow-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-700">Maintenance Mode</div>
            <div className="text-xs text-slate-500">This will temporarily disable the platform for all users except admins</div>
          </div>
          <Switch checked={maintenanceMode} onChange={setMaintenanceMode} />
        </div>
      </section>

      <div className="mt-6 flex gap-2">
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white border rounded">Reset</button>
      </div>
    </div>
  )
})

export default SystemSettingsForm
