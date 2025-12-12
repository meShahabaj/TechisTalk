import { useState } from "react";
import axios from "axios";
import GoogleAuthButton from "./GoogleAuthButton.tsx";
import { Navigate, useNavigate } from "react-router-dom";
const BACKEND_API = process.env.REACT_APP_BACKEND_API

const SignUp = () => {
    const navigate = useNavigate();
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

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle OTP input change
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    };

    // Submit signup form
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
                `${BACKEND_API}/auth/signup`,
                formData,
                { withCredentials: true }
            );

            // Store userId to verify OTP
            setUserId(res.data.userId);
            setSuccess("OTP sent to your email. Please verify.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    // Submit OTP verification
    const handleVerifyOtp = async () => {
        if (!otp || !userId) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axios.post(
                `${BACKEND_API}/auth/verify-otp`,
                { userId, otp },
                { withCredentials: true }
            );

            setSuccess("Email verified successfully! You can now login.");
            navigate("/search-friends")
            setUserId(null); // hide OTP input
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

            {/* Background image */}
            <img
                src="/signup_img.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Left gradient overlay for extra space */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-purple-800/40 to-transparent z-[1]" />

            {/* Floating form container */}
            <div className="relative z-[2] min-h-screen flex items-center px-8 md:px-20">

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
                                className="p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
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
                                className="p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
                            />
                            <button
                                onClick={handleVerifyOtp}
                                className={`w-full py-3 rounded-lg text-white font-semibold bg-purple-600 hover:bg-purple-700 transition ${loading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </div>)}

                    < div className="mt-4">
                        <GoogleAuthButton />
                    </div>

                    {error && <p className="text-red-400 text-center mt-3">{error}</p>}
                    {success && <p className="text-green-400 text-center mt-3">{success}</p>}

                    <p className="text-center mt-4 text-gray-300">
                        Already have an account?{" "}
                        <a href="/#/Login" className="text-black-400 hover:underline ml-1">
                            Login
                        </a>
                    </p>
                </div>
            </div>

        </div >
    );
};

export default SignUp;
