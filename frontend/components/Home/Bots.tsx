"use client";
import { useRouter } from "next/navigation";

const bots = [
    { name: "Python", desc: "I’m simple, smart, and love indentation 🐍" },
    { name: "CPP", desc: "I’m fast, powerful, and a little dangerous ⚡" },
    { name: "Java", desc: "I’m strict, stable, and drink a lot of coffee ☕" },
    { name: "JavaScript", desc: "I’m async, chaotic, and everywhere 😎" },
    { name: "C", desc: "I’m old-school, tiny, and close to the metal 🔧" },
    { name: "Rust", desc: "I’m safe, modern, and hate bugs 🦀" },
];

export default function Bots() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h1 className="text-white text-2xl font-bold mb-12 text-center">
                    🤖 Choose Your Coding Buddy
                </h1>

                <div className="grid grid-cols-2 gap-8">
                    {bots.map((bot) => (
                        <div key={bot.name} className="relative group">
                            <button
                                onClick={() => router.push(`/Bot/${bot.name}`)}
                                className="w-full py-3 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  hover:scale-105 transition-all duration-200 shadow-md
                  hover:cursor-pointer"
                            >
                                {bot.name}
                            </button>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100
                transition-all duration-200 pointer-events-none
                bg-black text-white text-xs px-3 py-2 rounded-lg shadow-lg
                whitespace-nowrap">
                                {bot.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
