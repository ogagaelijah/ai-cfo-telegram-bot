const analytics = require("../financialAnalyticsService");

// ==========================
// CASH FLOW FORECAST ENGINE
// ==========================
function getCashForecast(userId) {

    const cash =
        analytics.getCashMetrics(userId);

    const currentCash =
        cash.cashPosition;

    // ==========================
    // DAILY CASH BURN
    // ==========================
    const estimatedDailyBurn = 5000;

    let daysRemaining = Infinity;

    if (currentCash < 0) {

        daysRemaining = 0;

    }

    else if (estimatedDailyBurn > 0) {

        daysRemaining =
            Math.floor(currentCash / estimatedDailyBurn);

    }

    // ==========================
    // STATUS
    // ==========================
    let status = "Healthy";

    if (currentCash < 0) {

        status = "Critical";

    }

    else if (daysRemaining <= 7) {

        status = "High Risk";

    }

    else if (daysRemaining <= 30) {

        status = "Monitor Closely";

    }

    // ==========================
    // RECOMMENDATION
    // ==========================
    let recommendation =
        "Cash flow is healthy.";

    if (status === "Critical") {

        recommendation =
            "Immediate action required. Increase collections and reduce spending.";

    }

    else if (status === "High Risk") {

        recommendation =
            "Cash reserves may become insufficient within one week.";

    }

    else if (status === "Monitor Closely") {

        recommendation =
            "Monitor expenses carefully and improve customer collections.";

    }

    // ==========================
    // FORECAST
    // ==========================
    return {

        currentCash,

        estimatedDailyBurn,

        estimatedDaysRemaining:
            daysRemaining,

        next7Days:
            currentCash - (estimatedDailyBurn * 7),

        next30Days:
            currentCash - (estimatedDailyBurn * 30),

        status,

        recommendation

    };

}

module.exports = {

    getCashForecast

};