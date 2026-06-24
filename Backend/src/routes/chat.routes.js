const express = require("express");
const { getOrCreateConversation, getConversations, getMessages, sendMessage } = require("../controllers/chat.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/conversation/:targetUserId", verifyJWT, getOrCreateConversation);
router.get("/conversations", verifyJWT, getConversations);
router.get("/messages/:conversationId", verifyJWT, getMessages);
router.post("/messages/:conversationId", verifyJWT, sendMessage);

module.exports = router;
