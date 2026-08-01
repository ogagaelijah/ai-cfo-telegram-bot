const db = require("../database/database");

function createUser(user) {

    const exists = db.prepare(`
        SELECT id
        FROM users
        WHERE telegram_id = ?
    `).get(user.id);

    if (exists) return;

    db.prepare(`
        INSERT INTO users
        (
            telegram_id,
            full_name,
            username
        )
        VALUES
        (
            ?,
            ?,
            ?
        )
    `).run(

        user.id,
        user.first_name + (user.last_name ? " " + user.last_name : ""),
        user.username || null

    );

}

module.exports = {

    createUser

};