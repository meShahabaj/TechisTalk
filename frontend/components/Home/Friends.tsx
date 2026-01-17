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
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold mb-8 
      bg-gradient-to-r from-indigo-500 to-purple-500 
      text-transparent bg-clip-text">
                Your Friends
            </h1>

            {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-24 space-y-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 
          flex items-center justify-center text-3xl shadow-xl text-white">
                        👥
                    </div>
                    <p className="text-gray-400 text-lg text-center">
                        No friends yet. Start connecting!
                    </p>
                    <button
                        onClick={() => router.push("/search-friends")}
                        className="px-7 py-3 rounded-2xl 
            bg-indigo-600 hover:bg-indigo-700 
            text-white font-semibold shadow-lg transition">
                        Find Friends
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {friends.map((friend) => (
                        <div
                            key={friend.id}
                            className="w-full p-4 rounded-2xl
        bg-gray-900/70 backdrop-blur-xl
        border border-white/10 shadow-md
        flex items-center justify-between gap-3"
                        >
                            {/* Left */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-12 h-12 rounded-full 
          bg-gradient-to-br from-indigo-400 to-purple-500
          flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {friend.username?.[0]?.toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-white truncate">
                                        {friend.username}
                                    </p>

                                </div>
                            </div>

                            {/* Right */}
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => router.push(`/chat/${friend.id}`)}
                                    className="hover:cursor-pointer px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
            text-white text-sm font-medium shadow"
                                >
                                    talk
                                </button>

                                <button
                                    onClick={() => removeFriend(friend.id)}
                                    className="hover:cursor-pointer px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700
            text-white text-sm font-medium shadow"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}


                </div>
            )
            }
        </div >
    );


}