const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notification.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyJWT, getNotifications);
router.put("/:notificationId/read", verifyJWT, markAsRead);

module.exports = router;
