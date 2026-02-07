"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"

/* ===================== PAGE ===================== */

export default function ReportsPage() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [page, setPage] = useState(1)
    const [selectedReport, setSelectedReport] = useState<any>(null)

    const PAGE_SIZE = 5

    const filteredReports = useMemo(() => {
        return REPORTS.filter((r) => {
            const s = search.toLowerCase()

            const searchOk =
                r.reporter.toLowerCase().includes(s) ||
                r.target.toLowerCase().includes(s) ||
                r.reason.toLowerCase().includes(s)

            const statusOk = status === "all" ? true : r.status === status
            return searchOk && statusOk
        })
    }, [search, status])

    const reports = filteredReports.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    const pendingCount = REPORTS.filter(
        (r) => r.status === "Pending"
    ).length

    return (
        <>
            <div className="space-y-6">

                {/* TITLE */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Reports & Moderation
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Review and handle content reports
                        </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500">
                        Pending: {pendingCount}
                    </span>
                </div>

                {/* SEARCH */}
                <div className="bg-white border rounded-xl p-4 flex gap-4">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(1)
                            }}
                            placeholder="Search by reporter, target user, or reason..."
                            className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm text-gray-700"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value)
                            setPage(1)
                        }}
                        className="border rounded-lg px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {/* TABLE */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="p-4 text-left">Report ID</th>
                                <th className="text-left">Reporter</th>
                                <th className="text-left">Target</th>
                                <th className="text-left">Reason</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Created</th>
                                <th className="text-right pr-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700">
                            {reports.map((r) => (
                                <tr key={r.id} className="border-t hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">#{r.id}</td>
                                    <td>{r.reporter}</td>

                                    <td>
                                        <p className="text-gray-700">{r.target}</p>
                                        <p className="text-xs text-gray-500">
                                            by {r.author}
                                        </p>
                                    </td>

                                    <td>
                                        <ReasonBadge reason={r.reason} />
                                    </td>

                                    <td className="text-center">
                                        <StatusBadge status={r.status} />
                                    </td>

                                    <td className="text-center text-gray-500">
                                        {r.created}
                                    </td>

                                    <td className="text-right pr-4">
                                        {r.status === "Pending" ? (
                                            <button
                                                onClick={() => setSelectedReport(r)}
                                                className="px-3 py-1 rounded-md text-xs text-white bg-blue-500 font-medium border border-blue-500 text-blue-600 hover:bg-blue-600"
                                            >
                                                Review
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                {r.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {selectedReport && (
                <ReviewModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </>
    )
}

/* ===================== MODAL ===================== */

function ReviewModal({ report, onClose }: any) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={18} />
                </button>

                <h2 className="text-xl font-medium mb-4 text-gray-800">
                    Review Report #{report.id}
                </h2>

                <div className="grid grid-cols-2 gap-6 text-sm">
                    {[
                        ["Reporter", report.reporter],
                        ["Target", report.target],
                        ["Target User", report.author],
                        ["Reason", report.reason],
                    ].map(([label, value]) => (
                        <div key={label}>
                            <p className="text-gray-500">{label}</p>
                            <p className="text-gray-700">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <p className="text-gray-500 text-sm mb-1">
                        Description
                    </p>
                    <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-600">
                        This post contains content violating community guidelines.
                    </div>
                </div>

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-gray-700">
                    Reported Content Preview:
                    <p className="mt-1 text-gray-600">
                        This is the reported content that violates guidelines...
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 rounded-md
    bg-green-600 text-white font-medium
    hover:bg-green-700
    active:scale-95
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-green-400">
                        Accept & Remove
                    </button>
                    <button className="px-4 py-2 rounded-md
    bg-red-600 text-white font-medium
    hover:bg-red-700
    active:scale-95
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-400">
                        Ban User
                    </button>
                    <button className="px-4 py-2 rounded-md
    bg-gray-700 text-white font-medium
    hover:bg-gray-800
    active:scale-95
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-gray-400">
                        Reject Report
                    </button>
                </div>

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md
    border border-gray-400
    text-gray-700 font-medium
    hover:bg-gray-100
    active:scale-95
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ===================== BADGES ===================== */

function StatusBadge({ status }: any) {
    const map: any = {
        Pending: "bg-yellow-50 text-yellow-600",
        Resolved: "bg-green-50 text-green-600",
        Rejected: "bg-gray-100 text-gray-500",
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs ${map[status]}`}>
            {status}
        </span>
    )
}

function ReasonBadge({ reason }: any) {
    const map: any = {
        Spam: "bg-yellow-50 text-yellow-600",
        Harassment: "bg-red-50 text-red-600",
        "Inappropriate Content": "bg-orange-50 text-orange-600",
        "Hate Speech": "bg-red-50 text-red-600",
        Scam: "bg-purple-50 text-purple-600",
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs ${map[reason]}`}>
            {reason}
        </span>
    )
}

/* ===================== DATA ===================== */

const REPORTS = [
    {
        id: 1,
        reporter: "alice_wonder",
        target: "Post #5420",
        author: "charlie_bad",
        reason: "Spam",
        status: "Pending",
        created: "2024-03-15 11:30",
    },
    {
        id: 2,
        reporter: "john_doe",
        target: "Comment #9821",
        author: "toxic_user",
        reason: "Harassment",
        status: "Pending",
        created: "2024-03-15 10:15",
    },
    {
        id: 3,
        reporter: "bob_smith",
        target: "Post #5417",
        author: "frank_moore",
        reason: "Inappropriate Content",
        status: "Resolved",
        created: "2024-03-14 14:20",
    },
    {
        id: 4,
        reporter: "emma_jones",
        target: "User #789",
        author: "hate_speaker",
        reason: "Hate Speech",
        status: "Pending",
        created: "2024-03-15 09:45",
    },
    {
        id: 5,
        reporter: "david_lee",
        target: "Post #5401",
        author: "scammer123",
        reason: "Scam",
        status: "Rejected",
        created: "2024-03-14 16:00",
    },
]
