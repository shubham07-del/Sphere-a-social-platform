require("dotenv").config()
const dns = require("dns")
dns.setServers(["8.8.8.8"], ["1.1.1.1"])

const http = require("http")
const { Server } = require("socket.io")

const port = process.env.PORT || 3000
const app = require("./src/app")
const connectToDB = require("./src/config/Database")
connectToDB()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*", // Configure this to your frontend URL in production
        methods: ["GET", "POST"]
    }
})

// Setup socket io connections
io.on("connection", (socket) => {
    

    // User joins their own room for personal notifications
    socket.on("join_user_room", (userId) => {
        socket.join(userId)
    })

    // User joins a conversation room
    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId)
    })

    // Send message to a conversation
    socket.on("send_message", (data) => {
        // data should contain { conversationId, sender, text, ... }
        // Broadcast to others in the room
        socket.to(data.conversationId).emit("receive_message", data)
    })

    socket.on("disconnect", () => {
        
    })
})

server.listen(port, ()=>{
    
})