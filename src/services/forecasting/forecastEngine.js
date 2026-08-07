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

// ==========================
// BUILD FORECAST ENGINE
// ==========================
function buildForecast(userId) {

    return {

        revenue:
            getRevenueForecast(userId),

        cash:
            getCashForecast(userId),

        inventory:
            getInventoryForecast(userId),

        profit:
            getProfitForecast(userId),

        risks:
            getRiskForecast(userId)

    };

}

module.exports = {

    buildForecast

};