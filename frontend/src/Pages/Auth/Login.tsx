import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import GoogleAuthButton from "./GoogleAuthButton.tsx";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
                `${BACKEND_API}/auth/login`,
                { email: formData.email, password: formData.password },
                { withCredentials: true }
            );

            setSuccess("Login successful!");
            navigate("/search-friends")
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

            {/* Background image */}
            <img
                src="/login_img.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Left gradient overlay for extra space */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-purple-800/40 to-transparent z-[1]" />

            {/* Floating form container */}
            <div className="relative z-[2] min-h-screen flex items-center px-8 md:px-20">

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 w-full max-w-md">

                    <h2 className="text-3xl font-bold text-white text-center mb-6">
                        Login
                    </h2>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

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
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-4">
                        <GoogleAuthButton />
                    </div>

                    {error && <p className="text-red-400 text-center mt-3">{error}</p>}
                    {success && <p className="text-green-400 text-center mt-3">{success}</p>}

                    <p className="text-center mt-4 text-gray-300">
                        Don’t have an account?
                        <a href="/#/signup" className="text-purple-400 hover:underline ml-1">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Login;
