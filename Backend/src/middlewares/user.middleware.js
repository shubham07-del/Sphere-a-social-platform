const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

const identifyUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        const user = await userModel.findOne({
            $or: [{ username }, { email }]
        }).select("+password");

        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid Password." });
        }

        // Attach the validated user to the request object so the controller can use it
        req.user = user; 
        
        // Pass control to the next function (your controller)
        next(); 
    } catch (error) {
        console.error("Error in identifyUser middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { identifyUser };
