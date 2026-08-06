const analytics = require("./financialAnalyticsService");
const kpiService = require("./businessKPIService");
const trendService = require("./businessTrendsService");
const forecastService = require("./businessForecastService");
const insightsService = require("./businessInsightsService");
const profitLossService = require("./profitLossService");
const cashFlowService = require("./cashFlowService");

// ==========================
// EXECUTIVE REPORT
// ==========================
function getExecutiveReport(telegramId) {

    return {

        dashboard:
            analytics.getBusinessSnapshot(telegramId),

        health:
            analytics.getBusinessHealth(telegramId),

        kpis:
            kpiService.getBusinessKPIs(telegramId),

        trends:
            trendService.getBusinessTrends(telegramId),

        forecast:
            forecastService.getBusinessForecast(telegramId),

        insights:
            insightsService.getBusinessInsights(telegramId),

        profitLoss:
            profitLossService.getProfitLoss(telegramId),

        cashFlow:
            cashFlowService.getCashFlow(telegramId)

    };

}

module.exports = {

    getExecutiveReport

};