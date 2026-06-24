const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Document will be automatically deleted after expiresAt
    }
}, { timestamps: true });

const storyModel = mongoose.model("stories", storySchema);
module.exports = storyModel;
