const analytics = require("./financialAnalyticsService");

// ==========================
// CASH FLOW STATEMENT
// ==========================
function getCashFlow(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    const cash =
        analytics.getCashMetrics(telegramId);

    return {

        sales: snapshot.sales,

        otherIncome: snapshot.income,

        cashIn: cash.cashIn,

        purchases: snapshot.purchases,

        expenses: snapshot.expenses,

        cashOut: cash.cashOut,

        cashPosition: cash.cashPosition

    };

}

module.exports = {

    getCashFlow

};