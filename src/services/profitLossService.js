const analytics = require("./financialAnalyticsService");

// ==========================
// PROFIT & LOSS
// ==========================
function getProfitLoss(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    const salesRevenue =
        snapshot.sales;

    const otherIncome =
        snapshot.income;

    const totalRevenue =
        salesRevenue + otherIncome;

    const grossMargin =
        salesRevenue > 0
            ? (snapshot.grossProfit / salesRevenue) * 100
            : 0;

    const netMargin =
        totalRevenue > 0
            ? (snapshot.netProfit / totalRevenue) * 100
            : 0;

    return {

        sales:
            salesRevenue,

        otherIncome,

        totalRevenue,

        costOfGoods:
            snapshot.costOfGoods,

        grossProfit:
            snapshot.grossProfit,

        grossMargin,

        expenses:
            snapshot.expenses,

        netProfit:
            snapshot.netProfit,

        netMargin

    };

}

module.exports = {

    getProfitLoss

};