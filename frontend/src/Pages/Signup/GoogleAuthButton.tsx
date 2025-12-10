const BACKEND_API = process.env.REACT_APP_BACKEND_API

const GoogleAuthButton = () => {
    const handleGoogleAuth = () => {
        window.location.href = `${BACKEND_API}/auth/google`;
    };

    return (
        <button
            onClick={handleGoogleAuth}
            className="w-full mt-3 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
        >
            Continue with Google
        </button>
    );
};

export default GoogleAuthButton;
