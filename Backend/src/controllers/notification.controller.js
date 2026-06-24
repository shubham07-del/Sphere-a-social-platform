const notificationModel = require("../models/notification.model");

// Get Notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find({ user: req.user._id })
            .populate("fromUser", "username profilePic")
            .populate("post", "image")
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error in getNotifications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Mark Notification as Read
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await notificationModel.findById(notificationId);

        if (!notification || notification.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Notification not found or unauthorized" });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Error in markAsRead:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getNotifications, markAsRead };
