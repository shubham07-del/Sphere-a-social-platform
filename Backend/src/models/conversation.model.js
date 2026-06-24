const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }]
}, { timestamps: true });

const conversationModel = mongoose.model("conversations", conversationSchema);
module.exports = conversationModel;
