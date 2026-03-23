//saves Token information in db

const pool = require("../db/db") //imports connection with the db

const saveNewRefreshToken = async (hashedRefreshToken, userId) => {

    const result = await pool.query(
        "INSERT INTO refresh_tkn (user_id, tkn_hash) VALUES($1, $2) RETURNING id, tkn_hash",
        [userId, hashedRefreshToken]
    );
    return result.rows[0];
};

const retrieveToken = async (userId) => {
    const result = await pool.query(
        "SELECT tkn_hash FROM refresh_tkn WHERE user_id = $1",
        [userId]
    )
    return result.rows[0]?.tkn_hash;
}

const saveRefreshToken = async (hashedRefreshToken, userId) => {

    const result = await pool.query(
        "UPDATE refresh_tkn SET tkn_hash = $1 WHERE user_id = $2 RETURNING id, tkn_hash",
        [hashedRefreshToken, userId]
    );
    return result.rows[0];
};

module.exports = {
    saveRefreshToken,
    saveNewRefreshToken,
    retrieveToken
}

