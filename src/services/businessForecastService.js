const {
    buildForecast
} = require("./forecasting/forecastEngine");


// ==========================
// BUSINESS FORECAST
// ==========================
function getBusinessForecast(telegramId) {

    const forecast =
        buildForecast(
            telegramId
        );


    return {

        revenue:
            forecast.revenue,

        cash:
            forecast.cash,

        inventory:
            forecast.inventory,

        profit:
            forecast.profit,

        risks:
            forecast.risks

    };

}


// ==========================
// EXPORT
// ==========================
module.exports = {

    getBusinessForecast

};