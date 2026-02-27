"use client"

import { useEffect, useState, useCallback } from "react"
import {
    Search,
    Eye,
    EyeOff,
    Trash2,
    Heart,
    MessageCircle,
    Loader2,
    AlertTriangle,
} from "lucide-react"
import {
    fetchAdminPosts,
    hidePost,
    showPost,
    deletePost,
} from "@/services/admin.service"

/* ===================== PAGE ===================== */

export default function PostsManagementPage() {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [page, setPage] = useState(1)
    const [posts, setPosts] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const PAGE_SIZE = 10

    const loadPosts = useCallback(async () => {
        try {
            setLoading(true)
            const data = await fetchAdminPosts({
                page,
                limit: PAGE_SIZE,
                status: status === "all" ? undefined : status,
                search: search || undefined,
            })
            setPosts(data.posts || [])
            setTotal(data.total || 0)
        } catch (err) {
            console.error("Failed to load posts:", err)
        } finally {
            setLoading(false)
        }
    }, [page, status, search])

    useEffect(() => {
        const debounce = setTimeout(() => {
            loadPosts()
        }, search ? 400 : 0)
        return () => clearTimeout(debounce)
    }, [loadPosts])

    const totalPages = Math.ceil(total / PAGE_SIZE)

    /* ===================== ACTIONS ===================== */
    const onToggleHide = async (p: any) => {
        const id = p._id
        try {
            setActionLoading(id)
            if (p.status === 'hidden') {
                await showPost(id)
            } else {
                await hidePost(id)
            }
            loadPosts()
        } catch (err) {
            console.error("Failed to toggle post visibility:", err)
            alert("Failed to update post")
        } finally {
            setActionLoading(null)
        }
    }

    const onDelete = async (p: any) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
        const id = p._id
        try {
            setActionLoading(id)
            await deletePost(id)
            loadPosts()
        } catch (err) {
            console.error("Failed to delete post:", err)
            alert("Failed to delete post")
        } finally {
            setActionLoading(null)
        }
    }

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

                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    Total: {total}
                </span>
            </div>

            {/* SEARCH + FILTER */}
            <div className="bg-white border rounded-xl p-4 flex gap-4">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                        placeholder="Search by content..."
                        className="w-full border rounded-lg pl-10 pr-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value)
                        setPage(1)
                    }}
                    className="border rounded-lg px-3 py-2 text-gray-800 hover:bg-gray-50 transition"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                    <option value="deleted">Deleted</option>
                </select>
            </div>

            {/* POSTS LIST */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-white border rounded-xl p-12 text-center text-gray-400">
                    No posts found
                </div>
            ) : (
                <div className="space-y-4">
                    {posts.map((p: any) => (
                        <div
                            key={p._id}
                            className="bg-white border rounded-xl p-5 flex justify-between gap-6 transition hover:shadow-md"
                        >
                            {/* LEFT */}
                            <div className="flex gap-4 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold shrink-0">
                                    {(p.user_name || p.username || 'U').slice(0, 2).toUpperCase()}
                                </div>

                                <div className="space-y-2 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <p className="font-semibold text-gray-900">
                                            {p.user_name || p.username || 'Unknown'}
                                        </p>
                                        {p.username && (
                                            <span className="text-sm text-gray-400">@{p.username}</span>
                                        )}
                                        <StatusBadge status={p.status} />
                                        {p.report_count > 0 && (
                                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-600">
                                                <AlertTriangle size={12} />
                                                {p.report_count} report{p.report_count > 1 ? 's' : ''}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-800 line-clamp-2">
                                        {p.content || '(No content)'}
                                    </p>

                                    {p.media_urls?.length > 0 && (
                                        <p className="text-xs text-gray-400">
                                            📎 {p.media_urls.length} media file(s)
                                        </p>
                                    )}

                                    <div className="flex items-center gap-6 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Heart size={16} /> {p.likes_count || 0} likes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle size={16} /> {p.comments_count || 0} comments
                                        </span>
                                        <span>
                                            {p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : ''}
                                        </span>
                                        {p.group_id && (
                                            <span className="px-2 py-0.5 rounded-full text-xs bg-purple-50 text-purple-600">
                                                Group post
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex items-start gap-2 pt-2 shrink-0">
                                <ActionButton
                                    onClick={() => onToggleHide(p)}
                                    color="orange"
                                    disabled={actionLoading === p._id}
                                    title={p.status === 'hidden' ? 'Show post' : 'Hide post'}
                                >
                                    {p.status === "hidden" ? <Eye size={20} /> : <EyeOff size={20} />}
                                </ActionButton>

                                <ActionButton
                                    onClick={() => onDelete(p)}
                                    color="red"
                                    disabled={actionLoading === p._id}
                                    title="Delete post"
                                >
                                    <Trash2 size={20} />
                                </ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FOOTER / PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} posts
                    </p>

                    <div className="flex gap-2">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1 border rounded font-medium text-gray-800 disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                            const pageNum = i + 1
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-3 py-1 border rounded font-medium text-sm transition
                                        ${page === pageNum
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "text-gray-800 hover:bg-gray-100"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1 border rounded font-medium text-gray-800 disabled:opacity-40 hover:bg-gray-100 transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ===================== ACTION BUTTON ===================== */

function ActionButton({
    children,
    onClick,
    color,
    disabled,
    title,
}: {
    children: React.ReactNode
    onClick: () => void
    color: string
    disabled?: boolean
    title?: string
}) {
    const map: Record<string, string> = {
        blue: "text-blue-600 hover:bg-blue-50",
        orange: "text-orange-500 hover:bg-orange-50",
        yellow: "text-yellow-500 hover:bg-yellow-50",
        red: "text-red-500 hover:bg-red-50",
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 disabled:opacity-50 ${map[color]}`}
        >
            {children}
        </button>
    )
}

/* ===================== BADGE ===================== */

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        active: "bg-green-100 text-green-700",
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-blue-100 text-blue-700",
        rejected: "bg-orange-100 text-orange-700",
        hidden: "bg-gray-200 text-gray-700",
        deleted: "bg-red-100 text-red-700",
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    )
}
