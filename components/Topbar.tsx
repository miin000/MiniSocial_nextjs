'use client'

import { Search, Bell, ChevronDown, User } from 'lucide-react'

export default function Topbar() {
    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

            {/* Search */}
            <div className="relative w-[420px]">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                    type="text"
                    placeholder="Search users, posts, ID..."
                    className="w-full pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-6">

                {/* Notification */}
                <div className="relative cursor-pointer">
                    <Bell size={20} className="text-gray-700" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>

                {/* User */}
                <div className="flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                        <User size={18} className="text-white" />
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold text-gray-800">
                            Admin User
                        </div>
                        <div className="text-xs text-gray-600">
                            Super Admin
                        </div>
                    </div>
                    <ChevronDown size={16} className="text-gray-600" />
                </div>
            </div>
        </header>
    )
}
