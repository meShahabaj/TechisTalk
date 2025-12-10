import { useState } from "react";
import axios from "axios";
import GoogleAuthButton from "../Signup/GoogleAuthButton.tsx";
const BACKEND_API = process.env.REACT_APP_BACKEND_API

const Login = () => {

    // Form state
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        setError(null);
        setLoading(true);
        setSuccess(null);

        try {
            const response = await axios.post(`${BACKEND_API}/auth/login`, {
                email: formData.email,
                password: formData.password,
            }, { withCredentials: true });

            setSuccess("Login successful!");
            window.location.reload()

            // Reset form
            setFormData({ email: "", password: "" });
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.message || "Invalid credentials");
            } else if (err.request) {
                setError("No response from server");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-black-500 to-blue-500 p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button
                        type="submit"
                        className={`w-full bg-purple-500 text-white py-3 rounded-lg font-semibold transition-colors ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-600"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <GoogleAuthButton />
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2 text-center">{success}</p>}
                <p className="mt-4 text-center text-gray-600 text-sm">
                    Don't have an account? <a href="/signup" className="text-purple-500 hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
