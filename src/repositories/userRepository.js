const db = require("../database/database");

// ==========================
// FIND USER BY TELEGRAM ID
// ==========================
function findByTelegramId(telegramId) {

    return db.prepare(`
        SELECT *
        FROM users
        WHERE telegram_id = ?
    `).get(telegramId);

}

// ==========================
// CREATE USER
// ==========================
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

// ==========================
// UPDATE BUSINESS NAME
// ==========================
function updateBusinessName(userId, businessName) {

    const result = db.prepare(`
        UPDATE users
        SET business_name = ?
        WHERE id = ?
    `).run(

        businessName,

        userId

    );

    return result.changes > 0;

}

module.exports = {

    findByTelegramId,

    createUser,

    updateBusinessName

};