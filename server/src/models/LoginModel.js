const pool = require("../db/db") //imports connection with the db

const findUserByUsername = async (username) => {

    result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return result.rows[0];
} 

module.exports = {
    findUserByUsername
}