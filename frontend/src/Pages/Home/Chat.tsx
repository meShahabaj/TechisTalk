import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../Redux/useAppSelector.tsx";
import { useParams } from "react-router-dom";
import axios from "axios"
const BACKEND_API = process.env.REACT_APP_BACKEND_API

interface Message {
    from?: string;
    text: string;
    timestamp: number;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("offline"); // online/offline
    const [typing, setTyping] = useState(false); // other user typing
    const [isTyping, setIsTyping] = useState(false); // YOU typing
    const [toUser, setToUser] = useState<{ username: string } | null>(null);


    const socket = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const { toid } = useParams();
    const user = useAppSelector((state) => state.auth.auth);

    // Auto scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);
    useEffect(() => {
        if (!toid) return;

        const loadUser = async () => {
            try {
                const res = await axios.get(
                    `${BACKEND_API}/accounts/findById/${toid}`,
                    { withCredentials: true }
                );
                setToUser(res.data.user);
            } catch (err) {
                console.error("Failed to load user", err);
            }
        };

        loadUser();
    }, [toid]);


    // WebSocket connection
    useEffect(() => {
        if (!user?.id) return;

        const ws = new WebSocket(
            // `ws://localhost:5000/chat-socket?userId=${user.id}`
            `${BACKEND_API}/chat-socket?userId=${user.id}`
        );
        socket.current = ws;

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                // online/offline updates
                if (data.type === "status") {
                    setStatus(data.status);
                    return;
                }

                // message received
                if (data.type === "message") {
                    if (data.from === user.id) return;
                    setMessages((prev) => [...prev, data]);
                    return;
                }

                // typing start
                if (data.type === "typing" && data.from === toid) {
                    setTyping(true);
                    return;
                }

                // typing stop
                if (data.type === "stop_typing" && data.from === toid) {
                    setTyping(false);
                    return;
                }

            } catch (e) {
                console.error("Invalid WS data", event.data);
            }
        };

        return () => ws.close();
    }, [user?.id]);

    // Handle typing
    const handleTyping = (text: string) => {
        setInput(text);
        if (!socket.current) return;

        // Send "typing" once
        if (!isTyping) {
            setIsTyping(true);
            socket.current.send(
                JSON.stringify({ type: "typing", to: toid })
            );
        }

        // Reset timeout
        if (typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.current?.send(
                JSON.stringify({ type: "stop_typing", to: toid })
            );
        }, 1500);
    };

    // Send message
    const sendMessage = () => {
        if (!input.trim() || !socket.current) return;

        const msg = {
            to: toid,
            text: input,
            timestamp: Date.now()
        };

        socket.current.send(JSON.stringify(msg));

        // local preview
        setMessages((prev) => [...prev, { from: user.id, text: input, timestamp: Date.now() }]);
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


    return (
        <div className="flex flex-col h-screen
                  bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200
                  dark:from-[#0b0e13] dark:via-[#0b0e13] dark:to-[#0b0e13]">

            {/* HEADER */}
            <div className="sticky top-0 z-10
                    px-4 py-3
                    bg-white/70 dark:bg-[#0f1218]/80
                    backdrop-blur-xl
                    border-b border-black/5 dark:border-white/5">

                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full
                        bg-gradient-to-br from-indigo-500 to-violet-500
                        flex items-center justify-center
                        text-white font-bold shadow">
                        {toUser?.username?.[0]?.toUpperCase()}
                    </div>

                    {/* Name + Status */}
                    <div className="flex flex-col">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white">
                            {toUser?.username || "User"}
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {typing
                                ? "Typing…"
                                : status === "online"
                                    ? "Online"
                                    : "Offline"}
                        </div>
                    </div>
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((m, idx) => {
                    const isMe = m.from === user.id;

                    return (
                        <div
                            key={idx}
                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] px-4 py-2.5 text-sm
                          rounded-2xl shadow-sm
                          ${isMe
                                        ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-br-md"
                                        : "bg-white/90 dark:bg-[#151922] text-gray-900 dark:text-gray-100 rounded-bl-md"
                                    }`}
                            >
                                <div className="break-words leading-relaxed">
                                    {m.text}
                                </div>

                                <div
                                    className={`text-[10px] mt-1 text-right
                            ${isMe ? "text-indigo-100" : "text-gray-400"}`}
                                >
                                    {formatTime(m.timestamp)}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Indicator */}
                {typing && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-1 px-4 py-2 rounded-2xl
                          bg-white/90 dark:bg-[#151922]
                          shadow-sm">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="sticky bottom-0
                    px-3 py-2
                    bg-white/80 dark:bg-[#0f1218]/90
                    backdrop-blur-xl
                    border-t border-black/5 dark:border-white/5
                    flex items-center gap-2">

                <input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message..."
                    className="flex-1 px-4 py-2.5 rounded-full
                   bg-gray-100 dark:bg-[#151922]
                   text-gray-900 dark:text-gray-100
                   placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="w-11 h-11 rounded-full
                   bg-gradient-to-br from-indigo-500 to-violet-500
                   hover:opacity-90
                   disabled:opacity-50
                   text-white shadow
                   flex items-center justify-center"
                >
                    ➤
                </button>
            </div>
        </div>
    );

};

export default Chat;
