"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GoogleAuthButton from "./GoogleAuthButton";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

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
    const [confirmpassword, setConfirmpassword] = useState<string>("");
    const [showpasssword, setShowpassword] = useState<boolean>(false);
    const [showconfirmpasssword, setShowconfirmpassword] = useState<boolean>(false);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/auth/loggeduserdata", {
                method: "POST",
                credentials: "include",
            });

            const data = await res.json();

            if (data?.auth) {
                router.push("/searchfriends");
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


        if (!formData.username || !formData.email || !formData.password || !confirmpassword) {
            setError("All fields are required");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        if (formData.password != confirmpassword) {
            setError("Passwords should be same")
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
            router.push("/searchfriends");

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
        <div className="relative min-h-screen w-full overflow-x-hidden">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-l from-black to-blue-900 z-[1]" />

            {/* GRID CONTAINER */}
            <div className="relative z-[2] min-h-screen grid grid-cols-1 md:grid-cols-2 place-items-center px-4 sm:px-8">

                {/* MOBILE HEADER */}
                <div className="block lg:hidden w-full text-center">
                    <div className="flex justify-center items-center gap-3">
                        <Image
                            src="/favicon.ico"
                            alt="Techis Talk Logo"
                            width={50}
                            height={50}
                            className="mb-3"
                        />
                        <h1 className="text-4xl font-extrabold text-white tracking-wide">
                            Techis Talk
                        </h1>
                    </div>
                    <p className="text-gray-300 text-sm mt-1">
                        A modern place where professionals chat and collaborate.
                    </p>
                </div>

                {/* RIGHT COLUMN — TEXT (GLASS) */}
                <div className="hidden lg:block bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 lg:p-12 max-w-md text-center">

                    <Image
                        src="/favicon.ico"
                        alt="Techis Talk Logo"
                        width={100}
                        height={100}
                        className="mx-auto mb-4 float sm:w-[140px] sm:h-[140px]"
                    />

                    <h1 className="text-4xl tracking-wide font-extrabold text-white mb-8 text-center">
                        Techis Talk
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        A modern place where professionals chat and collaborate.
                    </p>
                </div>
                {/* LEFT COLUMN — FORM (GLASS) */}

                <div className="md:p-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md">

                    {userId && (
                        <button
                            className="hover:cursor-pointer text-white flex items-center gap-2"
                            onClick={() => setUserId(null)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    )}

                    <h2 className="text-3xl sm:text-3xl font-bold text-white text-center mb-6">

                        Create Account
                    </h2>
                    {error && <p className="text-red-400 text-center mt-2 mb-2">{error}</p>}
                    {success && <p className="text-green-400 text-center mt-2 mb-2">{success}</p>}

                    {!userId ? (
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="username"
                                placeholder="User Name"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="sm:p-4 p-3 bg-white/20 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="p-3 bg-white/20 text-white rounded-lg placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <div className="relative">

                                <input
                                    type={showpasssword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    required
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/20 text-white rounded-lg placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowpassword(!showpasssword)}
                                    className="hover:cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-white"
                                >
                                    {showpasssword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type={showconfirmpasssword ? "text" : "password"}
                                    name="confirmpassword"
                                    placeholder="Confirm Password"
                                    value={confirmpassword}
                                    required
                                    onChange={(e) => setConfirmpassword(e.target.value)}
                                    className="w-full p-3 bg-white/20 text-white rounded-lg placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowconfirmpassword(!showconfirmpasssword)}
                                    className="hover:cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-white"
                                >
                                    {showconfirmpasssword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="hover:cursor-pointer w-full py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-800 transition"
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
                                className="p-3 bg-white/20 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="hover:cursor-pointer w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-800 transition"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>
                    )}

                    <GoogleAuthButton />



                    <p className="text-center mt-4 text-gray-300">
                        Already have an account?
                        <Link href="/login" className="ml-2 text-white">
                            Login
                        </Link>
                    </p>
                </div>



            </div>
        </div>
    );
}