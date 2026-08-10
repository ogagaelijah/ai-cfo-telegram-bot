const analytics =
    require("./financialAnalyticsService");

const trends =
    require("./businessTrendsService");

const insights =
    require("./businessInsightsService");

const recommendations =
    require("./businessRecommendationService");

const alerts =
    require("./businessAlertService");

const priority =
    require("./businessAlertPriorityService");

const summary =
    require("./businessAlertSummaryService");

const businessForecast =
    require("./businessForecastService");

// ==========================
// BUILD BUSINESS REPORT
// ==========================
//
// This service builds the complete business report.
//
// IMPORTANT:
//
// The centralized Forecast Engine is now the source
// of forecast-based decisions.
//
// We DO NOT call the legacy:
//
//     decisionEngine.generateDecision()
//
// here anymore.
//
// Forecast flow:
//
// Business Data
//      ↓
// Forecast Engine
//      ↓
// Revenue / Cash / Inventory / Profit
//      ↓
// Risk Engine
//      ↓
// Central Decision Engine
//      ↓
// Business Report
//
// This prevents two different decision engines from
// producing conflicting intelligence.
// ==========================

function buildBusinessReport(
    telegramId
) {

    // ==========================
    // FINANCIAL SNAPSHOT
    // ==========================

    const snapshot =
        analytics.getBusinessSnapshot(
            telegramId
        );


    // ==========================
    // CASH
    // ==========================

    const cash =
        analytics.getCashMetrics(
            telegramId
        );


    // ==========================
    // DEBT
    // ==========================

    const debt =
        analytics.getDebtMetrics(
            telegramId
        );


    // ==========================
    // BUSINESS HEALTH
    // ==========================

    const health =
        analytics.getBusinessHealth(
            telegramId
        );


    // ==========================
    // HISTORICAL TRENDS
    // ==========================

    const trend =
        trends.getBusinessTrends(
            telegramId
        );


    // ==========================
    // BUSINESS INSIGHTS
    // ==========================

    const insight =
        insights.getBusinessInsights(
            telegramId
        );


    // ==========================
    // RECOMMENDATIONS
    // ==========================

    const recommendation =
        recommendations.getBusinessRecommendations(
            telegramId
        );


    // ==========================
    // BUSINESS ALERTS
    // ==========================

    const businessAlerts =
        alerts.getBusinessAlerts(
            telegramId
        );


    // ==========================
    // PRIORITIZE ALERTS
    // ==========================

    const prioritizedAlerts =
        priority.prioritizeAlerts(
            businessAlerts
        );


    // ==========================
    // ALERT SUMMARY
    // ==========================

    const alertSummary =
        summary.getAlertSummary(
            prioritizedAlerts
        );


    // ==========================
    // CENTRAL BUSINESS FORECAST
    // ==========================
    //
    // This calls:
    //
    // businessForecastService
    //        ↓
    // forecastEngine
    //        ↓
    // revenue forecast
    // cash forecast
    // inventory forecast
    // inventory demand forecast
    // profit forecast
    // risk forecast
    // decision engine
    //
    // The decision object returned here is therefore
    // produced by the centralized intelligence pipeline.
    // ==========================

    const forecast =
        businessForecast.getBusinessForecast(
            telegramId
        );


    // ==========================
    // CENTRAL DECISION INTELLIGENCE
    // ==========================
    //
    // forecast.decisions contains the decisions created
    // by:
    //
    // riskForecastService
    //        ↓
    // intelligence/decisionEngine
    //
    // forecast.executiveSummary contains the overall
    // management-level summary.
    // ==========================

    const decision = {

        executiveSummary:
            forecast.executiveSummary,

        totalDecisions:
            Array.isArray(
                forecast.decisions
            )
                ? forecast.decisions.length
                : 0,

        decisions:
            Array.isArray(
                forecast.decisions
            )
                ? forecast.decisions
                : []

    };


    // ==========================
    // RETURN COMPLETE REPORT
    // ==========================

    return {

        telegramId,

        generatedAt:
            new Date(),


        // ======================
        // FINANCIAL DATA
        // ======================

        snapshot,

        cash,

        debt,

        health,


        // ======================
        // HISTORICAL INTELLIGENCE
        // ======================

        trends:
            trend,

        insights:
            insight,

        recommendations:
            recommendation,


        // ======================
        // ALERT INTELLIGENCE
        // ======================

        alerts:
            prioritizedAlerts,

        alertSummary,


        // ======================
        // CENTRAL FORECAST
        // ======================

        forecast,


        // ======================
        // CENTRAL DECISIONS
        // ======================

        decision

    };
}


// ==========================
// EXPORT
// ==========================

module.exports = {

    buildBusinessReport

};