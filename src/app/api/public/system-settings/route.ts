// src/app/api/public/system-settings/route.ts
// Public endpoint: Flutter and other clients can fetch system settings without auth
import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/system-settings'

export async function GET() {
  // Return current system settings
  // Flutter apps, mobile clients, and any non-authenticated client can call this
  return NextResponse.json(getSettings(), {
    headers: {
      'Cache-Control': 'public, max-age=60', // Cache for 60 seconds
    },
  })
}
