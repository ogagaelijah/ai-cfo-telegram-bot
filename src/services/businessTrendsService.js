const trendsRepository = require("../repositories/businessTrendsRepository");

// ==========================
// PERCENTAGE CHANGE
// ==========================
function percentageChange(current, previous) {

    if (previous === 0) {

        if (current === 0) {
            return 0;
        }

        return 100;
    }

    return ((current - previous) / previous) * 100;

}

// ==========================
// SALES TRENDS
// ==========================
function getSalesTrends(telegramId) {

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

    return {

        today,

        yesterday,

        todayChange:
            percentageChange(today, yesterday),

        thisWeek,

        lastWeek,

        weekChange:
            percentageChange(thisWeek, lastWeek),

        thisMonth,

        lastMonth,

        monthChange:
            percentageChange(thisMonth, lastMonth)

    };

}

module.exports = {

    getSalesTrends

};