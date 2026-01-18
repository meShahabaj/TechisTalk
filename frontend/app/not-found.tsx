"use client";

import DotsBackground from "@/components/DotBackground";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NotFoundPage = () => {
    const router = useRouter();
    const [language, setLanguage] = useState("JavaScript");

    const handleChatClick = () => {
        router.push(`/chat?lang=${language}`);
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 relative">
            <div className="text-center space-y-6 z-10 relative">
                <h1 className="text-8xl font-extrabold tracking-wide text-indigo-500 animate-pulse">
                    404
                </h1>
                <p className="text-xl md:text-2xl text-gray-300">
                    Oops! Looks like this page went into the void…
                </p>

                <pre className="bg-gray-800 rounded-lg p-6 text-left font-mono text-sm md:text-base text-green-400 shadow-lg">
                    {`// console.log("Page not found");
function findPage() {
    try {
        return "/your-page";
    } catch (error) {
        console.error("404 - Page missing");
    }
}`}
                </pre>

                <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none"
                    >
                        <option >JavaScript</option>
                        <option>Python</option>
                        <option>Java</option>
                        <option>Go</option>
                        <option>Rust</option>
                    </select>

                    <button
                        onClick={handleChatClick}
                        className="hover:cursor-pointer px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition-shadow shadow-lg"
                    >
                        Chat with {language}
                    </button>
                </div>

                <button
                    onClick={() => router.push("/")}
                    className="hover:cursor-pointer mt-6 text-indigo-400 hover:text-indigo-600 underline font-medium"
                >
                    Go back home
                </button>
            </div>
            <DotsBackground />
        </div>
    );
};

export default NotFoundPage;
