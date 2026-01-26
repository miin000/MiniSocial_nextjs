"use client"

import { useMemo, useState } from "react"
import {
    Search,
    Eye,
    EyeOff,
    AlertTriangle,
    Trash2,
    Heart,
    MessageCircle,
} from "lucide-react"

/* ===================== PAGE ===================== */

export default function PostsManagementPage() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [page, setPage] = useState(1)

    const PAGE_SIZE = 5

    /* ===================== FILTER ===================== */
    const filteredPosts = useMemo(() => {
        return POSTS.filter((p) => {
            const searchOk =
                p.author.toLowerCase().includes(search.toLowerCase()) ||
                p.content.toLowerCase().includes(search.toLowerCase()) ||
                p.id.toString().includes(search)

            const statusOk = status === "all" || p.status === status
            return searchOk && statusOk
        })
    }, [search, status])

    const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE)
    const posts = filteredPosts.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    /* ===================== ACTIONS ===================== */
    const onView = (p: any) => alert(`View post ${p.id}`)
    const onToggleHide = (p: any) =>
        alert(`${p.status === "hidden" ? "Show" : "Hide"} post ${p.id}`)
    const onWarn = (p: any) => alert(`Warn user ${p.author}`)
    const onDelete = (p: any) => alert(`Delete post ${p.id}`)

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Posts Management
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Monitor and moderate all posts
                    </p>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Export Posts
                </button>
            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white border rounded-xl p-4 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        placeholder="Search by content, author, or post ID..."
                        className="w-full border rounded-lg pl-10 pr-4 py-2
             text-gray-800 placeholder-gray-400"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value)
                        setPage(1)
                    }}
                    className=" border rounded-lg px-3 py-2 text-gray-800"
                >
                    <option value="all">All Status</option>
                    <option value="normal">Normal</option>
                    <option value="reported">Reported</option>
                    <option value="hidden">Hidden</option>
                </select>
            </div>

            {/* POSTS LIST */}
            <div className="space-y-4">
                {posts.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white border rounded-xl p-5 flex justify-between gap-6"
                    >
                        {/* LEFT */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                                {p.author.slice(0, 2).toUpperCase()}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <p className="font-semibold text-gray-900">
                                        {p.author}
                                    </p>
                                    <span className="text-sm text-gray-500">
                                        Post #{p.id}
                                    </span>
                                    <StatusBadge status={p.status} />
                                </div>

                                <p className="text-gray-800">
                                    {p.content}
                                </p>

                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Heart size={16} /> {p.likes} likes
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle size={16} /> {p.comments} comments
                                    </span>
                                    <span>{p.created}</span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-start gap-4 pt-2">
                            <button onClick={() => onView(p)} className="text-blue-600">
                                <Eye size={20} />
                            </button>
                            <button onClick={() => onToggleHide(p)} className="text-orange-500">
                                {p.status === "hidden" ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                            <button onClick={() => onWarn(p)} className="text-yellow-500">
                                <AlertTriangle size={20} />
                            </button>
                            <button onClick={() => onDelete(p)} className="text-red-500">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* FOOTER */}
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                    Showing {posts.length} of {filteredPosts.length} posts
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
                            className={`px-3 py-1 border rounded font-medium text-sm ${page === i + 1
                                ? "bg-blue-600 text-white border-blue-600"
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

/* ===================== BADGE ===================== */

function StatusBadge({ status }: { status: string }) {
    const map: any = {
        normal: "bg-green-100 text-green-700",
        reported: "bg-red-100 text-red-700",
        hidden: "bg-gray-200 text-gray-700",
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}>
            {status}
        </span>
    )
}

/* ===================== MOCK DATA ===================== */

const POSTS = [
    {
        id: 5423,
        author: "john_doe",
        content: "Just had an amazing coffee at the new cafe downtown! ☕",
        status: "normal",
        likes: 245,
        comments: 32,
        created: "2024-03-15 10:30",
    },
    {
        id: 5420,
        author: "charlie_bad",
        content: "SPAM: Buy cheap products now! Click here!!!",
        status: "reported",
        likes: 2,
        comments: 1,
        created: "2024-03-15 07:20",
    },
    {
        id: 5417,
        author: "frank_moore",
        content: "Inappropriate content that violates community guidelines...",
        status: "hidden",
        likes: 5,
        comments: 2,
        created: "2024-03-14 14:20",
    },
    {
        id: 5422,
        author: "alice_wonder",
        content: "Check out my new blog post about web development trends in 2024!",
        status: "normal",
        likes: 189,
        comments: 24,
        created: "2024-03-15 09:15",
    },
    {
        id: 5421,
        author: "bob_smith",
        content: "Looking for recommendations on the best laptop for programming. Any suggestions?",
        status: "normal",
        likes: 67,
        comments: 45,
        created: "2024-03-15 08:45",
    },
    {
        id: 5419,
        author: "david_lee",
        content: "Beautiful sunset today 🌅 Nature never fails to amaze me.",
        status: "normal",
        likes: 512,
        comments: 68,
        created: "2024-03-14 18:30",
    },
    {
        id: 5418,
        author: "emma_jones",
        content: "Just finished reading an amazing book! Highly recommended for mystery lovers.",
        status: "normal",
        likes: 156,
        comments: 19,
        created: "2024-03-14 16:45",
    },

]