const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { sendOTPEmail } = require("../utils/mailer")


async function registerController(req, res){
    try {
        const {username, email, password} = req.body

        let user = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if(user){
            return res.status(400).json({
                message:"User already exist",
                user
            })
        }


        const hash = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            username,
            email,
            password: hash
        })

        const token = jwt.sign(
            {id:newUser._id, username:newUser.username},
            process.env.JWT_SECRET,
            {expiresIn:"15d"}
        )

        res.status(201).json({
            message:"User registered successfully.",
            user: newUser,
            token
        })
    } catch (error) {
        console.error("Error in registerController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

async function loginController(req,res){
    // The user was attached to req by the identifyUser middleware
    const user = req.user;

    const token = jwt.sign(
            {id:user._id, username:user.username},
            process.env.JWT_SECRET,
            {expiresIn:"15d"}
        )

    res.status(200).json({
        message:"User logged in successfully.", 
        user,
        token
    })
}


// Forgot Password - Generate OTP
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        try {
            // Send real email via nodemailer
            await sendOTPEmail(email, otp);
            res.status(200).json({ 
                message: "OTP sent to email successfully"
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
            res.status(500).json({ 
                message: `Email Failed: ${emailError.message}` 
            });
        }
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Verify OTP
async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error in verifyOTP:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Reset Password
async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await userModel.findOne({ 
            email, 
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const hash = await bcrypt.hash(newPassword, 10);
        user.password = hash;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerController,
    loginController,
    forgotPassword,
    verifyOTP,
    resetPassword
}