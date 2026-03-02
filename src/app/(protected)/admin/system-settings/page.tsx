// src/app/(protected)/admin/system-settings/page.tsx
'use client'

import SystemSettingsForm from '@/components/SystemSettingsForm'
import { useRef, useState } from 'react'

export default function SystemSettingsPage() {
  const formRef = useRef<any>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  const handleSaveClick = async () => {
    if (formRef.current?.save) {
      await formRef.current.save()
      setSavedAt(new Date())
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-gray-600 mt-1">Configure system-wide settings</p>
          </div>
          <div>
            <button onClick={handleSaveClick} className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
          </div>
        </div>

        <SystemSettingsForm ref={formRef} onSaved={() => setSavedAt(new Date())} />

        {savedAt && (
          <p className="mt-3 text-sm text-gray-500">Last saved: {savedAt.toLocaleString()}</p>
        )}
      </div>
    </div>
  )
}
