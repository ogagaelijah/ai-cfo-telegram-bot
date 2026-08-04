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

    return {

        snapshot: getBusinessSnapshot(telegramId),

        cash: getCashMetrics(telegramId),

        debt: getDebtMetrics(telegramId),

        health: getBusinessHealth(telegramId)

    };

}

module.exports = {

    getDashboard

};