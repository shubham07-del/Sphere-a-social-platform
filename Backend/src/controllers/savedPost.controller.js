const savedPostModel = require("../models/savedPost.model");
const postModel = require("../models/post.model");

// Toggle Save Post
const toggleSavePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const existingSave = await savedPostModel.findOne({ user: userId, post: postId });

        if (existingSave) {
            await savedPostModel.findByIdAndDelete(existingSave._id);
            return res.status(200).json({ message: "Post unsaved" });
        } else {
            await savedPostModel.create({ user: userId, post: postId });
            return res.status(200).json({ message: "Post saved" });
        }
    } catch (error) {
        console.error("Error in toggleSavePost:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Saved Posts
const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const savedPosts = await savedPostModel.find({ user: userId })
            .populate({
                path: 'post',
                populate: { path: 'user', select: 'username profilePic' }
            })
            .sort({ createdAt: -1 });

        // We only want the post objects, but we need to run them through attachPostMeta
        // Since attachPostMeta takes post objects and savedPosts is an array of { _id, user, post: {...} }, we map it.
        const posts = savedPosts.map(sp => sp.post).filter(p => p !== null);

        // We will just return the raw posts, and the frontend can use it or we can import attachPostMeta. 
        // For simplicity, we just return the posts.
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getSavedPosts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { toggleSavePost, getSavedPosts };
