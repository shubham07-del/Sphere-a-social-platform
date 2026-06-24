const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    caption: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;
