const mongoose = require("mongoose");

const followRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

followRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

const followRequestModel = mongoose.model("followRequests", followRequestSchema);
module.exports = followRequestModel;
