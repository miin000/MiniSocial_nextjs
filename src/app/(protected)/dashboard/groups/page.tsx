"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Search,
    Eye,
    ShieldOff,
    ShieldCheck,
    Users,
    Globe,
    Lock,
    Crown
} from "lucide-react"
import api from "@/lib/axios"

/* ===================== TYPES ===================== */
type Group = {
    id: string
    name: string
    description: string
    status: "active" | "blocked"
    privacy: "public" | "private"
    avatar_url?: string
    memberCount: number
    owner?: string
    created: string
}

/* ===================== PAGE ===================== */
export default function GroupManagementPage() {
    const [groupsData, setGroupsData] = useState<Group[]>([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [privacy, setPrivacy] = useState("all")

    const [page, setPage] = useState(1)
    const PAGE_SIZE = 6

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
                privacy: g.privacy || "public",
                avatar_url: g.avatar_url,
                memberCount: g.memberCount || 0,
                owner: g.owner?.username || "Unknown",
                created: g.createdAt
                    ? new Date(g.createdAt).toISOString().split("T")[0]
                    : "-"
            }))

            setGroupsData(mapped)
        } catch {
            alert("Không lấy được danh sách group")
        } finally {
            setLoading(false)
        }
    }

    /* ===== FILTER ===== */
    const filteredGroups = useMemo(() => {
        return groupsData.filter((g) => {
            const searchOk = g.name
                .toLowerCase()
                .includes(search.toLowerCase())
            const statusOk = status === "all" || g.status === status
            const privacyOk = privacy === "all" || g.privacy === privacy
            return searchOk && statusOk && privacyOk
        })
    }, [groupsData, search, status, privacy])

    const totalPages = Math.ceil(filteredGroups.length / PAGE_SIZE)
    const groups = filteredGroups.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    const onToggleStatus = async (g: Group) => {
        const newStatus = g.status === "active" ? "blocked" : "active"
        if (!confirm("Bạn chắc chắn muốn thay đổi trạng thái group?")) return

        try {
            await api.put(`/admin/groups/${g.id}/status`, { status: newStatus })
            setGroupsData((prev) =>
                prev.map((x) =>
                    x.id === g.id ? { ...x, status: newStatus } : x
                )
            )
        } catch {
            alert("Không thể thay đổi trạng thái group")
        }
    }

    const StatusBadge = ({ s }: { s: Group["status"] }) =>
        s === "active" ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Active
            </span>
        ) : (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                Disabled
            </span>
        )

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Groups & Communities
                    </h1>
                    <p className="mt-1 text-gray-600 text-sm">
                        Manage all groups and communities
                    </p>
                </div>
                <span className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 text-sm font-semibold">
                    Total Groups: {groupsData.length}
                </span>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        className="pl-9 pr-3 py-2 rounded-lg border w-full text-sm text-gray-900"
                        placeholder="Search by group name or owner..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </div>

                <select
                    className="px-3 py-2 rounded-lg border text-sm text-gray-900"
                    value={privacy}
                    onChange={(e) => {
                        setPrivacy(e.target.value)
                        setPage(1)
                    }}
                >
                    <option value="all">All Privacy</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>

                <select
                    className="px-3 py-2 rounded-lg border text-sm text-gray-900"
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value)
                        setPage(1)
                    }}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Disabled</option>
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    Loading...
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {groups.map((g) => (
                        <div
                            key={g.id}
                            className="rounded-2xl border bg-white shadow-sm hover:shadow-md overflow-hidden"
                        >
                            <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-500" />

                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {g.name}
                                    </h3>
                                    <StatusBadge s={g.status} />
                                </div>

                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                    {g.description}
                                </p>

                                <div className="text-sm text-gray-700 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium">
                                            Owner:
                                        </span>{" "}
                                        {g.owner}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        {g.memberCount} members
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {g.privacy === "public" ? (
                                            <Globe className="w-4 h-4" />
                                        ) : (
                                            <Lock className="w-4 h-4" />
                                        )}
                                        {g.privacy}
                                    </div>
                                    <div className="text-gray-500">
                                        Created: {g.created}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>

                                    <button
                                        onClick={() => onToggleStatus(g)}
                                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border ${g.status === "active"
                                                ? "border-red-300 text-red-600 hover:bg-red-50"
                                                : "border-green-300 text-green-600 hover:bg-green-50"
                                            }`}
                                    >
                                        {g.status === "active" ? (
                                            <>
                                                <ShieldOff className="w-4 h-4" />
                                                Disable
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-4 h-4" />
                                                Enable
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                <SummaryCard
                    title="Total Members"
                    value={groupsData.reduce(
                        (sum, g) => sum + g.memberCount,
                        0
                    )}
                />
                <SummaryCard
                    title="Public Groups"
                    value={groupsData.filter((g) => g.privacy === "public").length}
                />
                <SummaryCard
                    title="Private Groups"
                    value={
                        groupsData.filter((g) => g.privacy === "private").length
                    }
                />
                <SummaryCard
                    title="Disabled Groups"
                    value={
                        groupsData.filter((g) => g.status === "blocked").length
                    }
                />
            </div>
        </div>
    )
}

/* ===== SUMMARY CARD ===== */
function SummaryCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    )
}