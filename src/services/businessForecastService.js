const {
    buildForecast
} = require("./forecasting/forecastEngine");

// ==========================
// BUSINESS FORECAST
// ==========================
//
// Central interface between the Forecast Engine and
// higher-level intelligence services.
//
// The Forecast Engine produces the complete business
// intelligence structure.
//
// This service exposes that structure through a stable
// interface for:
//
// - Decision Engine
// - AI Intelligence
// - AI Advisor
// - Telegram
// - Future Web Dashboard
// - Future Mobile App
//
// ==========================

function getBusinessForecast(
    telegramId
) {

    const forecast =
        buildForecast(
            telegramId
        );


    // ==================================================
    // PROJECTED REVENUE
    // ==================================================
    //
    // Revenue Forecast Engine returns:
    //
    // forecast.revenue.tomorrow
    //
    // Example:
    //
    // tomorrow = ₦46,200
    //
    // ==================================================

    const projectedRevenue =
        Number(
            forecast
                ?.revenue
                ?.tomorrow
        ) || 0;


    // ==================================================
    // PROJECTED PROFIT
    // ==================================================
    //
    // Profit Forecast Engine returns:
    //
    // forecast.profit.tomorrowProfit
    //
    // IMPORTANT:
    //
    // The property is "tomorrowProfit".
    //
    // It is NOT "tomorrowNetProfit".
    //
    // Example:
    //
    // tomorrowProfit = ₦12,384.29
    //
    // ==================================================

    const projectedProfit =
        Number(
            forecast
                ?.profit
                ?.tomorrowProfit
        ) || 0;


    // ==================================================
    // FORECAST CONFIDENCE
    // ==================================================

    const confidence =
        Number(
            forecast
                ?.revenue
                ?.confidence
        ) || 0;


    // ==================================================
    // RETURN COMPLETE BUSINESS FORECAST
    // ==================================================

    return {

        // ------------------------------------------------
        // CORE FORECASTS
        // ------------------------------------------------

        revenue:
            forecast.revenue,

        cash:
            forecast.cash,

        inventory:
            forecast.inventory,

        inventoryDemand:
            forecast.inventoryDemand,

        profit:
            forecast.profit,


        // ------------------------------------------------
        // NORMALIZED PROJECTED VALUES
        // ------------------------------------------------
        //
        // These values are consumed by:
        //
        // decisionEngine
        // aiIntelligenceService
        // future advisor services
        //
        // ------------------------------------------------

        projectedRevenue,

        projectedProfit,

        confidence,


        // ------------------------------------------------
        // RISK INTELLIGENCE
        // ------------------------------------------------

        risks:
            forecast.risks,


        // ------------------------------------------------
        // DECISIONS
        // ------------------------------------------------

        decisions:
            forecast.decisions,


        // ------------------------------------------------
        // EXECUTIVE SUMMARY
        // ------------------------------------------------

        executiveSummary:
            forecast.executiveSummary,


        // ------------------------------------------------
        // HISTORICAL SUPPORTING DATA
        // ------------------------------------------------

        expenseHistory:
            forecast.expenseHistory,

        cogsHistory:
            forecast.cogsHistory

    };

}


// ==========================
// EXPORT
// ==========================

module.exports = {

    getBusinessForecast

};