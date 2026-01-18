"use client";

import { useEffect, useState } from "react";

const DotsBackground = () => {
    const [dots, setDots] = useState<{ top: string; left: string; delay: string }[]>([]);

    useEffect(() => {
        const newDots = Array.from({ length: 50 }).map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random()}s`,
        }));
        setDots(newDots);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {dots.map((dot, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-indigo-500 animate-pulse rounded-full"
                    style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
                ></div>
            ))}
        </div>
    );
};

export default DotsBackground;
