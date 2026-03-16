//saves register information in db

const pool = require("/db/db") //imports connection with the db

const findUserByUsername = async (username) => {

    const result = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return result

};

const createUser = async (username, password_hash) => {

    const result = await pool.query(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username",
        [username, password_hash]
    );

}

module.exports = {
    findUserByUsername,
    createUser
}