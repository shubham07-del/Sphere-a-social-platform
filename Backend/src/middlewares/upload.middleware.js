const multer = require("multer");
const ImageKit = require("imagekit");
require("dotenv").config();

// Setup Multer for memory storage (we will buffer the file and send to ImageKit)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize ImageKit
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_placeholder",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/placeholder"
});

// Middleware to upload to ImageKit
const uploadToImageKit = async (req, res, next) => {
    try {
        if (!req.file) {
            return next();
        }

        const response = await imagekit.upload({
            file: req.file.buffer, // file buffer from multer
            fileName: `${Date.now()}_${req.file.originalname}`,
            folder: "/social_media_app"
        });

        req.file.url = response.url;
        req.file.fileId = response.fileId;
        next();
    } catch (error) {
        console.error("ImageKit upload error:", error);
        return res.status(500).json({ message: "Failed to upload image." });
    }
};

module.exports = { upload, uploadToImageKit };
