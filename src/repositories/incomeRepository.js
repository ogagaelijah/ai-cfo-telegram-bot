const db = require("../database/database");

// ==========================
// GET INTERNAL USER ID
// ==========================
function getUserId(telegramId) {

    const user = db.prepare(`
        SELECT id
        FROM users
        WHERE telegram_id = ?
    `).get(telegramId);

    if (!user) {

        throw new Error("User not found.");

    }

    return user.id;

}

// ==========================
// CREATE INCOME
// ==========================
function create(telegramId, income) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        INSERT INTO income
        (
            user_id,
            source,
            amount,
            notes
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        userId,

        income.source,

        income.amount,

        income.notes || ""

    );

    return findById(result.lastInsertRowid);

}

// ==========================
// FIND BY ID
// ==========================
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM income
        WHERE id = ?
    `).get(id);

}

// ==========================
// TODAY TOTAL
// ==========================
function getTodayTotal(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount),0) AS total
        FROM income
        WHERE user_id = ?
        AND DATE(created_at,'localtime')
            = DATE('now','localtime')
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// MONTHLY TOTAL
// ==========================
function getMonthlyTotal(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount),0) AS total
        FROM income
        WHERE user_id = ?
        AND strftime('%Y-%m', created_at, 'localtime')
            = strftime('%Y-%m', 'now', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// ALL INCOME
// ==========================
function findAll(telegramId) {

    const userId =
        getUserId(telegramId);

    return db.prepare(`
        SELECT *
        FROM income
        WHERE user_id = ?
        ORDER BY created_at DESC
    `).all(userId);

}

module.exports = {

    create,

    findById,

    findAll,

    getTodayTotal,

    getMonthlyTotal

};