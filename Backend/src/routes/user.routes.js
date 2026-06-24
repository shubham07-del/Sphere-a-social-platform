const express = require("express");
const { getProfile, updateProfile, searchUsers } = require("../controllers/user.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { upload, uploadToImageKit } = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/search", verifyJWT, searchUsers);
router.get("/:id", verifyJWT, getProfile);
router.put("/", verifyJWT, upload.single("profilePic"), uploadToImageKit, updateProfile);

module.exports = router;
