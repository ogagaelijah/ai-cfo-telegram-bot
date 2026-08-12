const revenueTrendEngine =
    require("./revenueTrendEngine");

const profitTrendEngine =
    require("./profitTrendEngine");

const cashTrendEngine =
    require("./cashTrendEngine");

const expenseTrendEngine =
    require("./expenseTrendEngine");

const inventoryTrendEngine =
    require("./inventoryTrendEngine");

const customerTrendEngine =
    require("./customerTrendEngine");


// ============================================================
// AI CFO TREND ENGINE
// ============================================================
//
// ACCOUNT-BASED INTELLIGENCE LAYER
//
// Receives accountId directly.
//
// It does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - Sessions
//
// ============================================================

function getBusinessTrends(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    return {

        revenue:
            revenueTrendEngine.getRevenueTrend(
                accountId
            ),


        profit:
            profitTrendEngine.getProfitTrend(
                accountId
            ),


        cash:
            cashTrendEngine.getCashTrend(
                accountId
            ),


        expenses:
            expenseTrendEngine.getExpenseTrend(
                accountId
            ),


        inventory:
            inventoryTrendEngine.getInventoryTrend(
                accountId
            ),


        customers:
            customerTrendEngine.getCustomerTrend(
                accountId
            )

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getBusinessTrends

};