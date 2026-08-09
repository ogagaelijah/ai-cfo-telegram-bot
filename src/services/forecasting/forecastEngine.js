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


// ============================================================
// FORECAST ENGINE
// ============================================================
//
// Central orchestration layer.
//
// Production:
//
//     buildForecast(userId)
//
// uses the real forecast services.
//
// Tests:
//
//     buildForecast(userId, mockServices)
//
// can inject mocked services.
//
// This keeps the forecast engines independent while allowing
// the orchestration layer to be tested safely.
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
    // PROFIT
    // ========================================================
    //
    // Profit receives the already-calculated revenue forecast.
    //
    // Revenue is NOT calculated again.
    //
    // ========================================================

    const profit =
        profitService(
            userId,
            revenue
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