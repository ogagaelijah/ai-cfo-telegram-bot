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
// 2. Collect the historical data required by downstream
//    forecast services.
// 3. Pass already-calculated results into dependent services.
//
// Important:
//
// Forecast services should not unnecessarily calculate
// other forecasts again.
//
// Example:
//
// Revenue Forecast
//      ↓
// Profit Forecast
//
// Expense History
//      ↓
// Profit Forecast
//
// COGS History
//      ↓
// Profit Forecast
//
// Revenue + Cash + Inventory + Demand
//      ↓
// Risk Forecast
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
    // REVENUE
    // ========================================================

    const revenue =
        revenueService(
            userId
        );


    // ========================================================
    // CASH
    // ========================================================

    const cash =
        cashService(
            userId
        );


    // ========================================================
    // INVENTORY
    // ========================================================

    const inventory =
        inventoryService(
            userId
        );


    // ========================================================
    // INVENTORY DEMAND
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
        expenseRepository.getDailyHistory(
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
    // getDailyCOGS() returns data such as:
    //
    // {
    //     date: "2026-08-04",
    //     revenue: 85600,
    //     costOfGoods: 58800
    // }
    //
    // ========================================================

    const cogsHistory =
        getDailyCOGS(
            userId
        );


    // ========================================================
    // PROFIT
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
    // RISK
    // ========================================================
    //
    // Risk receives the already-calculated forecast objects.
    //
    // ========================================================

    const risks =
        riskService(
            userId,
            revenue,
            cash,
            inventory,
            inventoryDemand
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