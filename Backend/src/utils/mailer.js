/**
 * Send an email with the OTP to the user via Brevo REST API
 * @param {string} email - The user's email address.
 * @param {string} otp - The 6-digit OTP code.
 */
const sendOTPEmail = async (email, otp) => {
    // Fallback for development if SMTP is not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return true;
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.SMTP_PASS, // You stored the API Key here
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: {
                    name: "Antigravity Social",
                    email: "shubhamlenka43@gmail.com" // Must be your verified Brevo email
                },
                to: [
                    {
                        email: email
                    }
                ],
                subject: 'Password Reset Verification Code',
                htmlContent: `
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
                `
            })
        });

        // The response might be empty on success, so we safely handle it
        let data = {};
        try {
            data = await response.json();
        } catch (e) {}

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error ${response.status}`);
        }

        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error(error.message || 'Failed to send email');
    }
};

module.exports = { sendOTPEmail };
