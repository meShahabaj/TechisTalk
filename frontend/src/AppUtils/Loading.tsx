import { useState, useEffect } from "react";

const quotes: string[] = [
    "Human connections turn moments into memories.",
    "You grow faster when you grow with people.",
    "Every meaningful relationship adds color to life.",
    "Connection is the quiet force that keeps us steady.",
    "We rise higher when we rise together.",
];

const Loading = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % quotes.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            {/* Floating glass card */}
            <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] max-w-sm text-center">

                {/* Modern glowing spinner */}
                <div className="w-14 h-14 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin shadow-[0_0_15px_rgba(59,130,246,0.7)]" />

                {/* Small label */}
                <span className="text-white/70 text-sm tracking-wide animate-fade">
                    Getting things ready...
                </span>

                {/* Quote */}
                <p
                    key={index}
                    className="text-lg text-white font-light leading-snug animate-fade"
                >
                    {quotes[index]}
                </p>

                {/* Gradient progress bar */}
                <div className="h-1 w-40 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-progress" />
                </div>
            </div>
        </div>
    );
};

export default Loading;
