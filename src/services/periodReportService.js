const trendsRepository = require("../repositories/businessTrendsRepository");

// ==========================
// PERCENTAGE CHANGE
// ==========================
function percentageChange(current, previous) {

    if (previous === 0) {

        return current === 0 ? 0 : 100;

    }

    return ((current - previous) / previous) * 100;

}

// ==========================
// GET REPORT BY PERIOD
// ==========================
function getPeriodReport(telegramId, period) {

    const userId =
        trendsRepository.getUserId(telegramId);

    const reports = {

        daily: {

            title: "Daily",

            current: () => trendsRepository.getTodaySales(userId),

            previous: () => trendsRepository.getYesterdaySales(userId)

        },

        weekly: {

            title: "Weekly",

            current: () => trendsRepository.getThisWeekSales(userId),

            previous: () => trendsRepository.getLastWeekSales(userId)

        },

        monthly: {

            title: "Monthly",

            current: () => trendsRepository.getThisMonthSales(userId),

            previous: () => trendsRepository.getLastMonthSales(userId)

        }

    };

    const report = reports[period];

    if (!report) {

        throw new Error("Invalid report period.");

    }

    const current =
        report.current();

    const previous =
        report.previous();

    return {

        title:
            report.title,

        current,

        previous,

        growth:
            percentageChange(current, previous)

    };

}

module.exports = {

    getPeriodReport

};