import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../Redux/useAppSelector.tsx";
import { useParams } from "react-router-dom";

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

    // WebSocket connection
    useEffect(() => {
        if (!user?.id) return;

        const ws = new WebSocket(
            `ws://localhost:5000/chat-socket?userId=${user.id}`
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

    return (
        <div className="flex flex-col h-screen bg-gray-100">

            {/* HEADER */}
            <div className="p-4 bg-blue-600 text-white shadow">
                <div className="font-bold text-lg">Chat with {toid}</div>

                {/* Status + typing */}
                <div className="text-sm text-blue-200">
                    {typing
                        ? "Typing..."
                        : status === "online"
                            ? "Online"
                            : "Offline"}
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`flex ${m.from === user.id ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-2xl shadow 
                            ${m.from === user.id ? "bg-green-500 text-white" : "bg-white"}`}
                        >
                            <div>{m.text}</div>
                            <div className="text-[10px] text-gray-600 mt-1 text-right">
                                {formatTime(m.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}

                <div ref={messagesEndRef}></div>
            </div>

            {/* INPUT */}
            <div className="p-4 bg-white flex gap-2 shadow">
                <input
                    value={input}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
