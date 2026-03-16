const jwt = require("jsonwebtoken"); //includes library for web tokens

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

module.exports = {
    createAccessToken,
    createRefreshToken
}