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
//
// Profit and Risk receive the already-calculated
// forecast objects.
//
// No child forecast service should call forecastEngine.
//
// ============================================================

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
    getProfitForecast
} = require("./profitForecastService");

const {
    getRiskForecast
} = require("./riskForecastService");


// ============================================================
// BUILD FORECAST
// ============================================================

function buildForecast(userId) {

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
            inventory
        );


    // ========================================================
    // COMPLETE FORECAST
    // ========================================================

    return {

        revenue,

        cash,

        inventory,

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