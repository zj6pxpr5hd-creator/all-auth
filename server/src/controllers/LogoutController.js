const {eliminateRefreshTokenByUserId, findRefreshTokenByUserId} = require("../models/LogoutModel")
const bcrypt = require("bcryptjs");
const { checkRefreshToken } = require("./TokenController");

//logout function
const logout = async(req, res) => {

    try {
    
        const refreshToken = req.cookies?.refresh_token;

        //check that token isn't empty
        if (!refreshToken) return res.status(401).json({ ok: false, message: "Refresh Token is missing"});
        //decode user info from token
        const user = checkRefreshToken(refreshToken);
        if(!user) return res.status(401).json({message: "Refresh token is invalid"})

        const userId = user.id;

        const row = await findRefreshTokenByUserId(userId);
        if(!row) return res.status(404).json({ message: "Token not found"});
        
        //checks if refresh token is present in db
        const isMatch = await bcrypt.compare(refreshToken, row.tkn_hash);

        //if refresh tkn isn't present in db sends back 404 error
        if(!isMatch){
            return res.status(404).json({ message: "Token not found in DB" })
        }

        //calls eliminate function from LogoutModel
        const result = await eliminateRefreshTokenByUserId(userId);
    
        if(result){
            res.clearCookie("access_token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            })
            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            })
            return res.status(200).json({ ok: true, message: "Token eliminated correctly"})
        } else {
            return res.status(500).json({ ok: false, message: "Server error"})
        }



        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }

}

module.exports = {
    logout
}