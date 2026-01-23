"use client"; // Client-side only

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import EmojiPicker from 'emoji-picker-react';

const BACKEND_API = process.env.BACKEND_API;

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

    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (emojiData: any) => {
        setInput(prev => prev + emojiData.emoji);
    };

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
            const res = await axios.get(`${BACKEND_API}/load`, {
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

    if (!authChecked) return <div><Loading /></div>;
    if (!user) return null;

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 dark:from-[#0b0e13] dark:via-[#0b0e13] dark:to-[#0b0e13]">
            {/* HEADER */}
            <div className="sticky top-0 z-10 px-4 py-3 bg-white/95 dark:bg-[#0f1218]/95 backdrop-blur-xl shadow-sm border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold shadow-md">
                        {toUser?.username?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">{toUser?.username || "User"}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {typing ? "Typing…" : status === "online" ? "Online" : "Offline"}
                        </div>
                    </div>
                </div>
            </div>

            {/* MESSAGES */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scroll-smooth"
            >
                {messages.map((m, idx) => {
                    const isMe = m.from === user.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`
              max-w-[72%] px-4 py-2 text-[20px] leading-relaxed
              rounded-2xl shadow transition-all duration-200
              ${isMe
                                        ? "text-white rounded-br-lg"
                                        : "bg-white dark:bg-[#151922] text-gray-900 dark:text-gray-100 rounded-bl-lg"}
            `}
                            >
                                <div className="break-words">{m.text}</div>
                                <div className={`text-[10px] mt-1 text-right ${isMe ? "text-indigo-100" : "text-gray-400"}`}>
                                    {formatTime(m.timestamp)}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {typing && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white/90 dark:bg-[#151922] shadow-sm">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:150ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="sticky bottom-0 px-4 py-3 bg-white/95 dark:bg-[#0f1218]/95 backdrop-blur-xl shadow-t border-t border-black/5 dark:border-white/5 flex items-center gap-3">
                <button
                    onClick={() => setShowPicker(prev => !prev)}
                    className="hover:cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                    😊
                </button>

                {showPicker && (
                    <div className="absolute bottom-14 left-0 z-50">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
                <input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="
        flex-1 px-5 py-3 rounded-full
        bg-gray-100 dark:bg-[#151922]
        text-sm text-gray-900 dark:text-gray-100
        placeholder:text-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500
        transition
      "
                />
                <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="
        w-12 h-12 rounded-full
        bg-gradient-to-br from-indigo-500 to-violet-500
        hover:scale-105 active:scale-95
        disabled:opacity-50
        text-white shadow-md
        flex items-center justify-center
        transition-transform hover:cursor-pointer
      "
                >
                    ➤
                </button>
            </div>
        </div>

    );
};

export default Chat;
