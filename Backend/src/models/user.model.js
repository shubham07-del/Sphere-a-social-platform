const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique: true,
        required:[true, "Username is required."]
    },
    email:{
        type:String,
        unique: true,
        required:[true, "Email is required."]
    },
    password:{
        type:String,
        required:[true, "Password is required."],
        select: false
    },
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    resetPasswordOTP: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema)

module.exports = userModel