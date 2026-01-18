"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

interface FriendRequest {
    id: string;
    from: {
        id: string;
        username: string;
        email?: string;
    };
}

const FriendRequests = () => {
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    /* =======================
       LOAD REQUESTS
    ======================= */
    const loadRequests = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/friendrequest/get", {
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to load requests");

            const data = await res.json();
            setRequests(data.requests || []);
        } catch (err) {
            console.error("Failed to load requests:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, []);

    /* =======================
       ACCEPT / REJECT
    ======================= */
    const acceptRequest = async (fromUserId: string) => {
        await fetch("/api/friendrequest/accept", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fromUserId }),
        });

        loadRequests();
    };

    const rejectRequest = async (fromUserId: string) => {
        await fetch("/api/friendrequest/reject", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fromUserId }),
        });

        loadRequests();
    };

    if (loading) {
        return <div><Loading /></div>
    }


    /* =======================
       RENDER
    ======================= */
    return (
        <div className="max-w-xl mx-auto py-10">
            <h1 className="text-3xl font-bold text-white mb-6">
                Friend Requests
            </h1>
            {loading ? <Loading /> : <div>
                {requests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-4 mt-20">
                        <p className="text-gray-400 text-center text-lg">
                            You have no friend requests.
                        </p>
                        <button
                            onClick={() => router.push("/searchfriends")}
                            className="hover:cursor-pointer px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700
            transition text-white font-medium shadow-lg"
                        >
                            Find Friends
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-gray-900/80 backdrop-blur-lg border border-gray-800
              text-white p-5 rounded-2xl shadow-lg flex justify-between items-center
              transition hover:scale-[1.02]"
                            >
                                <div>
                                    <p className="font-semibold text-lg">
                                        {req.from.username}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {req.from.email}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => acceptRequest(req.from.id)}
                                        className="hover:cursor-pointer px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 
                  transition shadow text-white font-medium"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => rejectRequest(req.from.id)}
                                        className="hover:cursor-pointer px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 
                  transition shadow text-white font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>}
        </div>
    );
};

export default FriendRequests;
