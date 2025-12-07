import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const deleteAccount = async () => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;

        try {
            await axios.delete("http://localhost:5000/auth/delete", {
                withCredentials: true,
            });

            alert("Your account has been deleted.");
            navigate("/signup"); // or homepage
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete account");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:5000/auth/logout", {}, {
                withCredentials: true
            });
            // Redirect to login
            navigate("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="dashboard">
            <h1>Welcome to your dashboard!</h1>
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
