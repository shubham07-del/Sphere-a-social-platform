const express = require("express");
const { toggleSavePost, getSavedPosts } = require("../controllers/savedPost.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyJWT, getSavedPosts);
router.post("/:postId", verifyJWT, toggleSavePost);

module.exports = router;
