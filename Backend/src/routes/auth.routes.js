const express = require("express")
const { identifyUser } = require("../middlewares/user.middleware")

const authRouter = express.Router()
const authController = require("../controllers/auth.controller")


/**
 * @route POST /api/auth/register
 */
authRouter.post("/register", authController.registerController)

/**
 * @route POST /api/auth/login
 */
authRouter.post("/login", identifyUser, authController.loginController)

authRouter.post("/forgot-password", authController.forgotPassword)
authRouter.post("/verify-otp", authController.verifyOTP)
authRouter.post("/reset-password", authController.resetPassword)

module.exports = authRouter