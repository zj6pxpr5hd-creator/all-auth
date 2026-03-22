const bcrypt = require("bcryptjs");
const { checkAccessToken, checkRefreshToken, createAccessToken, createRefreshToken } = require("./TokenController.js")
const { saveRefreshToken } = require("../models/TokenModel"); // imports saveRefreshToken function from TokenModel
const { retrieveToken } = require("../models/TokenModel.js")

const authenticate = async (req, res) => {
    
    try {
    // 1) checks access token validity
    // extract token from cookies
    const accessToken = req.cookies?.access_token;
    //check that token isn't empty
    if (!accessToken) return res.status(401).json({ ok: false, message: "Token is missing" });
    //check if token is valid using checkAccessToken
    //if token is valid than user is authenticated
    if(checkAccessToken(accessToken)) return res.status(200).json({ ok: true, message: "user is authenticated" });


    // 2) if response is negative check refresh token
    //extract token from cookies
    const refreshToken = req.cookies?.refresh_token;
    //check that token isn't empty
    if (!refreshToken) return res.status(401).json({ ok: false, message: "Token is missing"});
    //checks refresh token using checkRefreshToken and extracts user informations from token
    const user = checkRefreshToken(refreshToken);
    //if token isn't valid user needs to log in
    if(!user) return res.status(401).json({ ok: false, message: "Refresh Token isn't valid"});
    //retrieves user hashetRefreshToken to check if it matches the token from the cookies
    const hashedToken = retrieveToken(user.id);
    const isMatch = await bcrypt.compare(refreshToken, hashedToken);
    if(!isMatch){return res.status(401).json({ok:false, message:"invalid refresh token"})}
    //if the tokens match the refresh token gets rotated and a new access and refresh token get sent back to the client
    if(isMatch){

        //1) create access and refresh token
        let newAccessToken, newRefreshToken;
        
        //2) create tokens; one trycatch block handles errors for both tokens together
        try {
            newAccessToken = createAccessToken(user.id, user.username);
            newRefreshToken = createRefreshToken(user.id, user.username);   
        } catch (error) {
            return res.status(500).json({ message: "Token creation failed" });
        }


        //3) encript refresh token
        const salt = await bcrypt.genSalt(10);
        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, salt);

        //4) save refresh token in db
        const savedRefreshToken = await saveRefreshToken(hashedRefreshToken, user.id)
        if(!savedRefreshToken){
            return res.status(500).json({ message: "Failed to save token"})
        }
        //5)set httpOnly cookies containing tokens
        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refresh_token", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ ok: true, message: "user is authenticated, new tokens have been sent" });
    }
        
    } catch (error) {
        
    }


};

module.exports = {
    authenticate
}