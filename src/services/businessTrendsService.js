const trendsRepository = require("../repositories/businessTrendsRepository");

// ==========================
// CALCULATE PERCENTAGE CHANGE
// ==========================
function calculatePercentageChange(current, previous) {

    if (previous === 0) {

        if (current === 0) {
            return 0;
        }

        return 100;

    }

    return ((current - previous) / previous) * 100;

}

// ==========================
// BUSINESS TRENDS
// ==========================
function getBusinessTrends(telegramId) {

    const userId =
        trendsRepository.getUserId(telegramId);

    const today =
        trendsRepository.getTodaySales(userId);

    const yesterday =
        trendsRepository.getYesterdaySales(userId);

    const thisWeek =
        trendsRepository.getThisWeekSales(userId);

    const lastWeek =
        trendsRepository.getLastWeekSales(userId);

    const thisMonth =
        trendsRepository.getThisMonthSales(userId);

    const lastMonth =
        trendsRepository.getLastMonthSales(userId);

    const dailyGrowth =
        calculatePercentageChange(today, yesterday);

    const weeklyGrowth =
        calculatePercentageChange(thisWeek, lastWeek);

    const monthlyGrowth =
        calculatePercentageChange(thisMonth, lastMonth);

    let summary = "Business performance is stable.";

    if (
        dailyGrowth > 0 &&
        weeklyGrowth > 0 &&
        monthlyGrowth > 0
    ) {

        summary =
            "📈 Sales are improving across daily, weekly and monthly periods.";

    } else if (
        dailyGrowth < 0 &&
        weeklyGrowth < 0 &&
        monthlyGrowth < 0
    ) {

        summary =
            "📉 Sales are declining consistently. Consider reviewing pricing, marketing or customer retention.";

    } else if (
        monthlyGrowth > 0
    ) {

        summary =
            "✅ Long-term business performance remains positive despite short-term fluctuations.";

    }

    return {

        daily: {

            today,

            yesterday,

            growth: dailyGrowth

        },

        weekly: {

            thisWeek,

            lastWeek,

            growth: weeklyGrowth

        },

        monthly: {

            thisMonth,

            lastMonth,

            growth: monthlyGrowth

        },

        summary

    };

}

module.exports = {

    getBusinessTrends

};