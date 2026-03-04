"use client"

import { useEffect, useState } from "react"
import {
    FileText,
    Heart,
    MessageCircle,
    Share2,
    AlertCircle,
    LogIn,
    Download,
    Search,
} from "lucide-react"
import api from "@/lib/axios"

/* ================= TYPES ================= */

type UserLog = {
    id: string
    username: string
    type: "post" | "like" | "comment" | "share" | "report" | "login"
    description?: string
    createdAt: string
}

/* ================= ICON MAP ================= */

const iconMap: Record<string, JSX.Element> = {
    post: <FileText className="text-blue-500" />,
    like: <Heart className="text-green-500" />,
    comment: <MessageCircle className="text-green-500" />,
    share: <Share2 className="text-green-500" />,
    report: <AlertCircle className="text-red-500" />,
    login: <LogIn className="text-purple-500" />,
}

export default function UserActivityLogs() {
    const [logs, setLogs] = useState<UserLog[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadLogs()
    }, [])

    const loadLogs = async () => {
        try {
            const res = await api.get("/admin/user-logs")

            const mapped: UserLog[] = res.data.map((item: any) => ({
                id: item._id,
                username: item.user?.username || item.user || "Unknown",
                type: item.type,
                description: item.description,
                createdAt: item.createdAt,
            }))

            setLogs(mapped)
        } catch (err) {
            console.error("Load user logs failed", err)
            setLogs([])
        } finally {
            setLoading(false)
        }
    }

    const filteredLogs = logs.filter(
        (log) =>
            log.username.toLowerCase().includes(search.toLowerCase()) ||
            log.type.toLowerCase().includes(search.toLowerCase())
    )

    /* ================= SUMMARY ================= */

    const loginCount = logs.filter(l => l.type === "login").length
    const postCount = logs.filter(l => l.type === "post").length
    const interactionCount = logs.filter(l =>
        ["like", "comment", "share"].includes(l.type)
    ).length
    const reportCount = logs.filter(l => l.type === "report").length

    return (
        <div className="p-8 space-y-8">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        User Activity Logs
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track all user actions and behaviors
                    </p>
                </div>

                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
                    <Download size={18} />
                    Export Logs
                </button>
            </div>

            {/* SEARCH */}
            <div className="bg-white border rounded-2xl shadow-sm p-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by user or action..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* LOG LIST */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                {loading ? (
                    <div className="p-12 text-center text-gray-500">
                        Loading logs...
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <p className="text-lg font-medium">
                            No user activity found
                        </p>
                        <p className="text-sm mt-2">
                            When users interact with the system, logs will appear here.
                        </p>
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <div
                            key={log.id}
                            className="flex justify-between items-start p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                        >
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                    {iconMap[log.type]}
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {log.username}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1 capitalize">
                                        {log.type}
                                    </p>

                                    {log.description && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {log.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="text-right text-sm text-gray-500 whitespace-nowrap">
                                {new Date(log.createdAt).toLocaleTimeString()}
                                <br />
                                {new Date(log.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-4 gap-6">
                <SummaryCard title="Logins" count={loginCount} />
                <SummaryCard title="Posts" count={postCount} />
                <SummaryCard title="Interactions" count={interactionCount} />
                <SummaryCard title="Reports" count={reportCount} />
            </div>

        </div>
    )
}

/* ================= SUMMARY CARD ================= */

function SummaryCard({
    title,
    count,
}: {
    title: string
    count: number
}) {
    return (
        <div className="bg-white border rounded-2xl shadow-sm p-6 text-center">
            <p className="text-gray-600 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
                {count}
            </p>
        </div>
    )
}