"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Filter, Eye, Ban, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

/* ===================== PAGE ===================== */

export default function UserManagementPage() {
    const [showFilter, setShowFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("all")
    const [status, setStatus] = useState("all")
    const [page, setPage] = useState(1)

    const [usersData, setUsersData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const PAGE_SIZE = 8

    /* ===== MOCK API ===== */
    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)

        // 👉 giả lập gọi backend
        setTimeout(() => {
            setUsersData(USERS_MOCK)
            setLoading(false)
        }, 500)
    }

    /* ===== FILTER ===== */
    const filteredUsers = useMemo(() => {
        return usersData.filter((u) => {
            const searchOk =
                u.username.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase())

            const roleOk = role === "all" || u.role === role
            const statusOk = status === "all" || u.status === status

            return searchOk && roleOk && statusOk
        })
    }, [usersData, search, role, status])

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE)

    const users = filteredUsers.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

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

                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Export Users
                </button>
            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white border rounded-xl p-4 space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Search by username or email..."
                            className="w-full border rounded-lg pl-10 pr-4 py-2 text-gray-900"
                        />
                    </div>

                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                </div>

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
                                className="w-full border rounded-lg px-3 py-2 text-gray-900"
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
                                className="w-full border rounded-lg px-3 py-2 text-gray-900"
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
                <table className="w-full text-sm text-gray-900">
                    <thead className="bg-gray-100 font-semibold">
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
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-600">
                                    Loading users...
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                                            {u.username.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium">{u.username}</p>
                                            <p className="text-xs text-gray-600 font-medium">
                                                ID: {u.id}
                                            </p>
                                        </div>
                                    </td>

                                    <td>{u.email}</td>

                                    <td className="text-center">
                                        <RoleBadge role={u.role} />
                                    </td>

                                    <td className="text-center">
                                        <StatusBadge status={u.status} />
                                    </td>

                                    <td className="text-center">{u.created}</td>

                                    <td className="text-right pr-4">
                                        <div className="flex justify-end gap-2">
                                            <ActionButton onClick={() => onView(u)} type="view">
                                                <Eye size={18} />
                                            </ActionButton>
                                            <ActionButton onClick={() => onBan(u)} type="ban">
                                                <Ban size={18} />
                                            </ActionButton>
                                            <ActionButton onClick={() => onDelete(u)} type="delete">
                                                <Trash2 size={18} />
                                            </ActionButton>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex items-center justify-between px-4 py-3 border-t bg-white">
                    {/* LEFT TEXT */}
                    <p className="text-sm text-gray-700 font-medium">
                        Showing {users.length} of {filteredUsers.length} users
                    </p>

                    {/* RIGHT CONTROLS */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm border rounded-lg font-medium
                       disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const pageNumber = i + 1
                            return (
                                <button
                                    key={pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition
                        ${page === pageNumber
                                            ? "bg-blue-600 text-white"
                                            : "border hover:bg-gray-50"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            )
                        })}

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm border rounded-lg font-medium
                       disabled:opacity-40 hover:bg-gray-50 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

/* ===================== COMPONENTS ===================== */

function ActionButton({ children, onClick, type }: any) {
    const map: any = {
        view: "text-blue-600 hover:bg-blue-50",
        ban: "text-orange-500 hover:bg-orange-50",
        delete: "text-red-500 hover:bg-red-50",
    }

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-md transition hover:scale-110 ${map[type]}`}
        >
            {children}
        </button>
    )
}

function StatusBadge({ status }: any) {
    const map: any = {
        active: "bg-green-100 text-green-600",
        banned: "bg-red-100 text-red-600",
    }

    return (
        <span className={`px-4 py-1 rounded-full text-xs font-medium ${map[status]}`}>
            {status}
        </span>
    )
}

function RoleBadge({ role }: any) {
    const map: any = {
        user: "bg-gray-100 text-gray-700",
        moderator: "bg-purple-100 text-purple-700",
        admin: "bg-blue-100 text-blue-700",
    }

    return (
        <span className={`px-4 py-1 rounded-full text-xs font-medium ${map[role]}`}>
            {role}
        </span>
    )
}

/* ===================== MOCK DATA ===================== */

const USERS_MOCK = [
    { id: 1, username: "john_doe", email: "john@example.com", role: "admin", status: "active", created: "2024-03-15" },
    { id: 2, username: "alice", email: "alice@example.com", role: "moderator", status: "active", created: "2024-03-15" },
    { id: 3, username: "bob", email: "bob@example.com", role: "user", status: "banned", created: "2024-03-14" },
    { id: 4, username: "emma", email: "emma@example.com", role: "user", status: "active", created: "2024-03-14" },
    { id: 5, username: "frank", email: "frank@example.com", role: "user", status: "active", created: "2024-03-13" },
    { id: 6, username: "grace", email: "grace@example.com", role: "moderator", status: "active", created: "2024-03-13" },
    { id: 7, username: "henry", email: "henry@example.com", role: "user", status: "banned", created: "2024-03-12" },
    { id: 8, username: "nina", email: "nina@example.com", role: "admin", status: "active", created: "2024-03-11" },
    { id: 9, username: "jack", email: "jack@example.com", role: "user", status: "active", created: "2024-03-11" },
]
