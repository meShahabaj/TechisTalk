import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
    fromUserId: string; // sender id coming from Home.tsx
}

const FindFriends = ({ fromUserId }: Props) => {
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/users/all", {
                    withCredentials: true,
                });
                setUsers(res.data.users);
            } catch (err) {
                console.error(err);
            }
        };

        loadUsers();
    }, []);

    const sendRequest = async (toUserId: string) => {
        try {
            await axios.post(
                "http://localhost:5000/users/send",
                { fromUserId, toUserId },
                { withCredentials: true }
            );
            alert("Friend request sent!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to send request");
        }
    };

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="mt-6 p-4 border rounded shadow bg-white">
            <h2 className="text-lg font-bold mb-3">Find Friends</h2>

            <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-full mb-4"
            />

            <div className="flex flex-col gap-3">
                {filteredUsers.map((u) => (
                    <div
                        key={u._id}
                        className="flex items-center justify-between border p-3 rounded"
                    >
                        <div>
                            <p className="font-semibold">{u.username}</p>
                            <p className="text-sm text-gray-600">{u.email}</p>
                        </div>

                        {u._id !== fromUserId ? (
                            <button
                                onClick={() => sendRequest(u._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Talk
                            </button>
                        ) : (
                            <span className="text-gray-500 text-sm">You</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FindFriends;
