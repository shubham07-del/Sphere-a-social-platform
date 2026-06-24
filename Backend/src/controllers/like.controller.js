const likeModel = require("../models/like.model");
const notificationModel = require("../models/notification.model");
const postModel = require("../models/post.model");

// Toggle Like
const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const existingLike = await likeModel.findOne({ post: postId, user: userId });

        if (existingLike) {
            // Unlike
            await likeModel.findByIdAndDelete(existingLike._id);
            res.status(200).json({ message: "Post unliked" });
        } else {
            // Like
            await likeModel.create({ post: postId, user: userId });

            // Create notification
            if (post.user.toString() !== userId.toString()) {
                await notificationModel.create({
                    user: post.user,
                    type: "like",
                    fromUser: userId,
                    post: postId
                });
            }

            res.status(200).json({ message: "Post liked" });
        }
    } catch (error) {
        console.error("Error in toggleLike:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { toggleLike };
