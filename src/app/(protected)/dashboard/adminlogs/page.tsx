"use client"

import { useEffect, useState } from "react"
import {
    Search,
    Download,
    ShieldAlert,
    Settings,
    User,
    Filter,
} from "lucide-react"
import api from "@/lib/axios"

/* ===================== TYPES ===================== */

type LogItem = {
    id: string
    actor: string
    action: string
    target?: string
    description?: string
    category: "moderation" | "system" | "admin"
    createdAt: string
}

/* ===================== ICON MAP ===================== */

const iconMap = {
    moderation: <ShieldAlert className="text-red-500" />,
    system: <Settings className="text-blue-500" />,
    admin: <User className="text-purple-500" />,
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogItem[]>([])
    const [search, setSearch] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [typeFilter, setTypeFilter] = useState("all")
    const [dateFilter, setDateFilter] = useState("all")

    useEffect(() => {
        loadLogs()
    }, [])

    const loadLogs = async () => {
        try {
            const res = await api.get("/admin/users")

            const mappedLogs: LogItem[] = res.data.map((user: any) => {
                let createdAt = user.createdAt

                if (!createdAt && user._id) {
                    const timestamp = parseInt(user._id.substring(0, 8), 16)
                    createdAt = new Date(timestamp * 1000).toISOString()
                }

                return {
                    id: user._id,
                    actor: "admin",
                    action: "Viewed User",
                    target: `User: ${user.username || user.email}`,
                    description: `Status: ${user.status || "active"}`,
                    category:
                        user.status === "blocked" ? "moderation" : "admin",
                    createdAt,
                }
            })

            setLogs(mappedLogs)
        } catch (err) {
            console.error("Load logs failed", err)
            setLogs([])
        }
    }

    /* ===================== FILTER LOGIC ===================== */

    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            log.actor.toLowerCase().includes(search.toLowerCase()) ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            log.target?.toLowerCase().includes(search.toLowerCase())

        const matchesType =
            typeFilter === "all" || log.category === typeFilter

        let matchesDate = true
        const logDate = new Date(log.createdAt)
        const now = new Date()
        const diff = now.getTime() - logDate.getTime()

        if (dateFilter === "24h") {
            matchesDate = diff <= 24 * 60 * 60 * 1000
        }

        if (dateFilter === "7d") {
            matchesDate = diff <= 7 * 24 * 60 * 60 * 1000
        }

        if (dateFilter === "30d") {
            matchesDate = diff <= 30 * 24 * 60 * 60 * 1000
        }

        return matchesSearch && matchesType && matchesDate
    })

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Logs & Activity
                    </h1>
                    <p className="text-gray-600">
                        Track all administrative actions
                    </p>
                </div>

                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
                    <Download size={18} />
                    Export Logs
                </button>
            </div>

            {/* SEARCH + FILTER BUTTON */}
            <div className="bg-white border rounded-xl p-4 space-y-4">

                <div className="flex gap-4">
                    {/* SEARCH */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by admin, action, or target..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
                        />
                    </div>

                    {/* FILTER BUTTON */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 font-medium text-gray-700"
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>

                {/* FILTER DROPDOWN */}
                {showFilters && (
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">

                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="moderation">Moderation</option>
                            <option value="system">System</option>
                            <option value="admin">Admin</option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Time</option>
                            <option value="24h">Last 24 Hours</option>
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>

                        <div className="flex items-center font-medium text-gray-700">
                            Total: {filteredLogs.length}
                        </div>

                    </div>
                )}
            </div>

            {/* LOG LIST */}
            <div className="bg-white rounded-xl border divide-y">
                {filteredLogs.map((log) => (
                    <div
                        key={log.id}
                        className="flex justify-between p-5 hover:bg-gray-50 transition"
                    >
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                {iconMap[log.category]}
                            </div>

                            <div>
                                <p className="font-semibold text-blue-600">
                                    {log.actor}
                                    <span className="text-gray-600 font-normal">
                                        {" • "}{log.action}
                                    </span>
                                </p>

                                {log.target && (
                                    <p className="text-sm text-gray-700">
                                        {log.target}
                                    </p>
                                )}

                                {log.description && (
                                    <p className="text-sm text-gray-500">
                                        {log.description}
                                    </p>
                                )}

                                <span
                                    className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${log.category === "moderation"
                                            ? "bg-red-100 text-red-600"
                                            : log.category === "system"
                                                ? "bg-blue-100 text-blue-600"
                                                : "bg-purple-100 text-purple-600"
                                        }`}
                                >
                                    {log.category.charAt(0).toUpperCase() +
                                        log.category.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="text-right text-sm text-gray-500">
                            {new Date(log.createdAt).toLocaleTimeString()}
                            <br />
                            {new Date(log.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-6">
                <SummaryCard
                    title="Moderation Actions"
                    count={
                        logs.filter((l) => l.category === "moderation").length
                    }
                    icon={<ShieldAlert className="text-red-500" />}
                />
                <SummaryCard
                    title="System Changes"
                    count={logs.filter((l) => l.category === "system").length}
                    icon={<Settings className="text-blue-500" />}
                />
                <SummaryCard
                    title="Admin Actions"
                    count={logs.filter((l) => l.category === "admin").length}
                    icon={<User className="text-purple-500" />}
                />
            </div>
        </div>
    )
}

/* ===================== SUMMARY CARD ===================== */

function SummaryCard({
    title,
    count,
    icon,
}: {
    title: string
    count: number
    icon: React.ReactNode
}) {
    return (
        <div className="bg-white rounded-xl border p-6 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-gray-600 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">
                    {count}
                </p>
            </div>
        </div>
    )
}