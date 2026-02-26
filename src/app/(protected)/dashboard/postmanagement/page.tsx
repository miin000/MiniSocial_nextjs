"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Search,
    Eye,
    EyeOff,
    AlertTriangle,
    Trash2,
    Heart,
    MessageCircle,
    X,
} from "lucide-react"
import api from "@/lib/axios"

/* ===================== TYPES ===================== */
type PostStatus = "normal" | "reported" | "hidden"

type Post = {
    id: string | number
    author: string
    content: string
    status: PostStatus
    likes: number
    comments: number
    created: string
}

/* ===================== PAGE ===================== */
export default function PostsManagementPage() {
    const [postsData, setPostsData] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [status, setStatus] = useState<"all" | PostStatus>("all")
    const [page, setPage] = useState(1)

    const [viewPost, setViewPost] = useState<Post | null>(null)
    const [confirmDelete, setConfirmDelete] = useState<Post | null>(null)

    const [toast, setToast] = useState<{
        type: "success" | "error"
        msg: string
    } | null>(null)

    const PAGE_SIZE = 5

    /* ===================== FETCH POSTS ===================== */
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get("/admin/posts")

                const raw =
                    Array.isArray(res.data)
                        ? res.data
                        : Array.isArray(res.data?.data)
                            ? res.data.data
                            : Array.isArray(res.data?.posts)
                                ? res.data.posts
                                : []

                const normalized: Post[] = raw.map((p: any) => ({
                    id: p.id ?? p._id,
                    author: p.author?.username ?? p.author ?? "unknown",
                    content: p.content ?? "",
                    status: p.status ?? "normal",
                    likes: p.likes ?? 0,
                    comments: p.comments ?? 0,
                    created: p.createdAt ?? p.created ?? "-",
                }))

                setPostsData(normalized)
            } catch (err) {
                console.error(err)
                setPostsData([])
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    /* ===================== FILTER ===================== */
    const filteredPosts = useMemo(() => {
        return postsData.filter((p) => {
            const s = search.toLowerCase()
            const searchOk =
                p.author.toLowerCase().includes(s) ||
                p.content.toLowerCase().includes(s) ||
                String(p.id).includes(s)

            const statusOk = status === "all" || p.status === status
            return searchOk && statusOk
        })
    }, [search, status, postsData])

    const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE)

    const posts = filteredPosts.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    )

    /* ===================== ACTIONS ===================== */
    const toggleHide = (p: Post) => {
        const newStatus: PostStatus =
            p.status === "hidden" ? "normal" : "hidden"

        setPostsData((prev) =>
            prev.map((x) =>
                x.id === p.id ? { ...x, status: newStatus } : x
            )
        )

        setToast({
            type: "success",
            msg:
                newStatus === "hidden"
                    ? "Đã ẩn bài viết"
                    : "Đã hiển thị bài viết",
        })
    }

    const reportPost = (p: Post) => {
        setPostsData((prev) =>
            prev.map((x) =>
                x.id === p.id ? { ...x, status: "reported" } : x
            )
        )

        setToast({ type: "success", msg: "Đã report bài viết" })
    }

    const deletePost = async () => {
        if (!confirmDelete) return

        try {
            await api.delete(`/admin/posts/${confirmDelete.id}`)
            setPostsData((prev) =>
                prev.filter((x) => x.id !== confirmDelete.id)
            )
            setConfirmDelete(null)
            setToast({ type: "success", msg: "Đã xoá bài viết" })
        } catch {
            setToast({ type: "error", msg: "Không thể xoá bài viết" })
        }
    }

    if (loading) {
        return (
            <p className="text-center text-sm text-gray-500 mt-10">
                Loading posts...
            </p>
        )
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Posts Management
                </h1>
                <p className="text-base text-gray-600 mt-1">
                    Monitor and moderate all posts
                </p>
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
                        placeholder="Search by content, author, or post ID..."
                        className="w-full border rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value as any)
                        setPage(1)
                    }}
                    className="border rounded-lg px-3 py-2 text-sm text-gray-900s"
                >
                    <option value="all">All Status</option>
                    <option value="normal">Normal</option>
                    <option value="reported">Reported</option>
                    <option value="hidden">Hidden</option>
                </select>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                {posts.map((p) => (
                    <div
                        key={p.id}
                        className="bg-white border rounded-xl p-5 flex justify-between gap-6 shadow-sm"
                    >
                        <div className="flex gap-4">
                            <div className="w-11 h-11 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                                {p.author.slice(0, 2).toUpperCase()}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-sm text-gray-900">
                                        {p.author}
                                    </p>
                                    <span className="text-sm text-gray-500">
                                        Post #{p.id}
                                    </span>
                                    <StatusBadge status={p.status} />
                                </div>

                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {p.content}
                                </p>

                                <div className="flex gap-6 text-sm text-gray-500 mt-1">
                                    <span className="flex gap-1 items-center">
                                        <Heart size={14} /> {p.likes}
                                    </span>
                                    <span className="flex gap-1 items-center">
                                        <MessageCircle size={14} /> {p.comments}
                                    </span>
                                    <span>{p.created}</span>
                                </div>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 pt-1">
                            <ActionButton color="blue" onClick={() => setViewPost(p)}>
                                <Eye size={18} />
                            </ActionButton>
                            <ActionButton color="orange" onClick={() => toggleHide(p)}>
                                {p.status === "hidden" ? (
                                    <Eye size={18} />
                                ) : (
                                    <EyeOff size={18} />
                                )}
                            </ActionButton>
                            <ActionButton color="yellow" onClick={() => reportPost(p)}>
                                <AlertTriangle size={18} />
                            </ActionButton>
                            <ActionButton color="red" onClick={() => setConfirmDelete(p)}>
                                <Trash2 size={18} />
                            </ActionButton>
                        </div>
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                    Showing {posts.length} of {filteredPosts.length} posts
                </span>

                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded border ${page === i + 1
                                ? "bg-blue-600 text-white"
                                : ""
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* MODALS */}
            {viewPost && (
                <Modal onClose={() => setViewPost(null)}>
                    <h2 className="text-lg font-bold mb-3">
                        Post #{viewPost.id}
                    </h2>
                    <p className="text-base text-gray-800 whitespace-pre-line">
                        {viewPost.content}
                    </p>
                </Modal>
            )}

            {confirmDelete && (
                <Modal onClose={() => setConfirmDelete(null)}>
                    <p className="text-base font-semibold mb-4">
                        Xoá bài viết này?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button className="px-4 py-1 border rounded text-sm">
                            Huỷ
                        </button>
                        <button
                            onClick={deletePost}
                            className="px-4 py-1 bg-red-600 text-white rounded text-sm"
                        >
                            Xoá
                        </button>
                    </div>
                </Modal>
            )}

            {toast && (
                <div
                    className={`fixed bottom-5 right-5 px-4 py-2 rounded text-sm text-white ${toast.type === "success"
                        ? "bg-green-600"
                        : "bg-red-600"
                        }`}
                >
                    {toast.msg}
                </div>
            )}
        </div>
    )
}

/* ===================== COMPONENTS ===================== */
function ActionButton({
    children,
    onClick,
    color,
}: {
    children: React.ReactNode
    onClick: () => void
    color: "blue" | "orange" | "yellow" | "red"
}) {
    const map = {
        blue: "text-blue-600 hover:bg-blue-50",
        orange: "text-orange-500 hover:bg-orange-50",
        yellow: "text-yellow-500 hover:bg-yellow-50",
        red: "text-red-500 hover:bg-red-50",
    }

    return (
        <button
            onClick={onClick}
            className={`p-2 rounded-full transition ${map[color]}`}
        >
            {children}
        </button>
    )
}

function StatusBadge({ status }: { status: PostStatus }) {
    const map = {
        normal: "bg-green-100 text-green-700",
        reported: "bg-red-100 text-red-700",
        hidden: "bg-gray-200 text-gray-700",
    }

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${map[status]}`}>
            {status}
        </span>
    )
}

function Modal({
    children,
    onClose,
}: {
    children: React.ReactNode
    onClose: () => void
}) {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400"
                >
                    <X size={18} />
                </button>
                {children}
            </div>
        </div>
    )
}