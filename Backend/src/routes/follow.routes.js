const express = require("express");
const { sendFollowRequest, acceptFollowRequest, rejectFollowRequest, getFollowers, getFollowings, getPendingRequests } = require("../controllers/follow.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/request/:targetUserId", verifyJWT, sendFollowRequest);
router.post("/accept/:requestId", verifyJWT, acceptFollowRequest);
router.post("/reject/:requestId", verifyJWT, rejectFollowRequest);
router.get("/followers", verifyJWT, getFollowers);
router.get("/followings", verifyJWT, getFollowings);
router.get("/pending", verifyJWT, getPendingRequests);

module.exports = router;
