"use client";

import { useEffect } from "react";

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API
export default function Wakeup() {
    useEffect(() => {
        async function run() {
            await fetch(`${BACKEND_API}/wakeup`, {
                cache: "no-store",
            })
        }
    }, []);

    return null;
}