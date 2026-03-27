const pool = require("../db/db") //imports connection with the db

const findRefreshTokenByUserId = async (userId) => {

    const result = await pool.query(
        "SELECT tkn_hash FROM refresh_tkn WHERE user_id = $1",
        [userId]
    )
    return result.rows[0];

}


const findRefreshToken = async (refreshToken) => {

    const result = await pool.query(
        "SELECT id FROM refresh_tkn WHERE tkn_hash = $1",
        [refreshToken]
    )
    return result.rows[0];

}

const eliminateRefreshTokenByUserId = async (userId) => {

    const result = await pool.query(
        "DELETE FROM refresh_tkn WHERE user_id = $1 RETURNING id, user_id",
        [userId]
    )
    return result.rows[0];

}

module.exports = {
    eliminateRefreshTokenByUserId,
    findRefreshToken,
    findRefreshTokenByUserId
} 