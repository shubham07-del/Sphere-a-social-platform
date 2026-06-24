const express = require("express");
const { createPost, getFeed, deletePost, getUserPosts, getExplorePosts } = require("../controllers/post.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { upload, uploadToImageKit } = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/", verifyJWT, upload.single("image"), uploadToImageKit, createPost);
router.get("/feed", verifyJWT, getFeed);
router.get("/explore", verifyJWT, getExplorePosts);
router.get("/user/:userId", verifyJWT, getUserPosts);
router.delete("/:id", verifyJWT, deletePost);

module.exports = router;
