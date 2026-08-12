const analytics =
    require("../financialAnalyticsService");

// ============================================================
// PROFIT TREND ENGINE
// ============================================================
//
// ACCOUNT-BASED INTELLIGENCE
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

function getProfitTrend(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    const snapshot =
        analytics.getBusinessSnapshot(
            accountId
        );


    let direction =
        "Stable";


    if (
        snapshot.netProfit > 0
    ) {

        direction =
            "Profitable";

    }


    if (
        snapshot.netProfit < 0
    ) {

        direction =
            "Loss";

    }


    return {

        profit:
            snapshot.netProfit,

        direction

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getProfitTrend

};