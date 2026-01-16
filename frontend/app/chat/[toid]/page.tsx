// app/chat/[toid]/page.tsx
import Chat from "@/components/Home/Chat";

interface PageProps {
    params: Promise<{ toid: string }>;
}

const ChatPage = async ({ params }: PageProps) => {
    const { toid } = await params;

    return <Chat toid={toid} />;
};

export default ChatPage;
