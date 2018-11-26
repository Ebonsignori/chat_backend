module.exports = {
    messages: {
        insert_message:
            "INSERT INTO messages(contents, created_date) " +
            "VALUES($1, $2) " +
            "RETURNING *",
        fetch_messages:
            "SELECT * FROM messages " +
            "ORDER BY created_date",
    },

    users: {
        create_user:
            "INSERT INTO users(account_name, first_name, last_name, email, password, created_date) " +
            "VALUES($1, $2, $3, $4, $5, $6) " +
            "RETURNING *",
        fetch_user_by_account_name:
            "SELECT * " +
            "FROM users " +
            "WHERE account_name = $1",
        fetch_user_by_id:
            "SELECT * " +
            "FROM users " +
            "WHERE id = $1"
    }
};