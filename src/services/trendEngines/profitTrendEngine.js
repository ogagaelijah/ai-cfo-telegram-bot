const analytics =
require("../financialAnalyticsService");

// ==========================
// PROFIT TREND ENGINE
// ==========================
function getProfitTrend(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    let direction = "Stable";

    if (snapshot.netProfit > 0) {

        direction = "Profitable";

    }

    if (snapshot.netProfit < 0) {

        direction = "Loss";

    }

    return {

        profit:
            snapshot.netProfit,

        direction

    };

}

module.exports = {

    getProfitTrend

};