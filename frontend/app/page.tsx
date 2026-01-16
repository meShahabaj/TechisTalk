import { redirect } from "next/navigation";

export default function Home() {
    redirect("/profile");
    return <div></div>;
}
