const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversations",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const messageModel = mongoose.model("messages", messageSchema);
module.exports = messageModel;
