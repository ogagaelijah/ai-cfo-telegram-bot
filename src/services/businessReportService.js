const analytics = require("./financialAnalyticsService");

const trends = require("./businessTrendsService");

const insights = require("./businessInsightsService");

const recommendations = require("./businessRecommendationService");

const alerts = require("./businessAlertService");

const priority = require("./businessAlertPriorityService");

const summary = require("./businessAlertSummaryService");

// ==========================
// BUILD BUSINESS REPORT
// ==========================
function buildBusinessReport(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    const cash =
        analytics.getCashMetrics(telegramId);

    const debt =
        analytics.getDebtMetrics(telegramId);

    const health =
        analytics.getBusinessHealth(telegramId);

    const trend =
        trends.getBusinessTrends(telegramId);

    const insight =
        insights.getBusinessInsights(telegramId);

    const recommendation =
        recommendations.getBusinessRecommendations(telegramId);

    const businessAlerts =
        alerts.getBusinessAlerts(telegramId);

    const prioritizedAlerts =
        priority.prioritizeAlerts(businessAlerts);

    const alertSummary =
        summary.getAlertSummary(prioritizedAlerts);

    return {

        generatedAt: new Date(),

        snapshot,

        cash,

        debt,

        health,

        trends: trend,

        insights: insight,

        recommendations: recommendation,

        alerts: prioritizedAlerts,

        alertSummary

    };

}

module.exports = {

    buildBusinessReport

};