const storyModel = require("../models/story.model");
const followerModel = require("../models/follower.model");

// Create Story
const createStory = async (req, res) => {
    try {
        let imageUrl = "";

        if (req.file && req.file.url) {
            imageUrl = req.file.url;
        } else {
            return res.status(400).json({ message: "Image is required for a story" });
        }

        // Set expiration to 24 hours from now
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const newStory = await storyModel.create({
            user: req.user._id,
            image: imageUrl,
            expiresAt
        });

        res.status(201).json({ message: "Story created", story: newStory });
    } catch (error) {
        console.error("Error in createStory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Stories Feed (Current user's + followings' active stories)
const getStoriesFeed = async (req, res) => {
    try {
        const following = await followerModel.find({ follower: req.user._id }).select("user");
        const followingIds = following.map(f => f.user);

        followingIds.push(req.user._id);

        const stories = await storyModel.find({ user: { $in: followingIds } })
            .populate("user", "username profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json(stories);
    } catch (error) {
        console.error("Error in getStoriesFeed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createStory, getStoriesFeed };
