module.exports = {
    insert_message: 'INSERT INTO messages(contents, created_date) VALUES($1, $2) RETURNING *',
    fetch_messages: 'SELECT * FROM messages ORDER BY created_date'
};