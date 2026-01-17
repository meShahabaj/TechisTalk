"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import GoogleAuthButton from "./GoogleAuthButton";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showpasssword, setShowpassword] = useState<boolean>(false)



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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            await axios.post(
                "/api/auth/login",
                { email: formData.email, password: formData.password },
                { withCredentials: true }
            );

            setSuccess("Login successful!");
            router.push("/searchfriends");
        } catch (err: any) {
            if (err.response) setError(err.response.data.message || "Invalid credentials");
            else if (err.request) setError("No response from server");
            else setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">

            {/* Left gradient overlay for extra space */}
            <div className="absolute inset-0 bg-gradient-to-l from-black to-blue-900 z-[1]" />
            <div className="relative z-[2] min-h-screen grid grid-cols-1 md:grid-cols-2 place-items-center px-8 ">
                {/* RIGHT COLUMN — TEXT (GLASS) */}
                <div className="hidden sm:block bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-12 max-w-md text-center">
                    <img src="/favicon.ico" alt="Techis Talk Logo" width={140} height={140} className="mx-auto mb-4 float" />
                    <h1 className="text-white text-4xl font-bold mb-4">
                        Techis Talk
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        A modern place where professionals chat and collaborate.
                    </p>
                </div>
                {/* Floating form container */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md">


                    <h2 className="text-3xl font-bold text-white text-center mb-6">
                        Login
                    </h2>
                    {error && <p className="text-red-400 text-center mb-2">{error}</p>}
                    {success && <p className="text-green-400 text-center mb-2">{success}</p>}

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none"
                        />
                        <div className="relative">

                            <input
                                type={showpasssword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                required
                                onChange={handleChange}
                                className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-white outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowpassword(!showpasssword)}
                                className="hover:cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-white"
                            >
                                {showpasssword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`hover:cursor-pointer w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-800 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-4">
                        <GoogleAuthButton />
                    </div>



                    <p className="text-center mt-4 text-gray-300">
                        Don’t have an account?
                        <a href="/signup" className="text-white ml-2">
                            Sign Up
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;
