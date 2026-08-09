// ============================================================
// FORECAST ENGINE
// ============================================================
//
// Central orchestration layer.
//
// Each forecast is calculated here.
//
// Revenue is calculated ONCE.
// Cash is calculated ONCE.
// Inventory is calculated ONCE.
// Inventory Demand is calculated ONCE.
//
// Profit and Risk receive the already-calculated
// forecast objects.
//
// No child forecast service should call forecastEngine.
//
// The forecast services can be injected for testing.
// Production uses the real services automatically.
// ============================================================

const {
    getRevenueForecast: defaultGetRevenueForecast
} = require("./revenueForecastService");

const {
    getCashForecast: defaultGetCashForecast
} = require("./cashForecastService");

const {
    getInventoryForecast: defaultGetInventoryForecast
} = require("./inventoryForecastService");

const {
    getInventoryDemandForecast: defaultGetInventoryDemandForecast
} = require("./inventoryDemandForecastService");

const {
    getProfitForecast: defaultGetProfitForecast
} = require("./profitForecastService");

const {
    getRiskForecast: defaultGetRiskForecast
} = require("./riskForecastService");

// ============================================================
// BUILD FORECAST
// ============================================================

function buildForecast(
    userId,
    services = {}
) {

    // ========================================================
    // FORECAST SERVICES
    // ========================================================

    const getRevenueForecast =
        services.getRevenueForecast ||
        defaultGetRevenueForecast;

    const getCashForecast =
        services.getCashForecast ||
        defaultGetCashForecast;

    const getInventoryForecast =
        services.getInventoryForecast ||
        defaultGetInventoryForecast;

    const getInventoryDemandForecast =
        services.getInventoryDemandForecast ||
        defaultGetInventoryDemandForecast;

    const getProfitForecast =
        services.getProfitForecast ||
        defaultGetProfitForecast;

    const getRiskForecast =
        services.getRiskForecast ||
        defaultGetRiskForecast;


    // ========================================================
    // REVENUE
    // ========================================================

    const revenue =
        getRevenueForecast(
            userId
        );


    // ========================================================
    // CASH
    // ========================================================

    const cash =
        getCashForecast(
            userId
        );


    // ========================================================
    // INVENTORY
    // ========================================================

    const inventory =
        getInventoryForecast(
            userId
        );


    // ========================================================
    // INVENTORY DEMAND
    // ========================================================

    const inventoryDemand =
        getInventoryDemandForecast(
            userId
        );


    // ========================================================
    // PROFIT
    // ========================================================

    const profit =
        getProfitForecast(
            userId,
            revenue
        );


    // ========================================================
    // RISK
    // ========================================================

    const risks =
        getRiskForecast(
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