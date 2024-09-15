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
    return rows[0];
};

const getIdUser = async (id) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
    ]);
    return rows[0];
};

const getAllMessages = async () => {
    const { rows } = await pool.query(`
    SELECT 
        users.username, 
        messages.id, 
        messages.title, 
        messages.text, 
        messages.time
    FROM 
        users 
    INNER JOIN 
        messages 
    ON 
        users.id = messages.user_id
    ORDER BY 
        messages.id DESC;
    `);
    return rows;
};

const deleteMessage = async (messageId) => {
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
};

module.exports = {
    insertUser,
    getUser,
    getIdUser,
    getAllMessages,
    deleteMessage,
};
