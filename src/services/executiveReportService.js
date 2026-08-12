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
//
// Presentation-ready aggregation layer.
//
// IMPORTANT:
//
// This service does NOT calculate:
//
// - Revenue
// - Profit
// - Cash
// - Inventory
// - Risks
// - Decisions
// - Recommendations
// - Advisor intelligence
//
// Those responsibilities already belong to the
// underlying services and intelligence engines.
//
// This service simply assembles them into one
// Executive Report structure for:
//
// - Telegram
// - PDF export
// - Excel export
// - Web dashboard
// - Mobile app
// - Future AI CFO interface
// ==========================


// ============================================================
// EXECUTIVE SUMMARY FALLBACK
// ============================================================
//
// The Executive Summary must ALWAYS have the same structure:
//
// {
//     headline,
//     message,
//     status,
//     topPriority
// }
//
// Priority:
//
// 1. Forecast Engine executiveSummary
// 2. Advisor intelligence
// 3. Final safe fallback
//
// IMPORTANT:
//
// Never return a raw string from this function.
// ============================================================

function getExecutiveSummary(forecast) {

    // ========================================================
    // FORECAST ENGINE SUMMARY
    // ========================================================

    const forecastSummary =
        forecast?.executiveSummary;


    if (
        forecastSummary &&
        typeof forecastSummary === "object"
    ) {

        return {
            headline:
                forecastSummary.headline ||
                "Executive summary available.",

            message:
                forecastSummary.message ||
                "Business performance has been assessed.",

            status:
                forecastSummary.status ||
                "Unknown",

            topPriority:
                forecastSummary.topPriority ||
                "None"
        };
    }


    // ========================================================
    // ADVISOR FALLBACK
    // ========================================================
    //
    // If the Forecast Engine did not provide an executive
    // summary, use the Advisor Core assessment.
    //
    // IMPORTANT:
    //
    // Advisor fields are converted into the same
    // executiveSummary structure.
    // ========================================================

    const advisor =
        forecast?.advisor;


    if (
        advisor &&
        typeof advisor === "object"
    ) {

        const headline =
            advisor.headline ||
            "Business assessment available.";


        const message =
            advisor.assessment ||
            advisor.message ||
            "Business performance should continue to be monitored.";


        const status =
            advisor.businessStatus ||
            "Unknown";


        const topPriority =
            advisor.overallPriority ||
            "None";


        return {

            headline,

            message,

            status,

            topPriority
        };
    }


    // ========================================================
    // FINAL SAFE FALLBACK
    // ========================================================

    return {

        headline:
            "No executive summary available.",

        message:
            "No executive summary is currently available.",

        status:
            "Unknown",

        topPriority:
            "None"
    };
}


// ============================================================
// TOP DECISION
// ============================================================
//
// Returns the highest-scoring decision.
//
// Does not mutate the original array.
// ============================================================

function getTopDecision(decisions) {

    if (
        !Array.isArray(decisions) ||
        decisions.length === 0
    ) {

        return null;
    }


    return decisions.reduce(
        (top, current) => {

            if (!top) {

                return current;
            }


            const topScore =
                Number(top.score) || 0;


            const currentScore =
                Number(current.score) || 0;


            return currentScore > topScore
                ? current
                : top;

        },
        null
    );
}


// ============================================================
// TOP RECOMMENDATION
// ============================================================
//
// Returns the highest-scoring recommendation.
//
// Does not mutate the original array.
// ============================================================

function getTopRecommendation(
    recommendations
) {

    if (
        !Array.isArray(
            recommendations
        ) ||
        recommendations.length === 0
    ) {

        return null;
    }


    return recommendations.reduce(
        (top, current) => {

            if (!top) {

                return current;
            }


            const topScore =
                Number(top.score) || 0;


            const currentScore =
                Number(current.score) || 0;


            return currentScore > topScore
                ? current
                : top;

        },
        null
    );
}


// ============================================================
// EXECUTIVE REPORT
// ============================================================

function getExecutiveReport(
    telegramId
) {

    // ========================================================
    // CORE BUSINESS DATA
    // ========================================================

    const dashboard =
        analytics.getBusinessSnapshot(
            telegramId
        );


    const health =
        analytics.getBusinessHealth(
            telegramId
        );


    const kpis =
        kpiService.getBusinessKPIs(
            telegramId
        );


    const trends =
        trendService.getBusinessTrends(
            telegramId
        );


    const forecast =
        forecastService.getBusinessForecast(
            telegramId
        );


    const insights =
        insightsService.getBusinessInsights(
            telegramId
        );


    const profitLoss =
        profitLossService.getProfitLoss(
            telegramId
        );


    const cashFlow =
        cashFlowService.getCashFlow(
            telegramId
        );


    // ========================================================
    // ADVISOR INTELLIGENCE
    // ========================================================
    //
    // Advisor Core is already generated inside the
    // Forecast Engine.
    //
    // We expose it here instead of recalculating it.
    // ========================================================

    const advisor =
        forecast?.advisor || {

            businessStatus:
                "Unknown",

            overallPriority:
                "None",

            headline:
                "No advisor assessment available.",

            assessment:
                "No advisor assessment is currently available.",

            keyIssues: [],

            opportunities: [],

            recommendedActions: [],

            confidence: 0,

            sourceData: {

                risks: [],

                decisions: []

            }

        };


    // ========================================================
    // DECISIONS
    // ========================================================

    const decisions =
        Array.isArray(
            forecast?.decisions
        )
            ? [
                ...forecast.decisions
            ]
            : [];


    const topDecision =
        getTopDecision(
            decisions
        );


    // ========================================================
    // RECOMMENDATIONS
    // ========================================================

    const recommendations =
        Array.isArray(
            forecast?.recommendations
        )
            ? [
                ...forecast.recommendations
            ]
            : [];


    const topRecommendation =
        getTopRecommendation(
            recommendations
        );


    // ========================================================
    // RISKS
    // ========================================================

    const risks =
        Array.isArray(
            forecast?.risks
        )
            ? [
                ...forecast.risks
            ]
            : [];


    // ========================================================
    // EXECUTIVE SUMMARY
    // ========================================================
    //
    // ALWAYS returns a structured object.
    // ========================================================

    const executiveSummary =
        getExecutiveSummary(
            forecast
        );


    // ========================================================
    // RETURN EXECUTIVE REPORT
    // ========================================================

    return {

        // ====================================================
        // CORE REPORT SECTIONS
        // ====================================================

        dashboard,

        health,

        kpis,

        trends,

        forecast,

        insights,

        profitLoss,

        cashFlow,


        // ====================================================
        // ADVISOR INTELLIGENCE
        // ====================================================

        advisor,


        // ====================================================
        // DECISION INTELLIGENCE
        // ====================================================

        decisions,

        topDecision,


        // ====================================================
        // RECOMMENDATION INTELLIGENCE
        // ====================================================

        recommendations,

        topRecommendation,


        // ====================================================
        // RISK INTELLIGENCE
        // ====================================================

        risks,


        // ====================================================
        // EXECUTIVE SUMMARY
        // ====================================================

        executiveSummary

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getExecutiveReport

};