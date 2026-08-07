const analytics = require("../financialAnalyticsService");

const {
    getRevenueForecast
} = require("./revenueForecastService");

// ==========================
// PROFIT FORECAST ENGINE
// ==========================
function getProfitForecast(userId) {

    const snapshot =
        analytics.getBusinessSnapshot(userId);

    const revenueForecast =
        getRevenueForecast(userId);

    const grossMargin =
        snapshot.grossMargin / 100;

    const estimatedTomorrowProfit =
        revenueForecast.tomorrow * grossMargin;

    const estimatedNext7DaysProfit =
        revenueForecast.next7Days * grossMargin;

    const estimatedNext30DaysProfit =
        revenueForecast.next30Days * grossMargin;

    let status = "Stable";

    if (estimatedTomorrowProfit < 0) {

        status = "Loss Expected";

    }

    else if (grossMargin >= 0.50) {

        status = "Strong";

    }

    else if (grossMargin < 0.20) {

        status = "Weak";

    }

    return {

        grossMargin,

        estimatedTomorrowProfit,

        estimatedNext7DaysProfit,

        estimatedNext30DaysProfit,

        status

    };

}

module.exports = {

    getProfitForecast

};