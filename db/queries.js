const pool = require("./pool");

const insertUser = async (username, password) => {
    await pool.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, [
        username,
        password,
    ]);
};

const getUser = async (username) => {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    console.log(rows);
    return rows[0];
};

const getIdUser = async (id) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
    ]);
    return rows[0];
}

module.exports = {
    insertUser,
    getUser,
    getIdUser,
};
