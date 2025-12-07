import { Resend } from "resend";

export const sendOtp = async (to, otp) => {
    const resend = new Resend(process.env.RESEND_API);
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: to,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
        });
        console.log(`OTP sent to ${to}`);
    } catch (err) {
        console.error("Error sending OTP via Resend:", err);
        throw new Error("Failed to send OTP");
    }
};
