// src/app/api/admin/system-settings/route.ts
import { NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/system-settings'

/**
 * Admin endpoint: manage system settings (requires auth).
 * When settings are updated, the shared settings store is updated.
 */

export async function GET() {
  return NextResponse.json(getSettings())
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const updated = updateSettings(body)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
