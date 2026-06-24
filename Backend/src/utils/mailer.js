const nodemailer = require('nodemailer');
const dns = require('dns');

/**
 * Send an email with the OTP to the user.
 * @param {string} email - The user's email address.
 * @param {string} otp - The 6-digit OTP code.
 */
const sendOTPEmail = async (email, otp) => {
    // Fallback for development if SMTP is not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        // DEV MODE logs removed
        return true;
    }

    try {
        // 1. Manually resolve the IPv4 address of Gmail's SMTP server
        // This is the absolute bulletproof fix for Render's IPv6 ENETUNREACH bug.
        const { address } = await dns.promises.lookup('smtp.gmail.com', { family: 4 });

        // 2. Create the transporter inside the function using the resolved IPv4 address
        const transporter = nodemailer.createTransport({
            host: address,
            port: 587,
            secure: false, // Must be false for 587 (uses STARTTLS)
            requireTLS: true,
            tls: {
                servername: 'smtp.gmail.com', // Required so the SSL certificate doesn't fail on an IP address
            },
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            connectionTimeout: 10000, // 10 seconds max wait
            greetingTimeout: 10000,
            socketTimeout: 10000,
        });
        const mailOptions = {
            from: `"Antigravity Social" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p style="color: #555; font-size: 16px;">Hello,</p>
                    <p style="color: #555; font-size: 16px;">We received a request to reset your password. Use the following 6-digit verification code to proceed.</p>
                    <div style="background-color: #f4f4f4; border-radius: 8px; padding: 15px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6;">${otp}</span>
                    </div>
                    <p style="color: #555; font-size: 16px;">This code will expire in 10 minutes.</p>
                    <p style="color: #555; font-size: 14px; margin-top: 30px;">If you didn't request a password reset, please ignore this email.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = { sendOTPEmail };
