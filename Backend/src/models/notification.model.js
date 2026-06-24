const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    type: {
        type: String,
        enum: ["like", "comment", "follow"],
        required: true
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const notificationModel = mongoose.model("notifications", notificationSchema);
module.exports = notificationModel;
