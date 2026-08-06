const {
    getCashMetrics
} = require("./financialAnalyticsService");

const {
    getAverageDailySales,
    getAverageDailyExpenses
} = require("../repositories/businessTrendsRepository");

// ==========================
// BUSINESS FORECAST
// ==========================
function getBusinessForecast(telegramId) {

    const cash =
        getCashMetrics(telegramId);

    const averageDailySales =
        getAverageDailySales(telegramId);

    const averageDailyExpenses =
        getAverageDailyExpenses(telegramId);

    const forecast7DaysRevenue =
        averageDailySales * 7;

    const forecast30DaysRevenue =
        averageDailySales * 30;

    const forecast7DaysExpenses =
        averageDailyExpenses * 7;

    const forecast30DaysExpenses =
        averageDailyExpenses * 30;

    const forecast7DaysCash =
        cash.cashPosition +
        forecast7DaysRevenue -
        forecast7DaysExpenses;

    const forecast30DaysCash =
        cash.cashPosition +
        forecast30DaysRevenue -
        forecast30DaysExpenses;

    return {

        averageDailySales,

        averageDailyExpenses,

        forecast7DaysRevenue,

        forecast30DaysRevenue,

        forecast7DaysExpenses,

        forecast30DaysExpenses,

        forecast7DaysCash,

        forecast30DaysCash

    };

}

module.exports = {

    getBusinessForecast

};