const followRequestModel = require("../models/followRequest.model");
const followerModel = require("../models/follower.model");
const notificationModel = require("../models/notification.model");

// Send Follow Request
const sendFollowRequest = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const senderId = req.user._id;

        if (senderId.toString() === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const existingFollow = await followerModel.findOne({ user: targetUserId, follower: senderId });
        if (existingFollow) {
            return res.status(400).json({ message: "Already following" });
        }

        const existingRequest = await followRequestModel.findOne({ sender: senderId, receiver: targetUserId });
        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent" });
        }

        await followRequestModel.create({ sender: senderId, receiver: targetUserId });

        await notificationModel.create({
            user: targetUserId,
            type: "follow",
            fromUser: senderId
        });

        res.status(200).json({ message: "Follow request sent" });
    } catch (error) {
        console.error("Error in sendFollowRequest:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Accept Follow Request
const acceptFollowRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await followRequestModel.findById(requestId);
        if (!request || request.receiver.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Request not found or unauthorized" });
        }

        request.status = "accepted";
        await request.save();

        await followerModel.create({ user: req.user._id, follower: request.sender });
        
        res.status(200).json({ message: "Follow request accepted" });
    } catch (error) {
        console.error("Error in acceptFollowRequest:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reject Follow Request
const rejectFollowRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await followRequestModel.findById(requestId);
        if (!request || request.receiver.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Request not found or unauthorized" });
        }

        request.status = "rejected";
        await request.save();

        res.status(200).json({ message: "Follow request rejected" });
    } catch (error) {
        console.error("Error in rejectFollowRequest:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Unfollow User
const unfollowUser = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const followerId = req.user._id;

        await followerModel.findOneAndDelete({ user: targetUserId, follower: followerId });

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        console.error("Error in unfollowUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Followers
const getFollowers = async (req, res) => {
    try {
        const targetId = req.params.id || req.user._id;
        const followers = await followerModel.find({ user: targetId }).populate("follower", "username name profilePic");
        res.status(200).json(followers);
    } catch (error) {
        console.error("Error in getFollowers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Followings
const getFollowings = async (req, res) => {
    try {
        const targetId = req.params.id || req.user._id;
        const followings = await followerModel.find({ follower: targetId }).populate("user", "username name profilePic");
        res.status(200).json(followings);
    } catch (error) {
        console.error("Error in getFollowings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Pending Requests
const getPendingRequests = async (req, res) => {
    try {
        const requests = await followRequestModel.find({ receiver: req.user._id, status: "pending" })
            .populate("sender", "username profilePic name");
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error in getPendingRequests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { sendFollowRequest, acceptFollowRequest, rejectFollowRequest, unfollowUser, getFollowers, getFollowings, getPendingRequests };
