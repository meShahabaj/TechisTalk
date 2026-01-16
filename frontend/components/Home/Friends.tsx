"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Friend {
    id: string;
    username: string;
    email: string;
}

export default function Friends() {
    const router = useRouter();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);

    /* =======================
       LOAD FRIENDS
    ======================= */
    const loadFriends = async () => {
        try {
            const res = await fetch("/api/friend/get", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to load friends");

            const data = await res.json();
            setFriends(data.friends);
        } catch (error) {
            console.error("Failed to load friends:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFriends();
    }, []);

    /* =======================
       REMOVE FRIEND
    ======================= */
    const removeFriend = async (friendId: string) => {
        if (!confirm("Are you sure you want to remove this friend?")) return;

        try {
            const res = await fetch("/api/friend/remove", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendId }),
            });

            if (!res.ok) throw new Error("Failed to remove friend");

            loadFriends();
        } catch (error) {
            console.error("Failed to remove friend:", error);
        }
    };


    return (
        <div className="p-6 max-w-xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6 text-white">Your Friends</h1>

            {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-4 mt-20">
                    <p className="text-gray-400 text-center text-lg">
                        You have no friends yet.
                    </p>
                    <button
                        onClick={() => router.push("/search-friends")}
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700
                       transition text-white font-medium shadow-lg"
                    >
                        Find Friends
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {friends.map((friend) => (
                        <div
                            key={friend.id}
                            className="flex justify-between items-center p-4 border border-gray-800
                         rounded-2xl shadow-lg bg-gray-900/70 backdrop-blur-lg
                         transition hover:scale-[1.02] duration-200"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500
                                flex items-center justify-center text-white font-bold text-lg">
                                    {friend.username?.[0]?.toUpperCase() || "U"}
                                </div>

                                {/* Friend Info */}
                                <div className="flex flex-col">
                                    <p className="font-semibold text-white">
                                        {friend.username}
                                    </p>
                                    <p className="text-gray-400 text-sm">{friend.email}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => router.push(`/chat/${friend.id}`)}
                                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                             text-white font-medium shadow transition"
                                >
                                    Talk
                                </button>

                                <button
                                    onClick={() => removeFriend(friend.id)}
                                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700
                             text-white font-medium shadow transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
