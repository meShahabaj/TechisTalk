import { useState } from "react";
import axios from "axios";
import GoogleAuthButton from "./GoogleAuthButton.tsx";
const BACKEND_API = process.env.REACT_APP_BACKEND_API

const SignUp = () => {
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
            window.location.reload();
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-black-500 to-blue-500 p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
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
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 text-white py-3 rounded-lg font-semibold transition-colors ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
                                }`}
                            disabled={loading}
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
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className={`w-full bg-green-500 text-white py-3 rounded-lg font-semibold transition-colors ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-600"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </div>
                )}

                <GoogleAuthButton />
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2 text-center">{success}</p>}
                <p className="mt-4 text-center text-gray-600 text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
