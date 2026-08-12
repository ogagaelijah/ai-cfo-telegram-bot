const db = require("../database/database");

// ======================================================
// FIND USER BY TELEGRAM ID
// ======================================================

function findByTelegramId(telegramId) {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            created_at

        FROM users

        WHERE
            telegram_id = ?

        LIMIT 1

    `).get(telegramId);

}


// ======================================================
// CREATE USER
// ======================================================

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

        user.username || null

    );

    return result.lastInsertRowid;

}


// ======================================================
// GET USER BY INTERNAL ID
// ======================================================

function findById(userId) {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            created_at

        FROM users

        WHERE
            id = ?

        LIMIT 1

    `).get(userId);

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    findByTelegramId,

    createUser,

    findById

};