"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Filter, Eye, ShieldOff, ShieldCheck, Trash2 } from "lucide-react"
import api from "@/lib/axios"

/* ===================== TYPES ===================== */
type Group = {
    id: string
    name: string
    description: string
    status: "active" | "blocked"
    avatar_url?: string
    memberCount?: number
    created: string
}

/* ===================== PAGE ===================== */
export default function GroupManagementPage() {
    const [groupsData, setGroupsData] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [showFilter, setShowFilter] = useState(false)

    const [page, setPage] = useState(1)
    const PAGE_SIZE = 8

    /* ===== FETCH GROUPS ===== */
    useEffect(() => {
        fetchGroups()
    }, [])

    const fetchGroups = async () => {
        try {
            setLoading(true)
            const res = await api.get("/admin/groups")

            const mapped: Group[] = res.data.map((g: any) => ({
                id: g._id,
                name: g.name,
                description: g.description || "",
                status: g.status === "blocked" ? "blocked" : "active",
                avatar_url: g.avatar_url,
                memberCount: g.memberCount,
                created: g.createdAt
                    ? new Date(g.createdAt).toISOString().split("T")[0]
                    : "-",
            }))

            setGroupsData(mapped)
        } catch (err) {
            alert("Không lấy được danh sách group")
        } finally {
            setLoading(false)
        }
    }

    /* ===== FILTER ===== */
    const filteredGroups = useMemo(() => {
        return groupsData.filter((g) => {
            const searchOk = g.name.toLowerCase().includes(search.toLowerCase())
            const statusOk = status === "all" || g.status === status
            return searchOk && statusOk
        })
    }, [groupsData, search, status])

    const totalPages = Math.ceil(filteredGroups.length / PAGE_SIZE)
    const groups = filteredGroups.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    /* ===== ACTIONS ===== */
    const onToggleStatus = async (g: Group) => {
        const newStatus = g.status === "active" ? "blocked" : "active"
        const label = newStatus === "blocked" ? "khoá" : "mở khoá"
        if (!confirm(`Bạn có chắc muốn ${label} group "${g.name}"?`)) return
        try {
            await api.put(`/admin/groups/${g.id}/status`, { status: newStatus })
            setGroupsData((prev) =>
                prev.map((x) =>
                    x.id === g.id ? { ...x, status: newStatus } : x
                )
            )
        } catch {
            alert(`Không thể ${label} group`)
        }
    }

    /* ===== STATUS BADGE ===== */
    const StatusBadge = ({ s }: { s: Group["status"] }) =>
        s === "active" ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Active
            </span>
        ) : (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                Blocked
            </span>
        )

    /* ===== RENDER ===== */
    return (
        <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Group Management</h1>
                <span className="text-sm text-gray-500">
                    Total: {groupsData.length} groups
                </span>
            </div>

            {/* Search + Filter */}
            <div className="flex gap-3 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    />
                </div>
                <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                    onClick={() => setShowFilter((v) => !v)}
                >
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Filter panel */}
            {showFilter && (
                <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-600">Status</span>
                        {["all", "active", "blocked"].map((v) => (
                            <label key={v} className="flex items-center gap-1 capitalize cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value={v}
                                    checked={status === v}
                                    onChange={() => { setStatus(v); setPage(1) }}
                                />
                                {v}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading...</div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-semibold">
                            <tr>
                                <th className="px-4 py-3 text-left">#</th>
                                <th className="px-4 py-3 text-left">Group</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Created</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {groups.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400">
                                        No groups found
                                    </td>
                                </tr>
                            ) : (
                                groups.map((g, idx) => (
                                    <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-gray-400">
                                            {(page - 1) * PAGE_SIZE + idx + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {g.avatar_url ? (
                                                    <img
                                                        src={g.avatar_url}
                                                        alt={g.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                        {g.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-800">{g.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                                            {g.description || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge s={g.status} />
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{g.created}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onToggleStatus(g)}
                                                    title={g.status === "active" ? "Block group" : "Unblock group"}
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        g.status === "active"
                                                            ? "text-orange-500 hover:bg-orange-50"
                                                            : "text-green-500 hover:bg-green-50"
                                                    }`}
                                                >
                                                    {g.status === "active" ? (
                                                        <ShieldOff className="w-4 h-4" />
                                                    ) : (
                                                        <ShieldCheck className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-3 py-1.5 rounded-lg border text-sm ${
                                p === page
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
