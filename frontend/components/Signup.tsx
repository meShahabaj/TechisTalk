"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleAuthButton from "./GoogleAuthButton";
import Image from "next/image";

export default function SignUp() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/auth/loggeduserdata", {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (data?.auth) {
                router.push("/home/searchfriends");
                return;
            }

        };

        fetchUser();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.username || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                "/api/auth/signup",
                formData,
                { withCredentials: true }
            );

            setUserId(res.data.userId);
            setSuccess("OTP sent to your email. Please verify.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || !userId) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await axios.post(
                "/api/auth/signup/verifyotp",
                { userId, otp },
                { withCredentials: true }
            );

            setSuccess("Email verified successfully!");
            router.push("/home/searchfriends");

            setUserId(null);
            setFormData({ username: "", email: "", password: "" });
        } catch (err: any) {
            setError(err.response?.data?.message || "OTP verification failed");
        } finally {
            setLoading(false);
            setOtp("");
        }
    };
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-l from-black to-blue-900 z-[1]" />

            {/* GRID CONTAINER */}
            <div className="relative z-[2] min-h-screen grid grid-cols-1 md:grid-cols-2 place-items-center px-8 ">

                {/* RIGHT COLUMN — TEXT (GLASS) */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-12 max-w-md text-center">
                    <Image src="/favicon.ico" alt="Techis Talk Logo" width={140} height={140} className="mx-auto mb-4 float" />
                    <h1 className="text-white text-4xl font-bold mb-4">
                        Techis Talk
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        A modern place where professionals chat and collaborate.
                    </p>
                </div>

                {/* LEFT COLUMN — FORM (GLASS) */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md">
                    <h2 className="text-3xl font-bold text-white text-center mb-6">
                        Create Account
                    </h2>

                    {!userId ? (
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="username"
                                placeholder="User Name"
                                value={formData.username}
                                onChange={handleChange}
                                className="p-3 bg-white/20 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 bg-white/20 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 bg-white/20 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 transition"
                            >
                                {loading ? "Signing Up..." : "Sign Up"}
                            </button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={otp}
                                onChange={handleOtpChange}
                                placeholder="Enter OTP"
                                className="p-3 bg-white/20 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="w-full py-3 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 transition"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    )}

                    <GoogleAuthButton />

                    {error && <p className="text-red-400 text-center mt-3">{error}</p>}
                    {success && <p className="text-green-400 text-center mt-3">{success}</p>}

                    <p className="text-center mt-4 text-gray-300">
                        Already have an account?
                        <Link href="/login" className="ml-1 underline">
                            Login
                        </Link>
                    </p>
                </div>



            </div>
        </div>
    );
}