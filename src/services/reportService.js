const {
    getBusinessSnapshot,
    getCashMetrics,
    getDebtMetrics,
    getBusinessHealth
} = require("./financialAnalyticsService");

// ==========================
// REPORT DASHBOARD
// ==========================
function getDashboard(telegramId) {

    const snapshot =
        getBusinessSnapshot(telegramId);

    const cash =
        getCashMetrics(telegramId);

    const debt =
        getDebtMetrics(telegramId);

    const health =
        getBusinessHealth(telegramId);

    return {

        snapshot,

        cash,

        debt,

        health

    };

}

module.exports = {

    getDashboard

};