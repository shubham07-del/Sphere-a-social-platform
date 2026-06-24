const userModel = require("../models/user.model");

// Get user profile by ID
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file && req.file.url) {
            updates.profilePic = req.file.url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true }
        ).select("-password");

        res.status(200).json({ message: "Profile updated", user: updatedUser });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Search users
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: "Query is required" });

        const users = await userModel.find({
            $or: [
                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } }
            ]
        }).select("username name profilePic");

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in searchUsers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getProfile, updateProfile, searchUsers };
