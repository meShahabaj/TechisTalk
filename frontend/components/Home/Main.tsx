"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, ReactElement } from "react";

import SearchFriends from "./SearchFriends";
import Profile from "./Profile";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";

/* =======================
   TYPES
======================= */

interface User {
    id: string;
    username: string;
    email?: string;
    friends: string[];
    friendRequests: string[];
}

interface NavItem {
    label: string;
    path: string;
}

type PageProps = {
    user: User;
};

type PageComponent = (props: PageProps) => ReactElement;

/* =======================
   PAGE MAP
======================= */

const pageMap: Record<string, PageComponent> = {
    "/home/searchfriends": SearchFriends,
    "/home/profile": Profile,
    "/home/friendrequests": FriendRequests,
    "/home/friends": Friends
};

const navItems: NavItem[] = [
    { label: "Search Friends", path: "/home/searchfriends" },
    { label: "Profile", path: "/home/profile" },
    { label: "Friend Requests", path: "/home/friendrequests" },
    { label: "Friends", path: "/home/friends" }
];

/* =======================
   MAIN COMPONENT
======================= */

const Main = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    /* =======================
       FETCH AUTH USER
    ======================= */

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/loggeduserdata", {
                    method: "POST",
                    credentials: "include",
                });

                const data = await res.json();

                if (!data?.auth) {
                    router.push("/login");
                    return;
                }

                setUser(data.user as User);
            } catch (error) {
                console.error("Auth fetch error:", error);
                router.push("/login");
            } finally {
                setAuthChecked(true);
            }
        };

        fetchUser();
    }, [router]);

    if (!authChecked) return <div>Loading...</div>;
    if (!user) return null;

    /* =======================
       LOGOUT
    ======================= */

    const handleLogout = async () => {
        try {
            setLoading(true);
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
            router.refresh();
            router.push("/login");
        } catch {
            alert("Logout failed.");
        } finally {
            setLoading(false);
        }
    };

    /* =======================
       RENDER
    ======================= */

    const Page = pageMap[pathname];

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0f1115] dark:via-[#0b0e13] dark:to-[#0b0e13]">
            {/* SIDEBAR */}
            <aside
                className="w-72 h-[95%] m-4 rounded-3xl border border-white/20 dark:border-white/10
        bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl shadow-xl
        flex flex-col gap-6 p-6 fixed"
            >
                {/* LOGO */}
                <h2
                    className="text-2xl font-extrabold tracking-tight
          bg-gradient-to-r from-indigo-500 to-purple-500
          text-transparent bg-clip-text"
                >
                    Techis Talk
                </h2>

                {/* USER CARD */}
                <div
                    className="flex items-center gap-3 p-4 rounded-2xl
          bg-white/60 dark:bg-gray-800/40 shadow-sm"
                >
                    <div
                        className="w-12 h-12 rounded-xl bg-gradient-to-br
            from-indigo-400 to-purple-500 flex items-center
            justify-center text-white font-bold text-lg"
                    >
                        {user.username[0].toUpperCase()}
                    </div>

                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                            {user.username}
                        </p>
                        <p className="text-sm text-green-500">Online</p>
                    </div>
                </div>

                {/* NAV */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const active = pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`relative px-4 py-3 rounded-xl font-medium transition
                hover:bg-white/30 dark:hover:bg-gray-700/50
                ${active
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                {item.label}
                                {active && (
                                    <span
                                        className="absolute left-0 top-0 h-full w-1
                    bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-xl"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* LOGOUT */}
                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="mt-auto py-2.5 rounded-xl font-medium bg-red-500
          text-white hover:bg-red-600 transition disabled:opacity-50"
                >
                    {loading ? "…" : "Logout"}
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-80 overflow-auto bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto">
                    {Page ? <Page user={user} /> : <div>Page Not Found</div>}
                </div>
            </main>
        </div>
    );
};

export default Main;
