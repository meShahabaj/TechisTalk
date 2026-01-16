// app/chat/[toid]/page.tsx
import Chat from "@/components/Home/Chat";

interface PageProps {
    params: Promise<{ toid: string }>;
}

const page = async ({ params }: PageProps) => {
    const { toid } = await params;

    return <Chat toid={toid} />;
};

export default page;
