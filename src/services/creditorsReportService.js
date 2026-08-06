const analytics = require("./financialAnalyticsService");

// ==========================
// CREDITORS REPORT
// ==========================

const HIGH_CREDITOR_THRESHOLD = 100000;

function getCreditorsReport(telegramId) {

    const debt =
        analytics.getDebtMetrics(telegramId);

    const status =
        debt.creditors > HIGH_CREDITOR_THRESHOLD
            ? "High Supplier Liabilities"
            : "Healthy";

    return {

        outstandingCreditors: debt.creditors,

        status

    };

}

module.exports = {

    getCreditorsReport

};