"use client"; // Client-side only

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API;

interface User {
    id: string;
    username: string;
    email?: string;
    friends: string[];
    friendRequests: string[];
}

interface Message {
    from?: string;
    text: string;
    timestamp: number;
}

interface ChatProps {
    toid: string; // comes from page params
}

const PAGE_SIZE = 20; // Number of messages per load

const Chat = ({ toid }: ChatProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("offline"); // online/offline
    const [typing, setTyping] = useState(false); // other user typing
    const [isTyping, setIsTyping] = useState(false); // YOU typing
    const [toUser, setToUser] = useState<{ username: string } | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [hasMore, setHasMore] = useState(true); // for pagination

    const socket = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const oldestTimestampRef = useRef<number | null>(null);

    const router = useRouter();

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
            } catch {
                router.push("/login");
            } finally {
                setAuthChecked(true);
            }
        };
        fetchUser();
    }, [router]);

    /* =======================
       LOAD RECIPIENT
    ======================= */
    useEffect(() => {
        if (!toid) return;

        const loadUser = async () => {
            const res = await axios.post("/api/user/findbyid", { id: toid });
            setToUser(res.data.user);
        };

        loadUser();
    }, [toid]);

    /* =======================
       WEBSOCKET CONNECTION
    ======================= */
    useEffect(() => {
        if (!user?.id || !toid) return;

        const ws = new WebSocket(`${BACKEND_API}/chat-socket?userId=${user.id}`);
        socket.current = ws;

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "status") {
                    setStatus(data.status);
                    return;
                }

                if (data.type === "message") {
                    if (data.from === user.id) return; // ignore own messages
                    setMessages((prev) => [...prev, data]);
                }

                if (data.type === "typing" && data.from === toid) setTyping(true);
                if (data.type === "stop_typing" && data.from === toid) setTyping(false);

            } catch (e) {
                console.error("Invalid WS data", event.data);
            }
        };

        return () => ws.close();
    }, [user?.id, toid]);

    /* =======================
       LOAD MESSAGES (with pagination)
    ======================= */
    const loadMessages = async (before?: number) => {
        if (!user?.id || !toid || !hasMore) return;

        try {
            const res = await axios.get(`${BACKEND_API}`, {
                params: {
                    user1: user.id,
                    user2: toid,
                    before,
                    limit: PAGE_SIZE
                },
                withCredentials: true,
            });

            const newMessages: Message[] = res.data.messages || [];
            if (newMessages.length < PAGE_SIZE) setHasMore(false);
            if (newMessages.length > 0) oldestTimestampRef.current = newMessages[0].timestamp;

            // prepend older messages
            setMessages((prev) => [...newMessages, ...prev]);
        } catch (err) {
            console.error("Failed to load messages", err);
        }
    };

    // Initial load
    useEffect(() => {
        if (!user?.id || !toid) return;
        loadMessages();
    }, [user?.id, toid]);

    /* =======================
       SCROLL UP TO LOAD OLDER
    ======================= */
    const handleScroll = () => {
        if (!scrollContainerRef.current || !hasMore) return;

        if (scrollContainerRef.current.scrollTop === 0) {
            loadMessages(oldestTimestampRef.current || undefined);
        }
    };

    /* =======================
       AUTO SCROLL TO BOTTOM
    ======================= */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    /* =======================
       TYPING LOGIC
    ======================= */
    const handleTyping = (text: string) => {
        setInput(text);
        if (!socket.current) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.current.send(JSON.stringify({ type: "typing", to: toid }));
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.current?.send(JSON.stringify({ type: "stop_typing", to: toid }));
        }, 1500);
    };

    /* =======================
       SEND MESSAGE
    ======================= */
    const sendMessage = () => {
        if (!input.trim() || !socket.current || !user) return;

        const msg: Message = {
            from: user.id,
            text: input,
            timestamp: Date.now(),
        };

        socket.current.send(JSON.stringify({ ...msg, to: toid, type: "message" }));

        setMessages((prev) => [...prev, msg]);
        setInput("");
    };

    const formatTime = (ts: number) =>
        new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!authChecked) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-[#0b0e13] dark:via-[#0b0e13] dark:to-[#0b0e13]">
            {/* HEADER */}
            <div className="sticky top-0 z-10 px-4 py-3 bg-white/70 dark:bg-[#0f1218]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow">
                        {toUser?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{toUser?.username || "User"}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{typing ? "Typing…" : status === "online" ? "Online" : "Offline"}</div>
                    </div>
                </div>
            </div>

            {/* MESSAGES */}
            <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                onScroll={handleScroll}
            >
                {messages.map((m, idx) => {
                    const isMe = m.from === user.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[75%] px-4 py-2.5 text-sm rounded-2xl shadow-sm ${isMe ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-br-md" : "bg-white/90 dark:bg-[#151922] text-gray-900 dark:text-gray-100 rounded-bl-md"}`}>
                                <div className="break-words leading-relaxed">{m.text}</div>
                                <div className={`text-[10px] mt-1 text-right ${isMe ? "text-indigo-100" : "text-gray-400"}`}>
                                    {formatTime(m.timestamp)}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {typing && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white/90 dark:bg-[#151922] shadow-sm">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="sticky bottom-0 px-3 py-2 bg-white/80 dark:bg-[#0f1218]/90 backdrop-blur-xl border-t border-black/5 dark:border-white/5 flex items-center gap-2">
                <input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message..."
                    className="flex-1 px-4 py-2.5 rounded-full bg-gray-100 dark:bg-[#151922] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 hover:opacity-90 disabled:opacity-50 text-white shadow flex items-center justify-center"
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default Chat;
