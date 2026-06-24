const express = require("express");
const { createStory, getStoriesFeed } = require("../controllers/story.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { upload, uploadToImageKit } = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/", verifyJWT, upload.single("image"), uploadToImageKit, createStory);
router.get("/feed", verifyJWT, getStoriesFeed);

module.exports = router;
