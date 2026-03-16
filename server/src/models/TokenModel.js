//saves Token information in db

const pool = require("../db/db") //imports connection with the db

const saveRefreshToken = async (hashedRefreshToken, userId) => {

    const result = await pool.query(
        "INSERT INTO refresh_tkn (user_id, tkn_hash) VALUES($1, $2) RETURNING id, tkn_hash",
        [userId, hashedRefreshToken]
    );
    return result.rows[0];
};

module.exports = {
    saveRefreshToken,
}

