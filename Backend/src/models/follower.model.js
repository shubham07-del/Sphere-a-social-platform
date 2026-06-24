const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, { timestamps: true });

followerSchema.index({ user: 1, follower: 1 }, { unique: true });

const followerModel = mongoose.model("followers", followerSchema);
module.exports = followerModel;
