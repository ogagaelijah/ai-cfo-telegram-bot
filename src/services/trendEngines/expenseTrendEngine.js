const analytics =
require("../financialAnalyticsService");

// ==========================
// EXPENSE TREND ENGINE
// ==========================
function getExpenseTrend(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    let direction = "Stable";

    if (snapshot.expenses > snapshot.sales * 0.50) {

        direction = "High";

    }

    return {

        expenses:
            snapshot.expenses,

        direction

    };

}

module.exports = {

    getExpenseTrend

};