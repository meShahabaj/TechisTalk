import { useState } from "react";
import axios from "axios";

const SignUp = () => {
    // Form state
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // Loading and error state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation
        if (!formData.username || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setError(null);
        setLoading(true);
        setSuccess(null);

        try {
            // Example POST request
            const response = await axios.post("http://localhost:5000/api/auth/signup", formData,
                { withCredentials: true }
            );

            // Handle success
            setSuccess("Account created successfully!");
            window.location.reload()
            // Reset form
            setFormData({ username: "", email: "", password: "" });
        } catch (err: any) {
            // Handle error
            if (err.response) {
                // Server responded with a status other than 2xx
                setError(err.response.data.message || "Server Error");
            } else if (err.request) {
                // Request made but no response
                setError("No response from server");
                console.log(err)
            } else {
                // Other errors
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-black-500 to-blue-500 p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Account</h2>
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
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mt-2 text-center">{success}</p>}
                <p className="mt-4 text-center text-gray-600 text-sm">
                    Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
