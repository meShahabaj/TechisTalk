import { useEffect, useState } from "react";
import axios from "axios";

const NotificationPage = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        try {
            const res = await axios.get("http://localhost:5000/users/requests", {
                withCredentials: true,
            });
            setRequests(res.data.requests);

        } catch (err) {
            console.error("Failed to load friend requests");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const acceptRequest = async (fromUserId: string) => {
        try {
            await axios.post(
                "http://localhost:5000/users/accept",
                { fromUserId },
                { withCredentials: true }
            );
            loadRequests();
        } catch (err) {
            console.error("Failed to accept request");
        }
    };

    const rejectRequest = async (fromUserId: string) => {
        try {
            await axios.post(
                "http://localhost:5000/users/reject",
                { fromUserId },
                { withCredentials: true }
            );
            loadRequests();
        } catch (err) {
            console.error("Failed to reject request");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Friend Requests</h1>

            {requests.length === 0 ? (
                <p className="text-gray-500">No friend requests.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-xl">
                                        {req.from.username[0].toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-semibold text-lg">
                                        {req.from.username}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {req.from.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => acceptRequest(req.from._id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() => rejectRequest(req.from._id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;
