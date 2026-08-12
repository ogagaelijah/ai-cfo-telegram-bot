const db = require("../database/database");

// ============================================================
// FINANCIAL ANALYTICS REPOSITORY
// ============================================================
//
// ACCOUNT-BASED DATA ACCESS LAYER
//
// IMPORTANT:
//
// Financial/business data belongs to an ACCOUNT.
//
// This repository intentionally does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - Sessions
// - Interface users
//
// It receives accountId directly.
//
// Architecture:
//
// Interface
//     ↓
// Application Layer
//     ↓
// Account Context
//     ↓
// Financial Analytics Service
//     ↓
// THIS REPOSITORY
//     ↓
// SQLite
//
// ============================================================


// ============================================================
// TOTAL RECOGNIZED SALES
// ============================================================
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
// Therefore financial analytics use:
//
//     SUM(revenue)
//
// ============================================================

function getTotalSales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(revenue),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// TOTAL PURCHASES
// ============================================================

function getTotalPurchases(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(total_amount),
                0
            ) AS total

        FROM purchases

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// TOTAL EXPENSES
// ============================================================

function getTotalExpenses(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(amount),
                0
            ) AS total

        FROM expenses

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// TOTAL OTHER INCOME
// ============================================================

function getTotalIncome(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(amount),
                0
            ) AS total

        FROM income

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// INVENTORY VALUE
// ============================================================

function getInventoryValue(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(
                    quantity * cost_price
                ),
                0
            ) AS total

        FROM inventory

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// TOTAL PRODUCTS
// ============================================================

function getProductCount(accountId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total

        FROM inventory

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// OUTSTANDING DEBTORS
// ============================================================

function getOutstandingDebtors(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(balance),
                0
            ) AS total

        FROM debtors

        WHERE account_id = ?

        AND balance > 0
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// OUTSTANDING CREDITORS
// ============================================================

function getOutstandingCreditors(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(balance),
                0
            ) AS total

        FROM creditors

        WHERE account_id = ?

        AND balance > 0
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// COST OF GOODS SOLD
// ============================================================
//
// COGS is stored against recognized/completed sales.
//
// Incomplete legacy sales have:
//
//     cost_of_goods = 0
//
// Therefore summing cost_of_goods naturally excludes
// those incomplete records.
//
// ============================================================

function getCostOfGoodsSold(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(cost_of_goods),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// OPERATING EXPENSES
// ============================================================

function getOperatingExpenses(accountId) {

    return getTotalExpenses(
        accountId
    );
}


// ============================================================
// TOTAL SUPPLIERS
// ============================================================

function getSupplierCount(accountId) {

    const result = db.prepare(`
        SELECT
            COUNT(*) AS total

        FROM suppliers

        WHERE account_id = ?
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// INVENTORY TURNOVER
// ============================================================
//
// Inventory turnover uses recognized revenue.
//
// Incomplete sales with revenue = 0 are excluded.
//
// ============================================================

function getInventoryTurnover(accountId) {

    const sales =
        getTotalSales(
            accountId
        );

    const inventory =
        getInventoryValue(
            accountId
        );

    if (
        inventory === 0
    ) {

        return 0;

    }

    return sales / inventory;
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

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