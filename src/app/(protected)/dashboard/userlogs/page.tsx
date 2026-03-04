"use client"

import { useEffect, useState } from "react"
import {
    Download,
    FileText,
    Heart,
    MessageCircle,
    Share2,
    AlertCircle,
    LogIn,
    Users,
} from "lucide-react"
import api from "@/lib/axios"

interface Log {
    _id: string
    admin_username: string
    action: string
    entity_type: string
    created_at: string
    old_value?: any
    new_value?: any
}

export default function UserActivityLogsPage() {
    const [logs, setLogs] = useState<Log[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchLogs(page)
    }, [page])

    const fetchLogs = async (currentPage: number) => {
        try {
            setLoading(true)

            const res = await api.get(`/admin/logs?page=${currentPage}&limit=5`)

            setLogs((prev) =>
                currentPage === 1
                    ? res.data.logs
                    : [...prev, ...res.data.logs]
            )

            setTotalPages(res.data.totalPages)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    /* ================= ICON ================= */

    const getIcon = (action: string) => {
        const lower = action?.toLowerCase() || ""

        if (lower.includes("login"))
            return <LogIn className="text-purple-500 w-5 h-5" />

        if (lower.includes("post"))
            return <FileText className="text-blue-500 w-5 h-5" />

        if (lower.includes("like"))
            return <Heart className="text-green-500 w-5 h-5" />

        if (lower.includes("comment"))
            return <MessageCircle className="text-green-500 w-5 h-5" />

        if (lower.includes("share"))
            return <Share2 className="text-green-500 w-5 h-5" />

        if (lower.includes("report"))
            return <AlertCircle className="text-red-500 w-5 h-5" />

        if (lower.includes("group"))
            return <Users className="text-purple-500 w-5 h-5" />

        return <FileText className="w-5 h-5 text-gray-500" />
    }

    const getBadgeColor = (action: string) => {
        const lower = action?.toLowerCase() || ""

        if (lower.includes("report"))
            return "bg-red-100 text-red-600"

        if (
            lower.includes("like") ||
            lower.includes("comment") ||
            lower.includes("share")
        )
            return "bg-green-100 text-green-600"

        if (lower.includes("post"))
            return "bg-blue-100 text-blue-600"

        if (lower.includes("login"))
            return "bg-purple-100 text-purple-600"

        return "bg-gray-100 text-gray-600"
    }

    const renderValue = (value: any) => {
        if (!value) return null

        if (typeof value === "object") {
            return (
                <pre className="bg-gray-50 p-3 rounded-xl text-xs overflow-auto mt-2 border">
                    {JSON.stringify(value, null, 2)}
                </pre>
            )
        }

        return <p className="mt-2 text-sm text-gray-700">{value}</p>
    }

    /* ================= STATS ================= */

    const stats = [
        {
            title: "Logins",
            value: logs.filter((l) =>
                l.action?.toLowerCase().includes("login")
            ).length,
            icon: <LogIn className="text-purple-500 w-6 h-6" />,
            bg: "bg-purple-100",
        },
        {
            title: "Posts",
            value: logs.filter((l) =>
                l.action?.toLowerCase().includes("post")
            ).length,
            icon: <FileText className="text-blue-500 w-6 h-6" />,
            bg: "bg-blue-100",
        },
        {
            title: "Interactions",
            value: logs.filter(
                (l) =>
                    l.action?.toLowerCase().includes("like") ||
                    l.action?.toLowerCase().includes("comment") ||
                    l.action?.toLowerCase().includes("share")
            ).length,
            icon: <Heart className="text-green-500 w-6 h-6" />,
            bg: "bg-green-100",
        },
        {
            title: "Groups",
            value: logs.filter((l) =>
                l.action?.toLowerCase().includes("group")
            ).length,
            icon: <Users className="text-indigo-500 w-6 h-6" />,
            bg: "bg-indigo-100",
        },
        {
            title: "Reports",
            value: logs.filter((l) =>
                l.action?.toLowerCase().includes("report")
            ).length,
            icon: <AlertCircle className="text-red-500 w-6 h-6" />,
            bg: "bg-red-100",
        },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <div className="flex-1 p-8 space-y-8">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Activity Logs
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Track all user actions and behaviors
                        </p>
                    </div>

                    <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition">
                        <Download size={18} />
                        Export Logs
                    </button>
                </div>

                {/* LOG CARD */}
                <div className="bg-white rounded-2xl shadow-sm divide-y">

                    {logs.map((log, index) => (
                        <div
                            key={`${log._id}-${index}`}
                            className="flex justify-between p-6 hover:bg-gray-50 transition"
                        >
                            <div className="flex gap-4 w-full">

                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    {getIcon(log.action)}
                                </div>

                                <div className="flex-1">

                                    <p className="font-semibold text-blue-600">
                                        {log.admin_username}
                                        <span className="text-gray-500 ml-2 font-normal">
                                            • {log.action?.replaceAll("_", " ")}
                                        </span>
                                    </p>

                                    <p className="text-gray-600 mt-1 text-sm">
                                        Entity: {log.entity_type}
                                    </p>

                                    <span
                                        className={`inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                                            log.action
                                        )}`}
                                    >
                                        {log.entity_type}
                                    </span>

                                    {log.old_value && (
                                        <div className="mt-4">
                                            <p className="text-xs text-gray-500">Old Value:</p>
                                            {renderValue(log.old_value)}
                                        </div>
                                    )}

                                    {log.new_value && (
                                        <div className="mt-4">
                                            <p className="text-xs text-gray-500">New Value:</p>
                                            {renderValue(log.new_value)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-right text-sm text-gray-500 whitespace-nowrap ml-6">
                                {new Date(log.created_at).toLocaleTimeString()}
                                <br />
                                {new Date(log.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}

                    {page < totalPages && (
                        <div className="text-center p-6">
                            <button
                                onClick={() => setPage(page + 1)}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                {loading ? "Loading..." : "Load More Logs"}
                            </button>
                        </div>
                    )}
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {stats.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}
                            >
                                {item.icon}
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm">{item.title}</p>
                                <p className="text-2xl font-semibold">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}