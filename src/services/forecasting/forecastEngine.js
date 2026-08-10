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
// 4. Return one structured business intelligence object.
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
// Future interfaces can consume this same structure.
//
// ============================================================
//
// FLOW:
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
//          ┌──────────────┼──────────────┐
//          ▼              ▼              ▼
//        Risks        Decisions      Scenarios
//          │              │              │
//          └──────────────┼──────────────┘
//                         ▼
//                    Advisor Core
//                         │
//          ┌──────────────┼──────────────┐
//          ▼              ▼              ▼
//       Telegram       Website        Mobile
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
    //
    // These are injectable for testing.
    //
    // Production:
    //
    //     expenseRepository.getDailyHistory()
    //
    //     getDailyCOGS()
    //
    // Tests:
    //
    //     services.getExpenseHistory()
    //
    //     services.getDailyCOGS()
    //
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
    //
    // This history serves two purposes:
    //
    // 1. Profit forecasting.
    // 2. Future scenario analysis.
    //
    // Daily history intentionally contains zero-expense
    // calendar days.
    //
    // Example:
    //
    // [
    //     { date: "2026-08-01", expenses: 50000 },
    //     { date: "2026-08-02", expenses: 0 },
    //     { date: "2026-08-03", expenses: 30000 }
    // ]
    //
    // ========================================================

    const expenseHistory =
        getExpenseHistory(
            userId
        );


    // ========================================================
    // COGS HISTORY
    // ========================================================
    //
    // COGS represents the cost of products actually sold.
    //
    // It is NOT the same as inventory purchases.
    //
    // ========================================================

    const cogsHistory =
        getCOGSHistory(
            userId
        );


    // ========================================================
    // PROFIT FORECAST
    // ========================================================
    //
    // Profit receives:
    //
    // 1. Revenue forecast.
    // 2. Operating expense history.
    // 3. COGS history.
    //
    // Revenue is not recalculated here.
    //
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
    //
    // Risk receives already-calculated intelligence.
    //
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
    // Decisions interpret the risks.
    //
    // ========================================================

    const decisionForecast =
        getDecisionForecast({
            risks
        });


    // ========================================================
    // COMPLETE FORECAST
    // ========================================================
    //
    // This is the central structured CFO intelligence
    // payload.
    //
    // Future interfaces should consume this object rather
    // than directly accessing individual repositories.
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
        //
        // Exposing expense history here allows the Scenario
        // Engine and future intelligence services to work
        // from the same structured financial context.
        //
        // ----------------------------------------------------

        expenseHistory,

        cogsHistory,


        // ----------------------------------------------------
        // INTELLIGENCE
        // ----------------------------------------------------

        risks,

        decisions:
            decisionForecast.decisions,

        executiveSummary:
            decisionForecast.executiveSummary

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    buildForecast

};