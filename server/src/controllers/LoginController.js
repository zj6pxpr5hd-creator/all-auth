const { findUserByUsername } = require("../models/LoginModel")
const { handleTokens } = require("./TokenController.js")
const bcrypt = require("bcryptjs");


// Pre-computed dummy bcrypt hash to mitigate timing attacks when user does not exist
const DUMMY_HASH = "$2a$10$e7V/4x3K0/Q.52R4n5r1/.mJ5E/3L4t4Y/2.4n5r1/.mJ5E/3L4t4";

const login = async (req, res) => {

    try {
    
    const { username, password } = req.body;

    const user = await findUserByUsername(username);

    // Run password comparison against real hash or dummy hash to prevent user enumeration via timing attack
    const hashedPassword = user ? user.password_hash : DUMMY_HASH;
    const isMatch = await bcrypt.compare(password || "", hashedPassword);

    // Return generic error message and same status code to prevent user enumeration
    if (!user || !isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const result = await handleTokens(user.id, username, "login");

    
    if(!result.savedRefreshToken){
        res.status(500).json({ message: "Failed to save token"})
    }


        res.cookie("access_token", result.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refresh_token", result.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ message: "Successfully Logged In" })
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }

}

module.exports = {
    login
}