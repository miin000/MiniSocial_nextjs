"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Group {
    _id: string;
    name: string;
    description?: string;
    avatar_url?: string;
    cover_url?: string;
}

export default function GroupPage() {
    const params = useParams();
    const id = params.id as string;

    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);

    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const api = axios.create({
        baseURL: "http://localhost:3000",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    useEffect(() => {
        if (!id) return;

        const fetchGroup = async () => {
            try {
                const res = await api.get(`/groups/${id}`);
                setGroup(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!group) return <div>Group not found</div>;

    return (
        <div className="p-6">
            {group.cover_url && (
                <img
                    src={group.cover_url}
                    alt="cover"
                    className="w-full h-48 object-cover rounded-xl"
                />
            )}

            <h1 className="text-2xl font-bold mt-4">{group.name}</h1>
            <p className="text-gray-600">{group.description}</p>
        </div>
    );
}
