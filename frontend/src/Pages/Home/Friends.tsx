import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../../AppUtils/Loading.tsx"

const Friends = () => {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API;
    const [friends, setfriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFriends = async () => {
        try {
            const res = await axios.get(`${BACKEND_API}/user/friends`, {
                withCredentials: true,
            });
            setfriends(res.data.friends);
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
                `${BACKEND_API}/users/remove-friend`,
                { friendId },
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Failed to remove friend");
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Your Friends</h1>

            {friends.length === 0 ? (
                <p className="text-gray-500">You have no friends yet.</p>
            ) : (
                <div className="space-y-4">
                    {friends.map((friend) => (
                        <div
                            key={friend}
                            className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
                        >
                            <div className="flex items-center gap-3">

                                <div>
                                    <p className="font-semibold text-lg">{friend.username}</p>

                                </div>
                                <div>
                                    <p className="font-semibold text-lg">{friend.email}</p>

                                </div>

                                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                    Talk
                                </button>

                                <button
                                    onClick={() => removeFriend(friend.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}


                </div>
            )}</div>
    )
};

export default Friends;
