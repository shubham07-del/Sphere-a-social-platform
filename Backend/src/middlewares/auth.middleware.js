const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Invalid token. User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification error:", error);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = { verifyJWT };
