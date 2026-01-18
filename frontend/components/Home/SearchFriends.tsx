"use client";

import { useEffect, useState } from "react";
import Bots from "./Bots";
import Loading from "../Loading";

interface UserType {
    _id: string;
    username: string;
}

interface Props {
    user: {
        id: string;
        username: string;
        email?: string;
        friends: string[];
        friendRequests: string[];
    };
}

const SearchFriends = ({ user }: Props) => {
    const [users, setUsers] = useState<UserType[]>([]);
    const [search, setSearch] = useState("");
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    /* =======================
       LOAD ALL USERS
    ======================= */
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch("/api/allusers", {
                    credentials: "include",
                });

                const data = await res.json();
                setUsers(data.users || []);
            } catch (err) {
                console.error("Failed to load users:", err);
            } finally {
                setLoading(false)
            }
        };

        loadUsers();
    }, []);

    /* =======================
       SEND FRIEND REQUEST
    ======================= */
    const sendRequest = async (toUserId: string) => {
        try {
            setLoadingId(toUserId);

            const res = await fetch("/api/friendrequest/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    fromUserId: user.id,
                    toUserId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            alert("Friend request sent!");
        } catch (err: any) {
            alert(err.message || "Failed to send request");
        } finally {
            setLoadingId(null);
        }
    };

    /* =======================
       FILTER USERS
    ======================= */
    const filteredUsers = users.filter(
        (u) =>
            u.username.toLowerCase().includes(search.toLowerCase()) &&
            u._id !== user.id &&
            !user.friends.includes(u._id) &&
            !user.friendRequests.includes(u._id)
    );
    if (loading) { return <div><Loading /></div> }

    /* =======================
       RENDER
    ======================= */
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-white">Find Friends</h2>

            {/* SEARCH BAR */}
            <div className="bg-gray-900/80 backdrop-blur-lg p-5 rounded-2xl shadow-xl border border-gray-700 mb-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-800 text-gray-200 
          border border-gray-700 focus:ring-2 focus:ring-indigo-500 
          outline-none transition"
                />
            </div>

            {/* USERS LIST */}
            <div className="flex flex-col gap-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                        <div
                            key={u._id}
                            className="bg-gray-900/80 backdrop-blur-lg p-5 rounded-2xl 
              border border-gray-700 shadow-lg flex items-center 
              justify-between transition hover:scale-[1.02]"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full bg-gradient-to-br 
                  from-indigo-400 to-purple-500 flex items-center 
                  justify-center text-white font-bold text-lg"
                                >
                                    {u.username[0].toUpperCase()}
                                </div>
                                <p className="text-white font-semibold text-lg">
                                    {u.username}
                                </p>
                            </div>

                            <button
                                disabled={loadingId === u._id}
                                onClick={() => sendRequest(u._id)}
                                className="hover:cursor-pointer px-5 py-2 rounded-xl bg-blue-600 text-white 
                hover:bg-blue-700 transition shadow font-medium 
                disabled:opacity-50"
                            >
                                {loadingId === u._id ? "Sending..." : "Follow"}
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center mt-6">
                        No users found.
                    </p>
                )}
            </div>
            <div className="-mt-2">
                <Bots />
            </div>
        </div>
    );
};

export default SearchFriends;
