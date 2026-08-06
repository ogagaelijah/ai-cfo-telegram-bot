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
// TODAY SALES
// ==========================
function getTodaySales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')
    `).get(userId);

    return result.total;

}

// ==========================
// YESTERDAY SALES
// ==========================
function getYesterdaySales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', '-1 day', 'localtime')
    `).get(userId);

    return result.total;

}

// ==========================
// THIS WEEK SALES
// ==========================
function getThisWeekSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime')
            >= DATE('now', 'localtime', 'weekday 0', '-6 days')
    `).get(userId);

    return result.total;

}

// ==========================
// LAST WEEK SALES
// ==========================
function getLastWeekSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime')
            BETWEEN
                DATE('now', 'localtime', 'weekday 0', '-13 days')
            AND
                DATE('now', 'localtime', 'weekday 0', '-7 days')
    `).get(userId);

    return result.total;

}

// ==========================
// THIS MONTH SALES
// ==========================
function getThisMonthSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND strftime('%Y-%m', created_at, 'localtime')
            = strftime('%Y-%m', 'now', 'localtime')
    `).get(userId);

    return result.total;

}

// ==========================
// LAST MONTH SALES
// ==========================
function getLastMonthSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND strftime('%Y-%m', created_at, 'localtime')
            = strftime('%Y-%m', 'now', 'localtime', '-1 month')
    `).get(userId);

    return result.total;

}

// ==========================
// AVERAGE DAILY SALES
// ==========================
function getAverageDailySales(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(AVG(daily_total), 0) AS average
        FROM (
            SELECT
                DATE(created_at, 'localtime') AS day,
                SUM(total) AS daily_total
            FROM sales
            WHERE user_id = ?
            GROUP BY DATE(created_at, 'localtime')
        )
    `).get(userId);

    return Number(result.average) || 0;

}

// ==========================
// AVERAGE DAILY EXPENSES
// ==========================
function getAverageDailyExpenses(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(AVG(daily_total), 0) AS average
        FROM (
            SELECT
                DATE(created_at, 'localtime') AS day,
                SUM(amount) AS daily_total
            FROM expenses
            WHERE user_id = ?
            GROUP BY DATE(created_at, 'localtime')
        )
    `).get(userId);

    return Number(result.average) || 0;

}

module.exports = {

    getUserId,

    getTodaySales,

    getYesterdaySales,

    getThisWeekSales,

    getLastWeekSales,

    getThisMonthSales,

    getLastMonthSales,

    getAverageDailySales,

    getAverageDailyExpenses

};