// routes/authRoutes.js or server.js
export const logoutController = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
}
