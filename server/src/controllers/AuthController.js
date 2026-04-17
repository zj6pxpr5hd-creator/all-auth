const bcrypt = require("bcryptjs");
const { checkAccessToken, checkRefreshToken, createAccessToken, createRefreshToken, handleTokens } = require("./TokenController.js")
const { saveRefreshToken } = require("../models/TokenModel"); // imports saveRefreshToken function from TokenModel
const { retrieveToken } = require("../models/TokenModel.js")

const authenticate = async (req, res) => {
    
    try {
    // 1) checks access token validity
    // extract token from cookies
    const accessToken = req.cookies?.access_token;
    //check that token isn't empty
    if (accessToken){
        //check if token is valid using checkAccessToken
        //if token is valid than user is authenticated
        if(checkAccessToken(accessToken)) return res.status(200).json({ ok: true, message: "user is authenticated trough access token" });
    }

    // 2) if response is negative check refresh token
    //extract token from cookies
    const refreshToken = req.cookies?.refresh_token;
    //check that token isn't empty
    if (!refreshToken) return res.status(401).json({ ok: false, message: "Refresh Token is missing"});
    //checks refresh token using checkRefreshToken and extracts user informations from token
    const user = checkRefreshToken(refreshToken);
    //if token isn't valid user needs to log in
    if(!user) return res.status(401).json({ ok: false, message: "Refresh Token isn't valid"});
    //retrieves user hashetRefreshToken to check if it matches the token from the cookies
    const hashedToken = await retrieveToken(user.id);
    if(!hashedToken){
        return res.status(401).json({ ok:false, message:"invalid refresh token"})
    }
    const isMatch = await bcrypt.compare(refreshToken, hashedToken);
    if(!isMatch){
        return res.status(401).json({ok:false, message:"invalid refresh token"})}
    //if the tokens match the refresh token gets rotated and a new access and refresh token get sent back to the client


        const result = await handleTokens(user.id, user.username, "authenticator");

        if(!result.ok){
            console.log("ERROR", result.message)
            return res.status(500).json({ ok: false, message: result.message})
        }

        if(!result.savedRefreshToken){
            return res.status(500).json({ message: "Failed to save token"})
        }
        //5)set httpOnly cookies containing tokens
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

        return res.status(200).json({ ok: true, message: "user is authenticated, new tokens have been sent" });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok:false, message:"Server Error"})
    }

};

module.exports = {
    authenticate
}