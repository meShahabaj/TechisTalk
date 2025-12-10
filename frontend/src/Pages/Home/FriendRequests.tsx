import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const FriendRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        try {
            const res = await axios.get(`${BACKEND_API}/user/requests`, {
                withCredentials: true,
            });
            setRequests(res.data.requests);
            console.log(res.data.requests)
        } catch {
            console.error("Failed to load requests");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const acceptRequest = async (fromUserId: string) => {
        await axios.post(
            `${BACKEND_API}/user/accept`,
            { fromUserId },
            { withCredentials: true }
        );
        loadRequests();
    };

    const rejectRequest = async (fromUserId: string) => {
        await axios.post(
            `${BACKEND_API}/user/reject`,
            { fromUserId },
            { withCredentials: true }
        );
        loadRequests();
    };

    /* ---------------- LOADING SKELETON ---------------- */
    if (loading) {
        return (
            <div className="p-10 ml-0 md:ml-64">
                <div className="max-w-xl mx-auto space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-20 bg-gray-900/60 rounded-2xl border border-gray-800 animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="max-w-xl mx-auto">

                <h1 className="text-3xl font-bold text-white mb-6">
                    Friend Requests
                </h1>

                {requests.length === 0 ? (
                    <p className="text-gray-400">No friend requests.</p>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="bg-gray-900/80 backdrop-blur-lg border border-gray-800
                                           text-white p-5 rounded-2xl shadow flex justify-between items-center"
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
                                        className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 
                                                   transition shadow text-white"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => rejectRequest(req.from._id)}
                                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 
                                                   transition shadow text-white"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendRequests;
