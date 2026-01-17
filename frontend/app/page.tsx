import { redirect } from "next/navigation";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API

export default async function Home() {
    await fetch(`${BACKEND_API}/wakeup`, {
        cache: "no-store",
    });
    redirect("/profile");
    return <div></div>;
}
