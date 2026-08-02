const db = require("../database/database");

function findByTelegramId(telegramId) {

    return db.prepare(`
        SELECT *
        FROM users
        WHERE telegram_id = ?
    `).get(telegramId);

}

function createUser(user) {

    const result = db.prepare(`
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

        user.telegramId,
        user.fullName,
        user.username

    );

    return result.lastInsertRowid;

}

function updateBusinessName(userId, businessName) {

    db.prepare(`
        UPDATE users
        SET business_name = ?
        WHERE id = ?
    `).run(

        businessName,
        userId

    );

}

module.exports = {

    findByTelegramId,
    createUser,
    updateBusinessName

};