import { useEffect, useState } from "react";
import axios from "axios";


const FriendListPage = () => {
    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const removeFriend = async (friendId: string) => {
        if (!window.confirm("Are you sure you want to remove this friend?")) return;

        try {
            await axios.post(
                "http://localhost:5000/users/remove-friend",
                { friendId },
                { withCredentials: true }
            );

            loadFriends(); // Reload updated list
        } catch (err) {
            console.error("Failed to remove friend");
        }
    };


    const loadFriends = async () => {
        try {
            const res = await axios.get("http://localhost:5000/users/friends", {
                withCredentials: true,
            });
            console.log(res.data)
            setFriends(res.data.friends);
        } catch (err) {
            console.error("Failed to load friends");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadFriends();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Your Friends</h1>

            {friends.length === 0 ? (
                <p className="text-gray-500">You have no friends yet.</p>
            ) : (
                <div className="space-y-4">
                    {friends.map((friend) => (
                        <div
                            key={friend._id}
                            className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-xl">
                                        {friend.username[0].toUpperCase()}
                                    </span>
                                </div>

                                <div>
                                    <p className="font-semibold text-lg">{friend.username}</p>
                                    <p className="text-sm text-gray-500">{friend.email}</p>
                                </div>
                            </div>

                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Talk
                            </button>
                            <button
                                onClick={() => removeFriend(friend._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendListPage;
