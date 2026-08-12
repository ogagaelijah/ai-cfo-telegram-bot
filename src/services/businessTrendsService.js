const trendEngine =
    require("./trendEngines/trendEngine");

const trendsRepository =
    require("../repositories/businessTrendsRepository");

// ============================================================
// CALCULATE PERCENTAGE CHANGE
// ============================================================

function calculatePercentageChange(
    current,
    previous
) {

    if (previous === 0) {

        return current === 0
            ? 0
            : 100;

    }

    return (
        (current - previous) /
        previous
    ) * 100;
}


// ============================================================
// BUSINESS TRENDS SERVICE
// ============================================================
//
// ACCOUNT-BASED DOMAIN SERVICE
//
// Receives accountId directly.
//
// It does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - Sessions
//
// ============================================================

function getBusinessTrends(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    // ========================================================
    // HISTORICAL SALES
    // ========================================================

    const today =
        trendsRepository.getTodaySales(
            accountId
        );


    const yesterday =
        trendsRepository.getYesterdaySales(
            accountId
        );


    const thisWeek =
        trendsRepository.getThisWeekSales(
            accountId
        );


    const lastWeek =
        trendsRepository.getLastWeekSales(
            accountId
        );


    const thisMonth =
        trendsRepository.getThisMonthSales(
            accountId
        );


    const lastMonth =
        trendsRepository.getLastMonthSales(
            accountId
        );


    // ========================================================
    // GROWTH CALCULATIONS
    // ========================================================

    const dailyGrowth =
        calculatePercentageChange(
            today,
            yesterday
        );


    const weeklyGrowth =
        calculatePercentageChange(
            thisWeek,
            lastWeek
        );


    const monthlyGrowth =
        calculatePercentageChange(
            thisMonth,
            lastMonth
        );


    // ========================================================
    // TREND ENGINE
    // ========================================================

    const trends =
        trendEngine.getBusinessTrends(
            accountId
        );


    // ========================================================
    // SUMMARY
    // ========================================================

    let summary =
        "Business performance is stable.";


    if (
        dailyGrowth > 0 &&
        weeklyGrowth > 0 &&
        monthlyGrowth > 0
    ) {

        summary =
            "📈 Sales are improving across daily, weekly and monthly periods.";

    }
    else if (
        dailyGrowth < 0 &&
        weeklyGrowth < 0 &&
        monthlyGrowth < 0
    ) {

        summary =
            "📉 Sales are declining consistently. Consider reviewing pricing, marketing or customer retention.";

    }
    else if (
        monthlyGrowth > 0
    ) {

        summary =
            "✅ Long-term business performance remains positive despite short-term fluctuations.";

    }


    // ========================================================
    // RESULT
    // ========================================================

    return {

        daily: {

            today,

            yesterday,

            growth:
                dailyGrowth

        },


        weekly: {

            thisWeek,

            lastWeek,

            growth:
                weeklyGrowth

        },


        monthly: {

            thisMonth,

            lastMonth,

            growth:
                monthlyGrowth

        },


        revenueTrend:
            trends.revenue.direction,

        revenueGrowth:
            trends.revenue.percentage,


        profitTrend:
            trends.profit.direction,


        cashTrend:
            trends.cash.direction,


        expenseTrend:
            trends.expenses.direction,


        inventoryTrend:
            trends.inventory.direction,


        customerTrend:
            trends.customers.direction,


        details:
            trends,


        summary

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getBusinessTrends

};