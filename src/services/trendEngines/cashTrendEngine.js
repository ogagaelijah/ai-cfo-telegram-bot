const analytics =
    require("../financialAnalyticsService");

// ============================================================
// CASH TREND ENGINE
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

function getCashTrend(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    const cash =
        analytics.getCashMetrics(
            accountId
        );


    let direction =
        "Stable";


    if (
        cash.cashPosition > 0
    ) {

        direction =
            "Healthy";

    }


    if (
        cash.cashPosition < 0
    ) {

        direction =
            "Declining";

    }


    return {

        cash:
            cash.cashPosition,

        direction

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getCashTrend

};