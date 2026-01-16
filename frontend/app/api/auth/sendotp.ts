import nodemailer from "nodemailer";

export default async function sendotp(
    toEmail: string,
    subject: string,
    text: string
) {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_PASS,
        },
    });

    await transporter.sendMail({
        from: `<${process.env.ADMIN_EMAIL}>`,
        to: toEmail,
        subject: subject,
        text: text,
    })
}