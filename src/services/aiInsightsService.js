const {
    getBusinessHealth
} = require("./financialAnalyticsService");

const {
    getBusinessKPIs
} = require("./businessKPIService");

const {
    getBusinessForecast
} = require("./businessForecastService");

const {
    getBusinessTrends
} = require("./businessTrendsService");

// ==========================
// AI CFO INSIGHTS
// ==========================
function getAIInsights(telegramId) {

    const health =
        getBusinessHealth(telegramId);

    const kpis =
        getBusinessKPIs(telegramId);

    const forecast =
        getBusinessForecast(telegramId);

    const trends =
        getBusinessTrends(telegramId);

    const strengths = [];

    const risks = [];

    const opportunities = [];

    // ==========================
    // STRENGTHS
    // ==========================
    if (kpis.grossMargin >= 50) {

        strengths.push(
            "Excellent gross profit margin."
        );

    }

    if (forecast.forecast30DaysRevenue > forecast.forecast7DaysRevenue) {

        strengths.push(
            "Revenue outlook remains positive."
        );

    }

    if (trends.monthly.growth > 0) {

        strengths.push(
            "Monthly sales are growing."
        );

    }

    // ==========================
    // RISKS
    // ==========================
    if (kpis.cashRatio < 0) {

        risks.push(
            "Cash position is negative."
        );

    }

    if (trends.monthly.growth < 0) {

        risks.push(
            "Monthly sales are declining."
        );

    }

    if (health.score < 70) {

        risks.push(
            "Overall business health requires attention."
        );

    }

    // ==========================
    // OPPORTUNITIES
    // ==========================
    if (trends.weekly.growth > 0) {

        opportunities.push(
            "Increase inventory to support growing demand."
        );

    }

    if (kpis.netMargin > 30) {

        opportunities.push(
            "Strong profitability creates room for expansion."
        );

    }

    // ==========================
    // PRIORITY ACTION
    // ==========================
    let priorityAction;

    if (kpis.cashRatio < 0) {

        priorityAction =
            "Improve cash flow by collecting receivables and reducing unnecessary expenses.";

    } else if (trends.monthly.growth < 0) {

        priorityAction =
            "Focus on increasing sales through promotions and customer retention.";

    } else {

        priorityAction =
            "Maintain current performance while planning for business growth.";

    }

    return {

        health,

        strengths,

        risks,

        opportunities,

        priorityAction,

        confidence: 92

    };

}

module.exports = {

    getAIInsights

};