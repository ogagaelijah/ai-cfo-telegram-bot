const db = require("../database/database");

// ======================================================
// TODAY SALES
// ======================================================

function getTodaySales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total

        FROM sales

        WHERE
            account_id = ?

        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TODAY COST OF GOODS SOLD
// ======================================================

function getTodayCostOfGoods(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(cost_of_goods), 0) AS total

        FROM sales

        WHERE
            account_id = ?

        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TODAY PURCHASES
// ======================================================

function getTodayPurchases(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total_amount), 0) AS total

        FROM purchases

        WHERE
            account_id = ?

        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TODAY EXPENSES
// ======================================================

function getTodayExpenses(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total

        FROM expenses

        WHERE
            account_id = ?

        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TODAY INCOME
// ======================================================

function getTodayIncome(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total

        FROM income

        WHERE
            account_id = ?

        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// OUTSTANDING DEBTORS
// ======================================================

function getOutstandingDebtors(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(balance), 0) AS total

        FROM debtors

        WHERE
            account_id = ?

        AND balance > 0

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// OUTSTANDING CREDITORS
// ======================================================

function getOutstandingCreditors(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(balance), 0) AS total

        FROM creditors

        WHERE
            account_id = ?

        AND balance > 0

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// INVENTORY ITEMS
// ======================================================

function getInventoryCount(accountId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total

        FROM inventory

        WHERE
            account_id = ?

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// LOW STOCK ITEMS
// ======================================================

function getLowStockCount(accountId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total

        FROM inventory

        WHERE
            account_id = ?

        AND quantity <= 5

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TOTAL SALES
// ======================================================

function getTotalSales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total

        FROM sales

        WHERE
            account_id = ?

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TOTAL EXPENSES
// ======================================================

function getTotalExpenses(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total

        FROM expenses

        WHERE
            account_id = ?

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TOTAL INCOME
// ======================================================

function getTotalIncome(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total

        FROM income

        WHERE
            account_id = ?

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// TOTAL PURCHASES
// ======================================================

function getTotalPurchases(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total_amount), 0) AS total

        FROM purchases

        WHERE
            account_id = ?

    `).get(accountId);

    return Number(result.total) || 0;
}


// ======================================================
// REPORT SUMMARY
// ======================================================

function getSummary(accountId) {

    const sales =
        getTotalSales(accountId);

    const expenses =
        getTotalExpenses(accountId);

    const income =
        getTotalIncome(accountId);

    const purchases =
        getTotalPurchases(accountId);

    const debtors =
        getOutstandingDebtors(accountId);

    const creditors =
        getOutstandingCreditors(accountId);

    const inventory =
        getInventoryCount(accountId);

    const lowStock =
        getLowStockCount(accountId);

    return {

        sales,

        expenses,

        income,

        purchases,

        outstandingDebtors:
            debtors,

        outstandingCreditors:
            creditors,

        inventoryItems:
            inventory,

        lowStockItems:
            lowStock

    };

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getTodaySales,

    getTodayCostOfGoods,

    getTodayPurchases,

    getTodayExpenses,

    getTodayIncome,

    getOutstandingDebtors,

    getOutstandingCreditors,

    getInventoryCount,

    getLowStockCount,

    getTotalSales,

    getTotalExpenses,

    getTotalIncome,

    getTotalPurchases,

    getSummary

};