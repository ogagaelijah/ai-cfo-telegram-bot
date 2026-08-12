const {
    getBusinessSnapshot,
    getCashMetrics,
    getDebtMetrics
} = require("./financialAnalyticsService");


// ============================================================
// BUSINESS KPI SERVICE
// ============================================================
//
// ACCOUNT-BASED DOMAIN SERVICE
//
// Interface-independent.
//
// Receives:
//
//     accountId
//
// Does NOT receive:
//
//     Telegram ID
//     HTTP request
//     Web session
//     Mobile session
//
// ============================================================


function getBusinessKPIs(accountId) {

    // ========================================================
    // BUSINESS SNAPSHOT
    // ========================================================

    const snapshot =
        getBusinessSnapshot(
            accountId
        );


    // ========================================================
    // CASH
    // ========================================================

    const cash =
        getCashMetrics(
            accountId
        );


    // ========================================================
    // DEBT
    // ========================================================

    const debt =
        getDebtMetrics(
            accountId
        );


    // ========================================================
    // GROSS MARGIN %
    // ========================================================

    const grossMargin =
        snapshot.grossMargin;


    // ========================================================
    // NET MARGIN %
    // ========================================================

    const netMargin =
        snapshot.sales > 0
            ? (
                snapshot.netProfit /
                snapshot.sales
            ) * 100
            : 0;


    // ========================================================
    // EXPENSE RATIO
    // ========================================================

    const expenseRatio =
        snapshot.sales > 0
            ? (
                snapshot.expenses /
                snapshot.sales
            ) * 100
            : 0;


    // ========================================================
    // DEBT RATIO
    // ========================================================

    const debtRatio =
        snapshot.sales > 0
            ? (
                (
                    debt.debtors +
                    debt.creditors
                ) /
                snapshot.sales
            ) * 100
            : 0;


    // ========================================================
    // CASH RATIO
    // ========================================================

    const cashRatio =
        snapshot.sales > 0
            ? (
                cash.cashPosition /
                snapshot.sales
            ) * 100
            : 0;


    // ========================================================
    // INVENTORY TURNOVER
    // ========================================================

    const inventoryTurnover =
        snapshot.inventoryValue > 0
            ? (
                snapshot.costOfGoods /
                snapshot.inventoryValue
            )
            : 0;


    // ========================================================
    // AVERAGE REVENUE PER PRODUCT
    // ========================================================

    const revenuePerProduct =
        snapshot.productCount > 0
            ? (
                snapshot.sales /
                snapshot.productCount
            )
            : 0;


    // ========================================================
    // RETURN KPIs
    // ========================================================

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


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getBusinessKPIs

};