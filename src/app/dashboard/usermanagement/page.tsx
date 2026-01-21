"use client"

import { useMemo, useState } from "react"
import {
    Search,
    Filter,
    Eye,
    Ban,
    Trash2,
} from "lucide-react"

/* ===================== PAGE ===================== */

export default function UserManagementPage() {
    const [showFilter, setShowFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("all")
    const [status, setStatus] = useState("all")
    const [page, setPage] = useState(1)

    const PAGE_SIZE = 8

    /* ===================== FILTER + SEARCH ===================== */
    const filteredUsers = useMemo(() => {
        return USERS.filter((u) => {
            const searchOk =
                u.username.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())

            const roleOk = role === "all" || u.role === role
            const statusOk = status === "all" || u.status === status

            return searchOk && roleOk && statusOk
        })
    }, [search, role, status])

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)

    const users = filteredUsers.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    /* ===================== ACTIONS ===================== */
    const onView = (u: any) => alert(`View user: ${u.username}`)
    const onBan = (u: any) => alert(`Ban user: ${u.username}`)
    const onDelete = (u: any) => alert(`Delete user: ${u.username}`)

    return (
        <div className="space-y-6">

            {/* TITLE */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        User Management
                    </h1>
                    <p className="text-gray-700 font-medium mt-1">
                        Manage and monitor all users
                    </p>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Export Users
                </button>
            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white border rounded-xl p-4 space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Search by username or email..."
                            className="w-full border rounded-lg pl-10 pr-4 py-2 text-gray-800"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

                {/* FILTER PANEL */}
                {showFilter && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-800">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                    setPage(1)
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-gray-800"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="banned">Banned</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-800">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value)
                                    setPage(1)
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-gray-800"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-gray-800">
                    <thead className="bg-gray-100 text-gray-800 font-semibold">
                        <tr>
                            <th className="p-4 text-left">User</th>
                            <th className="text-left">Email</th>
                            <th className="text-center">Role</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Created</th>
                            <th className="text-right pr-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t hover:bg-gray-50">
                                <td className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                                        {u.username.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium">{u.username}</p>
                                        <p className="text-xs text-gray-600 font-medium">
                                            ID: {u.id}
                                        </p>
                                    </div>
                                </td>
                                <td className="text-left">{u.email}</td>
                                <td className="text-center">
                                    <RoleBadge role={u.role} />
                                </td>
                                <td className="text-center">
                                    <StatusBadge status={u.status} />
                                </td>
                                <td className="text-center">{u.created}</td>
                                <td className="text-right pr-4 space-x-3">
                                    <button onClick={() => onView(u)} className="text-blue-600">
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => onBan(u)} className="text-orange-500">
                                        <Ban size={18} />
                                    </button>
                                    <button onClick={() => onDelete(u)} className="text-red-500">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-800 font-medium">
                    Showing {users.length} of {filteredUsers.length} users
                </p>

                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded font-medium text-gray-800 disabled:opacity-40"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 border rounded font-medium ${page === i + 1
                                ? "bg-blue-600 text-white"
                                : "text-gray-800 hover:bg-gray-100"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded font-medium text-gray-800 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ===================== BADGES ===================== */

function StatusBadge({ status }: { status: string }) {
    const map: any = {
        active: "bg-green-100 text-green-600",
        banned: "bg-red-100 text-red-600",
    }

    return (
        <span
            className={`px-4 py-1 rounded-full text-xs font-normal ${map[status]}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

function RoleBadge({ role }: { role: string }) {
    const map: any = {
        user: "bg-gray-100 text-gray-600",
        moderator: "bg-purple-100 text-purple-600",
        admin: "bg-blue-100 text-blue-600",
    }

    return (
        <span
            className={`px-4 py-1 rounded-full text-xs font-normal ${map[role]}`}
        >
            {role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
    )
}

/* ===================== DATA ===================== */

const USERS = [
    {
        id: 1,
        username: "john_doe",
        email: "john_doe@example.com",
        role: "admin",
        status: "active",
        created: "2024-03-15",
    },
    {
        id: 2,
        username: "alice_wonder",
        email: "alice_wonder@example.com",
        role: "moderator",
        status: "active",
        created: "2024-03-15",
    },
    {
        id: 3,
        username: "bob_smith",
        email: "bob_smith@example.com",
        role: "user",
        status: "active",
        created: "2024-03-15",
    },
    {
        id: 4,
        username: "charlie_bad",
        email: "charlie_bad@example.com",
        role: "user",
        status: "banned",
        created: "2024-03-15",
    },
    {
        id: 5,
        username: "david_lee",
        email: "david_lee@example.com",
        role: "user",
        status: "active",
        created: "2024-03-14",
    },
    {
        id: 6,
        username: "emma_jones",
        email: "emma_jones@example.com",
        role: "moderator",
        status: "active",
        created: "2024-03-14",
    },
    {
        id: 7,
        username: "frank_moore",
        email: "frank_moore@example.com",
        role: "user",
        status: "banned",
        created: "2024-03-14",
    },
    {
        id: 8,
        username: "grace_kelly",
        email: "grace_kelly@example.com",
        role: "user",
        status: "active",
        created: "2024-03-13",
    },
    {
        id: 9,
        username: "henry_clark",
        email: "henry_clark@example.com",
        role: "user",
        status: "active",
        created: "2024-03-13",
    },
    {
        id: 10,
        username: "isabella_moon",
        email: "isabella_moon@example.com",
        role: "moderator",
        status: "active",
        created: "2024-03-13",
    },
    {
        id: 11,
        username: "jack_turner",
        email: "jack_turner@example.com",
        role: "user",
        status: "inactive",
        created: "2024-03-12",
    },
    {
        id: 12,
        username: "karen_white",
        email: "karen_white@example.com",
        role: "user",
        status: "active",
        created: "2024-03-12",
    },
    {
        id: 13,
        username: "leo_martin",
        email: "leo_martin@example.com",
        role: "user",
        status: "banned",
        created: "2024-03-12",
    },
    {
        id: 14,
        username: "nina_brown",
        email: "nina_brown@example.com",
        role: "admin",
        status: "active",
        created: "2024-03-11",
    },

]

