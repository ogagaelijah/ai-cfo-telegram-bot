const analytics =
require("../financialAnalyticsService");

// ==========================
// CASH TREND ENGINE
// ==========================
function getCashTrend(telegramId) {

    const cash =
        analytics.getCashMetrics(telegramId);

    let direction = "Stable";

    if (cash.cashPosition > 0) {

        direction = "Healthy";

    }

    if (cash.cashPosition < 0) {

        direction = "Declining";

    }

    return {

        cash:
            cash.cashPosition,

        direction

    };

}

module.exports = {

    getCashTrend

};