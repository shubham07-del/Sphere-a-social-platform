const express = require("express");
const { toggleLike } = require("../controllers/like.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/:postId", verifyJWT, toggleLike);

module.exports = router;
