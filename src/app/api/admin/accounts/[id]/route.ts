// src/app/api/admin/accounts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('Authorization')
    const id = params.id

    const response = await apiClient.get(`/admin/users`, {
      headers: {
        Authorization: authHeader || '',
      },
    })

    const user = response.data.find((u: any) => u._id === id)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error('Error fetching admin account:', error.message)
    return NextResponse.json({ error: 'Failed to fetch admin account' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('Authorization')
    const id = params.id
    const body = await request.json()

    // Update user endpoint would be /users/:id
    const response = await apiClient.put(`/users/${id}`, body, {
      headers: {
        Authorization: authHeader || '',
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error updating admin account:', error.message)
    return NextResponse.json(
      { error: 'Failed to update admin account' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get('Authorization')
    const id = params.id

    const response = await apiClient.delete(`/admin/users/${id}`, {
      headers: {
        Authorization: authHeader || '',
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Error deleting admin account:', error.message)
    return NextResponse.json(
      { error: 'Failed to delete admin account' },
      { status: error.response?.status || 500 }
    )
  }
}
