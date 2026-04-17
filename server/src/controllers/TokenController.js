const jwt = require("jsonwebtoken"); //includes library for web tokens
const bcrypt = require("bcryptjs");
const { saveNewRefreshToken } = require("../models/TokenModel"); // imports saveRefreshToken function from TokenModel


const createAccessToken = (id, username) => {

    const accessToken = jwt.sign(
        {id: id, username: username},
        process.env.JWT_ACCESS_SECRET,
        {expiresIn : "15m"}
    );
    return accessToken;
}

const createRefreshToken = (id, username) => {

    const refreshToken = jwt.sign(
        {id: id, username: username},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn : "7d"}
    );
    return refreshToken;

}

const checkAccessToken = (accessToken) => {
    
    try{
        const result = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        return result;
    } catch {
        return null;
    }
}

const checkRefreshToken = (refreshToken) => {
    try {
        const result = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        return result;
    } catch {
        return null;
    }
}

const handleTokens = async (userId, username) => {
       
    
    // create access and refresh token
    let accessToken, refreshToken;
    //one trycatch block handles errors for both tokens together
    try {
        accessToken = createAccessToken(userId, username);
        refreshToken = createRefreshToken(userId, username);   
    } catch (error) {
        return result = { ok: false};
    }

    // encript refresh token
    const salt = await bcrypt.genSalt(10); //generate salts 
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    // save refresh token in db
    const savedRefreshToken = await saveNewRefreshToken(hashedRefreshToken, userId);

    const result = {
        refreshToken: refreshToken,
        accessToken: accessToken,
        savedRefreshToken: savedRefreshToken,
        ok: true
    }

    return result;
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    checkAccessToken,
    checkRefreshToken, 
    handleTokens
}

