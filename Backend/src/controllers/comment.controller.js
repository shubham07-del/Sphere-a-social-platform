const commentModel = require("../models/comment.model");
const notificationModel = require("../models/notification.model");
const postModel = require("../models/post.model");

// Add Comment
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;

        const post = await postModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = await commentModel.create({
            post: postId,
            user: req.user._id,
            text
        });

        // Create Notification for the post owner
        if (post.user.toString() !== req.user._id.toString()) {
            await notificationModel.create({
                user: post.user,
                type: "comment",
                fromUser: req.user._id,
                post: postId
            });
        }

        res.status(201).json({ message: "Comment added", comment: newComment });
    } catch (error) {
        console.error("Error in addComment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Comments for a Post
const getComments = async (req, res) => {
    try {
        const comments = await commentModel.find({ post: req.params.postId })
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });
        
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error in getComments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Comment
const deleteComment = async (req, res) => {
    try {
        const comment = await commentModel.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this comment" });
        }

        await commentModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.error("Error in deleteComment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { addComment, getComments, deleteComment };
