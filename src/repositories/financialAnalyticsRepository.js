const db = require("../database/database");

// ==========================
// GET INTERNAL USER
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
// TOTAL RECOGNIZED SALES
// ==========================
//
// IMPORTANT:
//
// Use recognized revenue, not raw transaction total.
//
// Some legacy/incomplete sales records may contain:
//
//     total > 0
//     revenue = 0
//
// Those records are not recognized revenue.
//
// Complete sales records have:
//
//     revenue > 0
//
// Therefore financial analytics should use
// SUM(revenue), not SUM(total).
//
// Example:
//
// Raw transaction total:
//     ₦164,400
//
// Recognized revenue:
//     ₦92,400
//
// The ₦72,000 difference comes from incomplete
// sales records with revenue = 0.
//

function getTotalSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(revenue), 0) AS total
        FROM sales
        WHERE user_id = ?
    `).get(userId);

    return result.total;
}


// ==========================
// TOTAL PURCHASES
// ==========================
function getTotalPurchases(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total_amount), 0) AS total
        FROM purchases
        WHERE user_id = ?
    `).get(userId);

    return result.total;
}


// ==========================
// TOTAL EXPENSES
// ==========================
function getTotalExpenses(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE user_id = ?
    `).get(userId);

    return result.total;
}


// ==========================
// TOTAL OTHER INCOME
// ==========================
function getTotalIncome(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total
        FROM income
        WHERE user_id = ?
    `).get(userId);

    return result.total;
}


// ==========================
// INVENTORY VALUE
// ==========================
function getInventoryValue(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(
                    quantity * cost_price
                ),
                0
            ) AS total
        FROM inventory
        WHERE user_id = ?
    `).get(userId);

    return result.total;
}


// ==========================
// TOTAL PRODUCTS
// ==========================
function getProductCount(userId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total
        FROM inventory
        WHERE user_id = ?
    `).get(userId);

    return result.total;
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

    return result.total;
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

    return result.total;
}


// ==========================
// COST OF GOODS SOLD (COGS)
// ==========================
//
// COGS is already stored only against
// recognized/completed sales in the current
// sales structure.
//
// Incomplete legacy sales have:
//
//     cost_of_goods = 0
//
// Therefore summing cost_of_goods naturally
// excludes those incomplete records.
//

function getCostOfGoodsSold(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(cost_of_goods),
                0
            ) AS total
        FROM sales
        WHERE user_id = ?
    `).get(userId);

    return result.total;
}


// ==========================
// OPERATING EXPENSES
// ==========================
function getOperatingExpenses(userId) {

    return getTotalExpenses(userId);

}


// ==========================
// TOTAL SUPPLIERS
// ==========================
function getSupplierCount(userId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total
        FROM suppliers
        WHERE user_id = ?
    `).get(userId);

    return result.total;
}


// ==========================
// INVENTORY TURNOVER
// ==========================
//
// Inventory turnover uses recognized revenue.
//
// This keeps the calculation consistent with
// the financial analytics revenue definition.
//
// Incomplete sales with revenue = 0 are excluded.
//

function getInventoryTurnover(userId) {

    const sales =
        getTotalSales(userId);

    const inventory =
        getInventoryValue(userId);

    if (inventory === 0) {

        return 0;

    }

    return sales / inventory;
}


// ==========================
// EXPORTS
// ==========================

module.exports = {

    getUserId,

    getTotalSales,

    getTotalPurchases,

    getTotalExpenses,

    getTotalIncome,

    getInventoryValue,

    getProductCount,

    getOutstandingDebtors,

    getOutstandingCreditors,

    getCostOfGoodsSold,

    getOperatingExpenses,

    getSupplierCount,

    getInventoryTurnover

};