const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");

// Get or Create Conversation
const getOrCreateConversation = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id;

        if (userId.toString() === targetUserId) {
            return res.status(400).json({ message: "Cannot create conversation with yourself" });
        }

        let conversation = await conversationModel.findOne({
            participants: { $all: [userId, targetUserId] }
        });

        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [userId, targetUserId]
            });
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error in getOrCreateConversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get User's Conversations
const getConversations = async (req, res) => {
    try {
        const conversations = await conversationModel.find({
            participants: { $in: [req.user._id] }
        }).populate("participants", "username profilePic").sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getConversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Messages for a Conversation
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await messageModel.find({ conversationId }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Send Message (REST fallback, typically you'd use socket.io directly)
const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;
        const sender = req.user._id;

        const conversation = await conversationModel.findById(conversationId);
        if (!conversation || !conversation.participants.includes(sender)) {
            return res.status(403).json({ message: "Unauthorized or conversation not found" });
        }

        const newMessage = await messageModel.create({
            conversationId,
            sender,
            text
        });

        conversation.updatedAt = new Date();
        await conversation.save();

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getOrCreateConversation, getConversations, getMessages, sendMessage };
