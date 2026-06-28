const express = require("express")
const cors = require("cors")
const path = require("path")
const authRouter = require("../src/routes/auth.routes")
const userRouter = require("../src/routes/user.routes")
const postRouter = require("../src/routes/post.routes")
const commentRouter = require("../src/routes/comment.routes")
const likeRouter = require("../src/routes/like.routes")
const followRouter = require("../src/routes/follow.routes")
const storyRouter = require("../src/routes/story.routes")
const notificationRouter = require("../src/routes/notification.routes")
const chatRouter = require("../src/routes/chat.routes")
const savedPostRouter = require("../src/routes/savedPost.routes")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/likes", likeRouter)
app.use("/api/follow", followRouter)
app.use("/api/stories", storyRouter)
app.use("/api/notifications", notificationRouter)
app.use("/api/chat", chatRouter)
app.use("/api/saved", savedPostRouter)

// No need to serve static frontend files since they are on Vercel

module.exports = app