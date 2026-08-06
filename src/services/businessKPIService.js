const {
    getBusinessSnapshot,
    getCashMetrics,
    getDebtMetrics
} = require("./financialAnalyticsService");

// ==========================
// BUSINESS KPIs
// ==========================
function getBusinessKPIs(telegramId) {

    const snapshot =
        getBusinessSnapshot(telegramId);

    const cash =
        getCashMetrics(telegramId);

    const debt =
        getDebtMetrics(telegramId);

    // ==========================
    // Gross Margin %
    // ==========================
    const grossMargin =
        snapshot.grossMargin;

    // ==========================
    // Net Margin %
    // ==========================
    const netMargin =
        snapshot.sales > 0
            ? (snapshot.netProfit / snapshot.sales) * 100
            : 0;

    // ==========================
    // Expense Ratio
    // ==========================
    const expenseRatio =
        snapshot.sales > 0
            ? (snapshot.expenses / snapshot.sales) * 100
            : 0;

    // ==========================
    // Debt Ratio
    // ==========================
    const debtRatio =
        snapshot.sales > 0
            ? ((debt.debtors + debt.creditors) / snapshot.sales) * 100
            : 0;

    // ==========================
    // Cash Ratio
    // ==========================
    const cashRatio =
        snapshot.sales > 0
            ? (cash.cashPosition / snapshot.sales) * 100
            : 0;

    // ==========================
    // Inventory Turnover
    // ==========================
    const inventoryTurnover =
        snapshot.inventoryValue > 0
            ? snapshot.costOfGoods / snapshot.inventoryValue
            : 0;

    // ==========================
    // Average Revenue Per Product
    // ==========================
    const revenuePerProduct =
        snapshot.productCount > 0
            ? snapshot.sales / snapshot.productCount
            : 0;

    return {

        grossMargin,

        netMargin,

        expenseRatio,

        debtRatio,

        cashRatio,

        inventoryTurnover,

        revenuePerProduct

    };

}

module.exports = {

    getBusinessKPIs

};