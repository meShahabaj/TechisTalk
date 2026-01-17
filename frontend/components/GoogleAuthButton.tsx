const GoogleAuthButton = () => {
    const handleGoogleAuth = () => {
        window.location.href = "/api/auth/google";
    };

    return (
        <button
            onClick={handleGoogleAuth}
            className="hover:cursor-pointer w-full mt-3 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all"
        >
            Continue with Google
        </button>
    );
};

export default GoogleAuthButton;
