const postModel = require("../models/post.model");
const followerModel = require("../models/follower.model");
const likeModel = require("../models/like.model");
const commentModel = require("../models/comment.model");
const savedPostModel = require("../models/savedPost.model");

// Create post
const createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        let imageUrl = "";

        if (req.file && req.file.url) {
            imageUrl = req.file.url;
        }

        const newPost = await postModel.create({
            user: req.user._id,
            caption,
            image: imageUrl
        });

        res.status(201).json({ message: "Post created", post: newPost });
    } catch (error) {
        console.error("Error in createPost:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Helper to attach meta
const attachPostMeta = async (posts, userId) => {
    return await Promise.all(posts.map(async (post) => {
        const likesCount = await likeModel.countDocuments({ post: post._id });
        const commentsCount = await commentModel.countDocuments({ post: post._id });
        const isLiked = await likeModel.exists({ post: post._id, user: userId });
        const isSaved = await savedPostModel.exists({ post: post._id, user: userId });
        
        return {
            ...post._doc,
            likesCount,
            commentsCount,
            isLiked: !!isLiked,
            isSaved: !!isSaved
        };
    }));
};

// Get Feed (All posts for everyone)
const getFeed = async (req, res) => {
    try {
        const posts = await postModel.find({})
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });

        const postsWithMeta = await attachPostMeta(posts, req.user._id);

        res.status(200).json(postsWithMeta);
    } catch (error) {
        console.error("Error in getFeed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Explore Posts
const getExplorePosts = async (req, res) => {
    try {
        // Random sort or just recent
        const posts = await postModel.find({})
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 })
            .limit(30);

        const postsWithMeta = await attachPostMeta(posts, req.user._id);

        res.status(200).json(postsWithMeta);
    } catch (error) {
        console.error("Error in getExplorePosts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete Post
const deletePost = async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await postModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted" });
    } catch (error) {
        console.error("Error in deletePost:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get User Posts
const getUserPosts = async (req, res) => {
    try {
        const posts = await postModel.find({ user: req.params.userId })
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });
            
        const postsWithMeta = await attachPostMeta(posts, req.user._id);
        res.status(200).json(postsWithMeta);
    } catch (error) {
        console.error("Error in getUserPosts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createPost, getFeed, deletePost, getUserPosts, getExplorePosts };
