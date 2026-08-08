const analytics =
    require("../financialAnalyticsService");

// ============================================================
// PROFIT FORECAST SERVICE
// ============================================================
// IMPORTANT:
// This service does NOT call getRevenueForecast().
//
// Revenue forecasting is handled once by forecastEngine.js
// and the resulting revenue forecast is passed into this
// function.
//
// This prevents:
// - duplicate revenue calculations
// - repeated RAW SALES HISTORY logs
// - repeated REVENUE FORECAST logs
// - unnecessary database/repository calls
// ============================================================

function getProfitForecast(
    userId,
    revenueForecast
) {

    // ========================================================
    // CURRENT BUSINESS SNAPSHOT
    // ========================================================

    const snapshot =
        analytics.getBusinessSnapshot(
            userId
        ) || {};


    // ========================================================
    // SAFETY CHECK
    // ========================================================

    const revenue =
        revenueForecast || {};


    // ========================================================
    // CURRENT REVENUE
    // ========================================================

    const currentRevenue =
        Number(
            snapshot.sales
        ) || 0;


    // ========================================================
    // CURRENT NET PROFIT
    // ========================================================

    const currentNetProfit =
        Number(
            snapshot.netProfit
        ) || 0;


    // ========================================================
    // GROSS MARGIN
    // ========================================================

    const grossMargin =
        Number(
            snapshot.grossMargin
        ) || 0;


    const grossMarginRate =
        grossMargin / 100;


    // ========================================================
    // NET PROFIT MARGIN
    // ========================================================

    let netProfitMargin =
        0;


    if (
        currentRevenue > 0
    ) {

        netProfitMargin =
            currentNetProfit /
            currentRevenue;

    }


    // ========================================================
    // FORECAST REVENUE
    // ========================================================

    const estimatedTomorrowRevenue =
        Number(
            revenue.tomorrow
        ) || 0;


    const estimatedNext7DaysRevenue =
        Number(
            revenue.next7Days
        ) || 0;


    const estimatedNext30DaysRevenue =
        Number(
            revenue.next30Days
        ) || 0;


    // ========================================================
    // FORECAST GROSS PROFIT
    // ========================================================

    const tomorrowGrossProfit =
        estimatedTomorrowRevenue *
        grossMarginRate;


    const next7DaysGrossProfit =
        estimatedNext7DaysRevenue *
        grossMarginRate;


    const next30DaysGrossProfit =
        estimatedNext30DaysRevenue *
        grossMarginRate;


    // ========================================================
    // FORECAST NET PROFIT
    // ========================================================

    const tomorrowNetProfit =
        estimatedTomorrowRevenue *
        netProfitMargin;


    const next7DaysNetProfit =
        estimatedNext7DaysRevenue *
        netProfitMargin;


    const next30DaysNetProfit =
        estimatedNext30DaysRevenue *
        netProfitMargin;


    // ========================================================
    // PROFIT OUTLOOK
    // ========================================================

    let outlook =
        "Stable";


    if (
        currentRevenue <= 0
    ) {

        outlook =
            "Insufficient Data";

    }

    else if (
        netProfitMargin <= 0
    ) {

        outlook =
            "Loss Expected";

    }

    else if (
        netProfitMargin >= 0.20
    ) {

        outlook =
            "Strong";

    }

    else if (
        netProfitMargin < 0.10
    ) {

        outlook =
            "Weak";

    }


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "💰 PROFIT FORECAST"
    );

    console.log(
        "Current Revenue:",
        currentRevenue
    );

    console.log(
        "Current Net Profit:",
        currentNetProfit
    );

    console.log(
        "Gross Margin:",
        grossMargin
    );

    console.log(
        "Net Profit Margin:",
        netProfitMargin * 100
    );

    console.log(
        "Tomorrow Revenue:",
        estimatedTomorrowRevenue
    );

    console.log(
        "Tomorrow Gross Profit:",
        tomorrowGrossProfit
    );

    console.log(
        "Tomorrow Net Profit:",
        tomorrowNetProfit
    );

    console.log(
        "Next 7 Days Gross Profit:",
        next7DaysGrossProfit
    );

    console.log(
        "Next 7 Days Net Profit:",
        next7DaysNetProfit
    );

    console.log(
        "Next 30 Days Gross Profit:",
        next30DaysGrossProfit
    );

    console.log(
        "Next 30 Days Net Profit:",
        next30DaysNetProfit
    );

    console.log(
        "Profit Outlook:",
        outlook
    );


    // ========================================================
    // RETURN
    // ========================================================

    return {

        // ----------------------------------------------------
        // CURRENT BUSINESS METRICS
        // ----------------------------------------------------

        currentRevenue,

        currentNetProfit,

        grossMargin,

        netProfitMargin:
            netProfitMargin * 100,


        // ----------------------------------------------------
        // FORECAST REVENUE
        // ----------------------------------------------------

        tomorrowRevenue:
            estimatedTomorrowRevenue,

        next7DaysRevenue:
            estimatedNext7DaysRevenue,

        next30DaysRevenue:
            estimatedNext30DaysRevenue,


        // ----------------------------------------------------
        // FORECAST GROSS PROFIT
        // ----------------------------------------------------

        tomorrowGrossProfit,

        next7DaysGrossProfit,

        next30DaysGrossProfit,


        // ----------------------------------------------------
        // FORECAST NET PROFIT
        // ----------------------------------------------------

        tomorrow:
            tomorrowNetProfit,

        next7Days:
            next7DaysNetProfit,

        next30Days:
            next30DaysNetProfit,


        // ----------------------------------------------------
        // OUTLOOK
        // ----------------------------------------------------

        outlook

    };

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getProfitForecast

};