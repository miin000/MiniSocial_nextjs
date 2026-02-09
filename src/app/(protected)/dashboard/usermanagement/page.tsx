"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Filter, Eye, Ban, Trash2 } from "lucide-react"
import api from "@/lib/axios"
import { useAuthStore } from "@/store/auth.store"

/* ===================== PAGE ===================== */

export default function UserManagementPage() {
    const [showFilter, setShowFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [role, setRole] = useState("all")
    const [status, setStatus] = useState("all")
    const [page, setPage] = useState(1)

    const [usersData, setUsersData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const { user, token } = useAuthStore()

    const PAGE_SIZE = 8

    /* ===== FETCH FROM BACKEND ===== */
    useEffect(() => {
        console.log("🔑 Current user:", user)
        console.log("🔑 Current token:", token)
        console.log("🔑 User role:", user?.roles_admin)
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            console.log("👉 Fetching users from backend...")
            console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)

            const res = await api.get("/admin/users")
            console.log("✅ Backend response:", res.data)


            // Map data cho đúng UI
            const mappedUsers = res.data.map((u: any) => ({
                id: u._id,
                username: u.username || "Unknown",
                email: u.email || "-",
                role: u.role?.toLowerCase() || "user",
                status: u.isBlocked ? "banned" : "active",
                created: u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "-",
            }))

            setUsersData(mappedUsers)
        } catch (error: any) {
            console.error("❌ Fetch users error:", error)
            console.error("❌ Error response:", error.response?.data)
            console.error("❌ Error status:", error.response?.status)
            
            const errorMsg = error.response?.data?.message || error.message
            const errorStatus = error.response?.status
            
            alert(`Lỗi ${errorStatus || "Unknown"}: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
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
            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white border rounded-xl p-4 space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                            size={18}
                        />
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
                            <th>Email</th>
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
                                    <td className="p-4 font-medium">{u.username}</td>
                                    <td>{u.email}</td>
                                    <td className="text-center">{u.role}</td>
                                    <td className="text-center">{u.status}</td>
                                    <td className="text-center">{u.created}</td>
                                    <td className="text-right pr-4">
                                        <div className="flex justify-end gap-2">
                                            <ActionButton onClick={() => onView(u)}>
                                                <Eye size={18} />
                                            </ActionButton>
                                            <ActionButton onClick={() => onBan(u)}>
                                                <Ban size={18} />
                                            </ActionButton>
                                            <ActionButton onClick={() => onDelete(u)}>
                                                <Trash2 size={18} />
                                            </ActionButton>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/* ===================== COMPONENTS ===================== */

function ActionButton({ children, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition"
        >
            {children}
        </button>
    )
}
