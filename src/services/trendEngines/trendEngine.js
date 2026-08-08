const revenueTrendEngine = require("./revenueTrendEngine");
const profitTrendEngine = require("./profitTrendEngine");
const cashTrendEngine = require("./cashTrendEngine");
const expenseTrendEngine = require("./expenseTrendEngine");
const inventoryTrendEngine = require("./inventoryTrendEngine");
const customerTrendEngine = require("./customerTrendEngine");

// ==========================
// AI CFO TREND ENGINE
// ==========================
function getBusinessTrends(telegramId) {

    return {

        revenue:
            revenueTrendEngine.getRevenueTrend(telegramId),

        profit:
            profitTrendEngine.getProfitTrend(telegramId),

        cash:
            cashTrendEngine.getCashTrend(telegramId),

        expenses:
            expenseTrendEngine.getExpenseTrend(telegramId),

        inventory:
            inventoryTrendEngine.getInventoryTrend(telegramId),

        customers:
            customerTrendEngine.getCustomerTrend(telegramId)

    };

}

module.exports = {

    getBusinessTrends

};