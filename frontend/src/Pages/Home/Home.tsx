import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../Redux/useAppSelector.tsx";
import axios from "axios";
import { useState } from "react";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const Home = () => {
    const location = useLocation();
    const user = useAppSelector((state) => state.auth.auth);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);
            await axios.post(`${BACKEND_API}/auth/logout`, {}, { withCredentials: true });
            window.location.reload()
        } catch {
            alert("Logout failed.");
        } finally {
            setLoading(false);
        }
    };



    const navItems = [
        { label: "Friend Requests", path: "#/friend-requests" },
        { label: "Search Friends", path: "#/search-friends" },
        { label: "Your Friends", path: "#/friends" },
        { label: "Profile", path: "#/profile" },
    ];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-[#0b0e13] dark:via-[#0b0e13] dark:to-[#0b0e13]">

            {/* FLOATING SIDE NAV */}
            <aside className="w-72 h-[95%] m-4 rounded-3xl border border-white/20 dark:border-white/10 
                             bg-white/40 dark:bg-white/5 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)]
                             flex flex-col gap-6 p-6 fixed">

                {/* HEADER LOGO */}
                <div className="flex items-center justify-between">
                    <h2 className="text-[28px] font-extrabold tracking-tight bg-gradient-to-r 
                                   from-indigo-500 to-purple-500 text-transparent bg-clip-text">
                        TechTalk
                    </h2>
                </div>

                {/* USER CARD */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/60 dark:bg-white/10 shadow-sm">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 
                                        flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>

                        {/* online dot */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white"></span>
                    </div>

                    <div className="flex flex-col">
                        <p className="font-semibold">{user?.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav className="flex flex-col gap-1 mt-2">
                    {navItems.map((item) => {
                        const active = location.pathname.includes(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative px-4 py-3 rounded-xl transition font-medium
                                            hover:bg-white/30 dark:hover:bg-white/10
                                            ${active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"}`}
                            >
                                {item.label}

                                {/* ACTIVE INDICATOR — animated */}
                                {active && (
                                    <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-xl"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* ACTION BUTTONS */}
                <div className="mt-auto flex flex-col gap-3">
                    <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="py-2.5 rounded-xl font-medium bg-red-500 text-white 
                                   hover:bg-red-600 transition disabled:opacity-50"
                    >
                        {loading ? "…" : "Logout"}
                    </button>


                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-10 ml-80 overflow-auto">
                <div className="max-w-4xl mx-auto">


                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Home;
