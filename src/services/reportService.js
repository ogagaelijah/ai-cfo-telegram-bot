const db = require("../database/database");

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
// TODAY'S SALES
// ==========================
function getTodaySales(telegramId) {

    const userId = getUserId(telegramId);

    const result = db.prepare(`
        SELECT SUM(total) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at) = DATE('now','localtime')
    `).get(userId);

    return result.total || 0;
}

// ==========================
// TODAY'S EXPENSES
// ==========================
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

// ==========================
// TODAY'S PROFIT
// ==========================
function getTodayProfit(telegramId) {

    const sales = getTodaySales(telegramId);
    const expenses = getTodayExpenses(telegramId);

    return sales - expenses;
}

// ==========================
// TODAY'S TRANSACTIONS
// ==========================
function getTodayTransactions(telegramId) {

    const userId = getUserId(telegramId);

    const sales = db.prepare(`
        SELECT COUNT(*) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at)=DATE('now','localtime')
    `).get(userId).total;

    const expenses = db.prepare(`
        SELECT COUNT(*) AS total
        FROM expenses
        WHERE user_id = ?
        AND DATE(created_at)=DATE('now','localtime')
    `).get(userId).total;

    return sales + expenses;
}

// ==========================
// SUMMARY
// ==========================
function getTodaySummary(telegramId) {

    const sales = getTodaySales(telegramId);
    const expenses = getTodayExpenses(telegramId);
    const profit = sales - expenses;
    const transactions = getTodayTransactions(telegramId);

    return {
        sales,
        expenses,
        profit,
        transactions
    };

}

module.exports = {

    getTodaySales,
    getTodayExpenses,
    getTodayProfit,
    getTodayTransactions,
    getTodaySummary

};