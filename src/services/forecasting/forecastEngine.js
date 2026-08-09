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

const expenseRepository =
    require("../../repositories/expenseRepository");

const {
    getDailyCOGS
} = require("../../repositories/businessTrendsRepository");


// ============================================================
// FORECAST ENGINE
// ============================================================
//
// Central orchestration layer.
//
// Responsibilities:
//
// 1. Calculate each independent forecast.
// 2. Collect historical data required by dependent
//    forecast services.
// 3. Pass already-calculated forecast objects into
//    downstream services.
//
// Dependency injection is supported for:
//     - Forecast services
//     - Expense history
//     - COGS history
//
// This keeps the engine easy to test without requiring
// real database users or SQLite data.
//
// FLOW:
//
// Revenue Forecast
//      │
//      ├───────────────┐
//      │               │
//      ▼               ▼
// Profit Forecast   Risk Forecast
//
// Cash Forecast ────────────┐
//                            │
// Inventory Forecast ────────┤
//                            ▼
// Inventory Demand ───────► Risk Forecast
//
// Expense History ───────► Profit Forecast
//
// COGS History ──────────► Profit Forecast
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
    // In production:
    //
    //     expenseRepository.getDailyHistory()
    //
    //     getDailyCOGS()
    //
    // In tests:
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
    // Profit Forecast needs historical operating
    // expense data.
    //
    // getDailyHistory() intentionally includes
    // zero-expense calendar days.
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
    // COGS comes from products actually sold.
    //
    // This is NOT the same as inventory purchases.
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
    // 1. Already-calculated revenue forecast.
    // 2. Complete operating expense history.
    // 3. Historical COGS history.
    //
    // Revenue is NOT calculated again.
    //
    // COGS is NOT calculated again.
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
    // Risk receives ALL already-calculated forecast
    // objects, including PROFIT.
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
    // COMPLETE FORECAST
    // ========================================================

    return {

        revenue,

        cash,

        inventory,

        inventoryDemand,

        profit,

        risks

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    buildForecast

};