const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, { timestamps: true });

// Prevent multiple likes from the same user on the same post
likeSchema.index({ post: 1, user: 1 }, { unique: true });

const likeModel = mongoose.model("likes", likeSchema);
module.exports = likeModel;
