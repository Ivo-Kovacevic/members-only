const pool = require("./pool");

const insertUser = async (username, password) => {
    const result = await pool.query(
        `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username`,
        [username, password]
    );
    return result.rows[0];
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

const addMessage = async (userId, messageTitle, messageText) => {
    await pool.query(
        `INSERT INTO messages (user_id, title, text)VALUES ($1, $2, $3)`,
        [userId, messageTitle, messageText]
    );
};

const deleteMessage = async (messageId) => {
    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
};

const becomeMember = async (userId) => {
    await pool.query(`UPDATE users SET member = TRUE WHERE id = $1`, [userId]);
};

module.exports = {
    insertUser,
    getUser,
    getIdUser,
    getAllMessages,
    addMessage,
    deleteMessage,
    becomeMember,
};
