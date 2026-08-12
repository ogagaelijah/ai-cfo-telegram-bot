const {
    getRevenueForecast
} = require("./revenueForecastService");

const {
    getCashForecast
} = require("./cashForecastService");

const {
    getInventoryForecast
} = require("./inventoryForecastService");

const {
    getInventoryDemandForecast
} = require("./inventoryDemandForecastService");

const {
    getProfitForecast
} = require("./profitForecastService");

const {
    getRiskForecast
} = require("./riskForecastService");

const {
    getDecisionForecast
} = require("../intelligence/decisionEngine");

const {
    buildRecommendations
} = require("../intelligence/recommendationEngine");

const {
    getAdvisorAssessment
} = require("../intelligence/advisorCore");

const expenseRepository =
    require("../../repositories/expenseRepository");

const {
    getDailyCOGS
} = require("../../repositories/businessTrendsRepository");


// ============================================================
// FORECAST ENGINE
// ============================================================
//
// CENTRAL CFO INTELLIGENCE ORCHESTRATION LAYER
//
// Responsibilities:
//
// 1. Calculate independent forecasts.
// 2. Collect historical financial data.
// 3. Pass calculated intelligence to dependent engines.
// 4. Generate risks.
// 5. Generate decisions.
// 6. Generate recommendations.
// 7. Generate executive advisor assessment.
// 8. Return one structured business intelligence object.
//
// This engine is interface-independent.
//
// It is NOT tied to:
//
// - Telegram
// - Website
// - Mobile App
// - OpenAI
// - Any future AI provider
//
// ============================================================
//
// INTELLIGENCE FLOW:
//
//                    BUSINESS DATA
//                         │
//          ┌──────────────┼──────────────┐
//          ▼              ▼              ▼
//       Revenue          Cash         Inventory
//          │              │              │
//          └──────────────┼──────────────┘
//                         ▼
//                    Profit Engine
//                         │
//                         ▼
//                    Risk Engine
//                         │
//                         ▼
//                   Decision Engine
//                         │
//                         ▼
//                Recommendation Engine
//                         │
//                         ▼
//                    Advisor Core
//                         │
//                         ▼
//              COMPLETE CFO INTELLIGENCE
//
// ============================================================


function buildForecast(
    userId,
    services = {}
) {

    // ========================================================
    // FORECAST SERVICES
    // ========================================================

    const revenueService =
        services.getRevenueForecast ||
        getRevenueForecast;


    const cashService =
        services.getCashForecast ||
        getCashForecast;


    const inventoryService =
        services.getInventoryForecast ||
        getInventoryForecast;


    const inventoryDemandService =
        services.getInventoryDemandForecast ||
        getInventoryDemandForecast;


    const profitService =
        services.getProfitForecast ||
        getProfitForecast;


    const riskService =
        services.getRiskForecast ||
        getRiskForecast;


    // ========================================================
    // DATA SERVICES
    // ========================================================

    const getExpenseHistory =
        services.getExpenseHistory ||
        expenseRepository.getDailyHistory;


    const getCOGSHistory =
        services.getDailyCOGS ||
        getDailyCOGS;


    // ========================================================
    // REVENUE FORECAST
    // ========================================================

    const revenue =
        revenueService(
            userId
        );


    // ========================================================
    // CASH FORECAST
    // ========================================================

    const cash =
        cashService(
            userId
        );


    // ========================================================
    // INVENTORY FORECAST
    // ========================================================

    const inventory =
        inventoryService(
            userId
        );


    // ========================================================
    // INVENTORY DEMAND FORECAST
    // ========================================================

    const inventoryDemand =
        inventoryDemandService(
            userId
        );


    // ========================================================
    // EXPENSE HISTORY
    // ========================================================

    const expenseHistory =
        getExpenseHistory(
            userId
        );


    // ========================================================
    // COGS HISTORY
    // ========================================================

    const cogsHistory =
        getCOGSHistory(
            userId
        );


    // ========================================================
    // PROFIT FORECAST
    // ========================================================

    const profit =
        profitService(
            revenue,
            expenseHistory,
            cogsHistory
        );


    // ========================================================
    // RISK FORECAST
    // ========================================================

    const risks =
        riskService(
            userId,
            revenue,
            cash,
            inventory,
            inventoryDemand,
            profit
        );


    // ========================================================
    // DECISION FORECAST
    // ========================================================
    //
    // The Decision Engine interprets risks and produces:
    //
    // - decisions
    // - topDecision
    // - executiveSummary
    // - decision counts
    // - priority groups
    //
    // IMPORTANT:
    //
    // We intentionally preserve the COMPLETE decision
    // forecast internally, but expose the stable public
    // structure expected by the existing Forecast Engine
    // contract.
    //
    // ========================================================

    const decisionForecast =
        getDecisionForecast({
            risks
        });


    const decisions =
        Array.isArray(
            decisionForecast?.decisions
        )
            ? decisionForecast.decisions
            : [];


    // ========================================================
    // EXECUTIVE SUMMARY
    // ========================================================

    const executiveSummary =
        decisionForecast?.executiveSummary || {

            headline:
                "No immediate business decisions are required.",

            message:
                "Current forecasts do not indicate significant conditions requiring immediate management action.",

            status:
                "Healthy",

            topPriority:
                "Maintain Current Operations"

        };


    // ========================================================
    // RECOMMENDATION ENGINE
    // ========================================================
    //
    // Recommendations convert business decisions into
    // structured management actions.
    //
    // ========================================================

    const recommendations =
        buildRecommendations(
            decisions
        );


    // ========================================================
    // ADVISOR CORE
    // ========================================================
    //
    // Advisor Core interprets the complete intelligence
    // produced above.
    //
    // ========================================================

    const intelligence = {

        revenue,

        cash,

        inventory,

        inventoryDemand,

        profit,

        expenseHistory,

        cogsHistory,

        risks,

        decisions,

        recommendations,

        executiveSummary

    };


    const advisor =
        getAdvisorAssessment(
            intelligence
        );


    // ========================================================
    // COMPLETE CFO INTELLIGENCE
    // ========================================================
    //
    // This is the central structured intelligence payload
    // for the entire application.
    //
    // IMPORTANT:
    //
    // Do NOT add the entire decisionForecast object here.
    //
    // The existing Forecast Engine contract exposes:
    //
    // decisions
    //
    // and
    //
    // executiveSummary
    //
    // separately.
    //
    // This keeps existing consumers and tests compatible
    // while the Decision Engine itself can continue to
    // provide its richer internal structure.
    //
    // ========================================================

    return {

        // ----------------------------------------------------
        // CORE FORECASTS
        // ----------------------------------------------------

        revenue,

        cash,

        inventory,

        inventoryDemand,

        profit,


        // ----------------------------------------------------
        // HISTORICAL SUPPORTING DATA
        // ----------------------------------------------------

        expenseHistory,

        cogsHistory,


        // ----------------------------------------------------
        // INTELLIGENCE
        // ----------------------------------------------------

        risks,

        decisions,

        recommendations,

        executiveSummary,


        // ----------------------------------------------------
        // ADVISOR CORE
        // ----------------------------------------------------

        advisor

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    buildForecast

};