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

    return Number(result.total) || 0;

}

// ==========================
// TODAY COST OF GOODS SOLD
// ==========================
function getTodayCostOfGoods(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(cost_of_goods), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// TODAY PURCHASES
// ==========================
function getTodayPurchases(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total_amount), 0) AS total
        FROM purchases
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// TODAY EXPENSES
// ==========================
function getTodayExpenses(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// TODAY INCOME
// ==========================
function getTodayIncome(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total
        FROM income
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// OUTSTANDING DEBTORS
// ==========================
function getOutstandingDebtors(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(balance), 0) AS total
        FROM debtors
        WHERE user_id = ?
        AND balance > 0
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// OUTSTANDING CREDITORS
// ==========================
function getOutstandingCreditors(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(balance), 0) AS total
        FROM creditors
        WHERE user_id = ?
        AND balance > 0
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// INVENTORY ITEMS
// ==========================
function getInventoryCount(userId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total
        FROM inventory
        WHERE user_id = ?
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// LOW STOCK ITEMS
// ==========================
function getLowStockCount(userId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total
        FROM inventory
        WHERE user_id = ?
        AND quantity <= 5
    `).get(userId);

    return Number(result.total) || 0;

}

module.exports = {

    getUserId,

    getTodaySales,

    getTodayCostOfGoods,

    getTodayPurchases,

    getTodayExpenses,

    getTodayIncome,

    getOutstandingDebtors,

    getOutstandingCreditors,

    getInventoryCount,

    getLowStockCount

};