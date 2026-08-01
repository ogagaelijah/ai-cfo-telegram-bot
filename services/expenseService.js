const db = require("../database/database");

/**
 * Get internal user ID from Telegram ID
 */
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

/**
 * Save an expense
 */
function saveExpense(telegramId, expense) {

    const userId = getUserId(telegramId);

    db.prepare(`
        INSERT INTO expenses
        (
            user_id,
            item,
            category,
            amount,
            notes
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        userId,
        expense.description,
        expense.category,
        expense.amount,
        expense.notes || ""

    );

}

/**
 * Get today's total expenses
 */
function getTodayExpenses(telegramId) {

    const userId = getUserId(telegramId);

    const result = db.prepare(`
        SELECT SUM(amount) AS total
        FROM expenses
        WHERE user_id = ?
        AND DATE(created_at) = DATE('now','localtime')
    `).get(userId);

    return result.total || 0;

}

/**
 * Get this month's total expenses
 */
function getMonthlyExpenses(telegramId) {

    const userId = getUserId(telegramId);

    const result = db.prepare(`
        SELECT SUM(amount) AS total
        FROM expenses
        WHERE user_id = ?
        AND strftime('%Y-%m', created_at) =
            strftime('%Y-%m','now','localtime')
    `).get(userId);

    return result.total || 0;

}

/**
 * Get expenses by category
 */
function getExpensesByCategory(telegramId) {

    const userId = getUserId(telegramId);

    return db.prepare(`
        SELECT
            category,
            SUM(amount) AS total
        FROM expenses
        WHERE user_id = ?
        GROUP BY category
        ORDER BY total DESC
    `).all(userId);

}

module.exports = {

    saveExpense,

    getTodayExpenses,

    getMonthlyExpenses,

    getExpensesByCategory

};