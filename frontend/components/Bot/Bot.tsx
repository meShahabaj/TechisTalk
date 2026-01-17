"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface props {
    botname: string
}

export default function Bot({ botname }: props) {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [input, setInput] = useState("");

    const router = useRouter()

    const sendMessage = async () => {
        if (!input) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        const res = await fetch("/api/bot", {
            method: "POST",
            body: JSON.stringify({ messages: newMessages, botname: botname }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-3xl h-[90vh] bg-zinc-900 rounded-2xl shadow-xl flex flex-col">
                <div className="flex border-b border-white/10">

                    {/* Header */}
                    <div className="p-4  text-white font-semibold text-lg">
                        🤖 {botname} Buddy
                    </div>
                    <button className="mr-8 text-xl ml-auto text-white hover:cursor-pointer"
                        onClick={() => router.push("/bots")}> ❌ </button>
                </div>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow
                ${msg.role === "user"
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-zinc-800 text-white/90 rounded-bl-none border-l-4 border-purple-500"
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Box */}
                <div className="p-4 border-t border-white/10 flex gap-3">
                    <input
                        className="flex-1 bg-zinc-800 text-white p-3 rounded-xl outline-none placeholder-white/40"
                        placeholder={`Talk to ${botname}...`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600
                     text-white rounded-xl font-semibold hover:scale-105 transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}