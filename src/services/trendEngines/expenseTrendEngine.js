const analytics =
    require("../financialAnalyticsService");

// ============================================================
// EXPENSE TREND ENGINE
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

function getExpenseTrend(accountId) {

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
        snapshot.expenses >
        snapshot.sales * 0.50
    ) {

        direction =
            "High";

    }


    return {

        expenses:
            snapshot.expenses,

        direction

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getExpenseTrend

};