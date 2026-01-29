'use client'

import { useState } from 'react'
import GroupCard from '@/components/GroupCard'
import { Group } from '@/types'

export default function GroupsPage() {
    // ================= MOCK DATA =================
    const [groups] = useState<Group[]>([
        {
            id: '1',
            name: 'Web Developers',
            description: 'A community for web developers to share knowledge and ideas',
            owner: 'john_doe',
            members: 1250,
            privacy: 'PUBLIC',
            status: 'ACTIVE',
            createdAt: '2023-12-01',
        },
        {
            id: '2',
            name: 'Photography Lovers',
            description: 'Share your best shots and learn photography techniques',
            owner: 'alice_wonder',
            members: 890,
            privacy: 'PUBLIC',
            status: 'ACTIVE',
            createdAt: '2024-01-15',
        },
        {
            id: '3',
            name: 'Private Book Club',
            description: 'Monthly book discussions and literary conversations',
            owner: 'emma_jones',
            members: 45,
            privacy: 'PRIVATE',
            status: 'ACTIVE',
            createdAt: '2024-02-10',
        },
        {
            id: '4',
            name: 'Gaming Community',
            description: 'Discuss games, share tips, and find gaming partners',
            owner: 'bob_smith',
            members: 2340,
            privacy: 'PUBLIC',
            status: 'ACTIVE',
            createdAt: '2023-10-20',
        },
        {
            id: '5',
            name: 'Fitness & Health',
            description: 'Share fitness routines, healthy recipes, and wellness tips',
            owner: 'david_lee',
            members: 567,
            privacy: 'PUBLIC',
            status: 'ACTIVE',
            createdAt: '2024-01-05',
        },
        {
            id: '6',
            name: 'Spam Group',
            description: 'Group used for spam activities',
            owner: 'spammer_user',
            members: 12,
            privacy: 'PUBLIC',
            status: 'DISABLED',
            createdAt: '2024-03-10',
        },
    ])


    // ================= FILTER =================
    const [search, setSearch] = useState('')
    const [privacy, setPrivacy] = useState('ALL')
    const [status, setStatus] = useState('ALL')

    const filteredGroups = groups.filter((g) => {
        return (
            g.name.toLowerCase().includes(search.toLowerCase()) &&
            (privacy === 'ALL' || g.privacy === privacy) &&
            (status === 'ALL' || g.status === status)
        )
    })

    // ================= TOTAL =================
    const totalMembers = groups.reduce((sum, g) => sum + g.members, 0)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Groups & Communities
                    </h1>
                    <p className="text-gray-600">
                        Manage all groups and communities
                    </p>
                </div>

                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
                    Total Groups: {groups.length}
                </div>
            </div>

            {/* Search & filter */}
            <div className="bg-white border rounded-xl p-4 flex gap-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by group name or owner..."
                    className="flex-1 border rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400"
                />

                <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                    className="border rounded-lg px-4 py-2 text-gray-800"
                >
                    <option value="ALL">All Privacy</option>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                </select>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded-lg px-4 py-2 text-gray-800"
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group) => (
                    <GroupCard key={group.id} group={group} />
                ))}
            </div>

            {/* Footer stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                <Stat title="Total Members" value={totalMembers} />
                <Stat title="Public Groups" value={groups.filter(g => g.privacy === 'PUBLIC').length} />
                <Stat title="Private Groups" value={groups.filter(g => g.privacy === 'PRIVATE').length} />
                <Stat title="Disabled Groups" value={groups.filter(g => g.status === 'DISABLED').length} />
            </div>
        </div>
    )
}

function Stat({ title, value }: { title: string; value: number }) {
    return (
        <div className="bg-white border rounded-xl p-4">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
                {value}
            </p>
        </div>
    )
}
