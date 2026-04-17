const { findUserByUsername } = require("../models/LoginModel")
const { handleTokens } = require("./TokenController.js")
const bcrypt = require("bcryptjs");


const login = async (req, res) => {

    try {
    
    const { username, password } = req.body;

    const user = await findUserByUsername(username);
    if(!user) return res.status(404).json({ message: "User doesn't exists"});

    const hashedPassword = user.password_hash;

    const isMatch = await bcrypt.compare(password, hashedPassword);


    if(!isMatch) return res.status(400).json({ message: "Password is wrong"});

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