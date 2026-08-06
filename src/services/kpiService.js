const analytics = require("./financialAnalyticsService");

// ==========================
// KPI DASHBOARD
// ==========================
function getKPIs(telegramId) {

    const snapshot = analytics.getBusinessSnapshot(telegramId);

    const cash = analytics.getCashMetrics(telegramId);

    const debt = analytics.getDebtMetrics(telegramId);

    const revenue = snapshot.sales || 0;

    const grossMargin =
        revenue === 0
            ? 0
            : (snapshot.grossProfit / revenue) * 100;

    const netMargin =
        revenue === 0
            ? 0
            : (snapshot.netProfit / revenue) * 100;

    const expenseRatio =
        revenue === 0
            ? 0
            : (snapshot.expenses / revenue) * 100;

    const debtExposure =
        debt.debtors + debt.creditors;

    return {

        revenue,

        grossProfit: snapshot.grossProfit,

        netProfit: snapshot.netProfit,

        grossMargin,

        netMargin,

        expenseRatio,

        inventoryValue: snapshot.inventoryValue,

        productCount: snapshot.productCount,

        cashPosition: cash.cashPosition,

        debtors: debt.debtors,

        creditors: debt.creditors,

        debtExposure

    };

}

module.exports = {

    getKPIs

};