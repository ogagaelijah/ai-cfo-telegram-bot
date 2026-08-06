const analytics = require("./financialAnalyticsService");

// ==========================
// DEBTORS REPORT
// ==========================

const HIGH_DEBTOR_THRESHOLD = 100000;

function getDebtorsReport(telegramId) {

    const debt =
        analytics.getDebtMetrics(telegramId);

    const status =
        debt.debtors > HIGH_DEBTOR_THRESHOLD
            ? "High Outstanding Receivables"
            : "Healthy";

    return {

        outstandingDebtors: debt.debtors,

        status

    };

}

module.exports = {

    getDebtorsReport

};