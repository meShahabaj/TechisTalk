import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../AppUtils/Loading.tsx";
import { useNavigate } from "react-router-dom";

const Friends = () => {
    const navigate = useNavigate();
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFriends = async () => {
        try {
            const res = await axios.get(`${BACKEND_API}/friend/get`, {
                withCredentials: true,
            });
            setFriends(res.data.friends);
        } catch {
            console.error("Failed to load friends");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadFriends();
    }, []);

    const removeFriend = async (friendId: string) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;

        try {
            await axios.post(
                `${BACKEND_API}/friend/remove`,
                { friendId },
                { withCredentials: true }
            );
            loadFriends();
        } catch (err) {
            console.error("Failed to remove friend");
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white">Your Friends</h1>

            {friends.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-4 mt-20">
                    <p className="text-gray-400 text-center text-lg">
                        You have no friends yet.
                    </p>
                    <button
                        onClick={() => navigate("/search-friends")}
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
                                    <p className="font-semibold text-white">{friend.username}</p>
                                    <p className="text-gray-400 text-sm">{friend.email}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/chat/${friend.id}`)}
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
};

export default Friends;
