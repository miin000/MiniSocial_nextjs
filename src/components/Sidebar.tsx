'use client'

import {
    LayoutDashboard,
    Users,
    FileText,
    AlertTriangle,
    UsersRound,
    BarChart3,
    Settings,
    Shield,
    ClipboardList,
    LogOut,
    Activity,
} from 'lucide-react'

export default function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-gradient-to-b from-[#0b132b] to-[#0f172a] text-white flex flex-col">

            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                    M
                </div>
                <span className="text-lg font-semibold">MiniSocial</span>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <MenuItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
                <MenuItem icon={<Users size={18} />} label="User Management" />
                <MenuItem icon={<FileText size={18} />} label="Posts Management" />
                <MenuItem icon={<AlertTriangle size={18} />} label="Reports & Moderation" />
                <MenuItem icon={<UsersRound size={18} />} label="Groups & Communities" />
                <MenuItem icon={<BarChart3 size={18} />} label="Analytics & Statistics" />
                <MenuItem icon={<Settings size={18} />} label="System Settings" />
                <MenuItem icon={<Shield size={18} />} label="Admin Accounts" />
                <MenuItem icon={<ClipboardList size={18} />} label=" System Logs & Activity" />
                <MenuItem icon={<Activity size={18} />} label="User Logs & Activity" />
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/10">
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    )
}

function MenuItem({
    icon,
    label,
    active = false,
}: {
    icon: React.ReactNode
    label: string
    active?: boolean
}) {
    return (
        <div
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition
        ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
      `}
        >
            {icon}
            <span>{label}</span>
        </div>
    )
}
