"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts"

/* ===================== PAGE ===================== */

export default function DashboardPage() {
    return (
        <div className="space-y-6">

            {/* TITLE */}
            <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                    Dashboard
                </h1>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <Stat title="Total Users" value="45,231" percent="+12.5%" icon="users" />
                <Stat title="Active Users (24h)" value="8,421" percent="+5.2%" icon="active" />
                <Stat title="Total Posts" value="123,456" percent="+8.1%" icon="posts" />
                <Stat title="Reported Posts" value="342" percent="-2.3%" danger icon="warning" />
                <Stat title="Groups Count" value="1,234" percent="+15.7%" icon="groups" />
                <Stat title="System Status" value="Online" percent="99.9%" icon="status" />
            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* USER GROWTH */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        User Growth
                    </h3>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* POSTS & REPORTS */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Posts & Reports (Weekly)
                    </h3>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={postsReportsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="posts" fill="#2563eb" />
                                <Bar dataKey="reports" fill="#dc2626" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* ===================== NEW SECTION (CHÈN THÊM) ===================== */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* CONTENT VIOLATION TYPES */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Content Violation Types
                    </h3>

                    <div className="h-72 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={violationData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {violationData.map((_, index) => (
                                        <Cell key={index} fill={VIOLATION_COLORS[index]} />
                                    ))}
                                </Pie>

                                <Tooltip />

                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                />
                            </PieChart>

                        </ResponsiveContainer>
                    </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Recent Activity
                    </h3>

                    <ul className="space-y-4 text-sm">
                        {recentActivities.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span
                                    className={`w-2.5 h-2.5 rounded-full mt-1 ${item.color}`}
                                />
                                <div>
                                    <p className="text-gray-900">{item.text}</p>
                                    <p className="text-gray-500 text-xs">{item.time}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    )
}

/* ===================== STATS ===================== */

function Stat({ title, value, percent, danger, icon }: any) {
    const iconMap: any = {
        users: "👥",
        active: "📈",
        posts: "📝",
        warning: "⚠️",
        groups: "👪",
        status: "🚀",
    }

    return (
        <div className="bg-white p-6 rounded-xl border flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {value}
                </h3>
                <p className={`mt-1 text-sm ${danger ? "text-red-500" : "text-green-500"}`}>
                    {percent}
                </p>
            </div>

            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl bg-gray-100">
                {iconMap[icon]}
            </div>
        </div>
    )
}

/* ===================== DATA ===================== */

const userGrowthData = [
    { month: "Jan", users: 3500 },
    { month: "Feb", users: 4200 },
    { month: "Mar", users: 5200 },
    { month: "Apr", users: 6800 },
    { month: "May", users: 9000 },
    { month: "Jun", users: 11500 },
    { month: "Jul", users: 14500 },
]

const postsReportsData = [
    { day: "Mon", posts: 450, reports: 12 },
    { day: "Tue", posts: 520, reports: 18 },
    { day: "Wed", posts: 480, reports: 15 },
    { day: "Thu", posts: 610, reports: 22 },
    { day: "Fri", posts: 720, reports: 25 },
    { day: "Sat", posts: 860, reports: 30 },
    { day: "Sun", posts: 670, reports: 20 },
]

const violationData = [
    { name: "Spam", value: 35 },
    { name: "Harassment", value: 25 },
    { name: "Hate Speech", value: 20 },
    { name: "Inappropriate", value: 15 },
    { name: "Others", value: 5 },
]

const VIOLATION_COLORS = [
    "#3b82f6",
    "#ef4444",
    "#f59e0b",
    "#10b981",
    "#8b5cf6",
]

const recentActivities = [
    {
        text: "New user registered: john_doe123",
        time: "2 mins ago",
        color: "bg-green-500",
    },
    {
        text: "Post #5423 reported for spam",
        time: "15 mins ago",
        color: "bg-red-500",
    },
    {
        text: "Admin banned user @badactor",
        time: "32 mins ago",
        color: "bg-blue-500",
    },
    {
        text: "New user registered: alice_wonder",
        time: "1 hour ago",
        color: "bg-green-500",
    },
    {
        text: "Comment #9821 reported for harassment",
        time: "2 hours ago",
        color: "bg-red-500",
    },
]