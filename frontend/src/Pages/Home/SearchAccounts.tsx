import { useEffect, useState } from "react";
import axios from "axios";
import { useAppSelector } from "../../Redux/useAppSelector.tsx";

const SearchAccounts = () => {
    const BACKEND_API = process.env.REACT_APP_BACKEND_API
    const fromUserId = useAppSelector(state => state.auth.auth?.id);

    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await axios.get(`${BACKEND_API}/accounts/all`, {
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
                `${BACKEND_API}/friend-request/send`,
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
        <div className="">
            <div className="max-w-3xl mx-auto">

                <h2 className="text-3xl font-bold mb-6 text-white">
                    Find Friends
                </h2>

                {/* SEARCH BAR */}
                <div className="bg-gray-900/80 backdrop-blur-lg p-5 rounded-2xl shadow-xl border border-gray-700 mb-6">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3 rounded-xl bg-gray-800 text-gray-200 
                           border border-gray-700 focus:ring-2 focus:ring-blue-500 
                           outline-none"
                    />
                </div>

                {/* USERS LIST */}
                <div className="flex flex-col gap-4">
                    {filteredUsers.map((u) => (
                        <div
                            key={u._id}
                            className="bg-gray-900/80 backdrop-blur-lg p-5 rounded-2xl 
                               border border-gray-700 shadow flex items-center 
                               justify-between"
                        >
                            <div>
                                <p className="text-white font-semibold text-lg">
                                    {u.username}
                                </p>
                                <p className="text-gray-400 text-sm">{u.email}</p>
                            </div>

                            {u._id !== fromUserId ? (
                                <button
                                    onClick={() => sendRequest(u._id)}
                                    className="px-5 py-2 rounded-xl bg-blue-600 text-white 
                                       hover:bg-blue-700 transition shadow"
                                >
                                    Talk
                                </button>
                            ) : (
                                <span className="text-gray-500 text-sm">You</span>
                            )}
                        </div>
                    ))}

                    {filteredUsers.length === 0 && (
                        <p className="text-gray-400 text-center mt-6">No users found.</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default SearchAccounts;
