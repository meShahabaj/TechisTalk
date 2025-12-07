import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FindFriends from "./FindFriends.tsx";
import NotificationPage from "./NotificationPage.tsx";
import FriendListPage from "./FriendListPage.tsx";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await axios.get("http://localhost:5000/auth/checkAuth", {
                    withCredentials: true,
                });
                setUser(res.data.user);
            } catch {
                navigate("/login");
            }
        };

        loadUser();
    }, []);

    const deleteAccount = async () => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        try {
            await axios.delete("http://localhost:5000/auth/delete", {
                withCredentials: true,
            });

            alert("Your account has been deleted.");
            navigate("/signup");
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete account");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/auth/logout",
                {},
                { withCredentials: true }
            );
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="dashboard">
            <NotificationPage />
            <h1>Welcome, {user.username}</h1>

            <FindFriends fromUserId={user._id} />
            <FriendListPage />

            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Logout
            </button>

            <button
                onClick={deleteAccount}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
                Delete My Account
            </button>
        </div>
    );
};

export default Home;
