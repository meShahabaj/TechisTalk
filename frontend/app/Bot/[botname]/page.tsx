import Bot from "@/components/Bot/Bot";

interface PageProps {
    params: Promise<{ botname: string }>;
}

const page = async ({ params }: PageProps) => {
    const { botname } = await params;

    return <Bot botname={botname} />;
};

export default page;
