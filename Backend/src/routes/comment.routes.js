const express = require("express");
const { addComment, getComments, deleteComment } = require("../controllers/comment.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/:postId", verifyJWT, addComment);
router.get("/:postId", verifyJWT, getComments);
router.delete("/:id", verifyJWT, deleteComment);

module.exports = router;
