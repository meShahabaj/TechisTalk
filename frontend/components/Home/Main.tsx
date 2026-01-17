"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, ReactElement } from "react";

import SearchFriends from "./SearchFriends";
import Profile from "./Profile";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";
import Loading from "../Loading";
import Bots from "./Bots";

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
    "/searchfriends": SearchFriends,

    "/friendrequests": FriendRequests,
    "/friends": Friends, "/profile": Profile,
    "/bots": Bots
};

const navItems: NavItem[] = [
    { label: "Search Friends", path: "/searchfriends" },

    { label: "Friend Requests", path: "/friendrequests" },

    { label: "Friends", path: "/friends" },
    {
        label: "Talk To Programming Languages", path:
            "/bots"
    }, { label: "Profile", path: "/profile" },

];

/* =======================
   MAIN COMPONENT
======================= */

const Main = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);


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

    if (!authChecked) return <div><Loading /></div>;
    if (!user) return null;
    /* =======================
       RENDER
    ======================= */

    const Page = pageMap[pathname];

    return (
        <div className="flex h-screen bg-black">
            {/* SIDEBAR */}
            {/* MOBILE TOP BAR */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 
  flex items-center justify-between px-5 py-3
  bg-white/60 dark:bg-[#0b0e13]/70 backdrop-blur-2xl 
  border-b border-black/10 dark:border-white/5 shadow-sm">

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl 
    bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 
    transition text-xl text-gray-800 dark:text-white"
                >
                    {!menuOpen && "☰"}
                </button>

                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                    Techis Talk
                </h2>

                {/* spacer for balance */}
                <div className="w-10" />
            </div>




            <aside
                className={`w-72 h-[95%]
  bg-black h-full border-r-1 border-white/30
  flex flex-1 flex-col gap-6 p-6 fixed z-40 transition-transform duration-300

  ${menuOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0`}
            >
                {menuOpen && (
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="absolute top-4 right-4 md:hidden
    w-9 h-9 rounded-xl flex items-center justify-center
    bg-black/10 dark:bg-white/10
    hover:bg-black/20 dark:hover:bg-white/20
    transition text-lg text-gray-800 dark:text-white"
                    >
                        ✕
                    </button>
                )}



                {/* LOGO */}
                <h2
                    className="text-3xl font-extrabold tracking-tight text-white"
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
                                onClick={() => setMenuOpen(false)}
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


            </aside>

            {/* MAIN CONTENT */}
            <main className="p-6 flex-1 md:ml-80 pt-16 md:pt-0 overflow-auto bg-black">

                <div className="max-w-4xl mx-auto">
                    {Page ? <Page user={user} /> : <div>Page Not Found</div>}
                </div>
            </main>
        </div>
    );
};

export default Main;
