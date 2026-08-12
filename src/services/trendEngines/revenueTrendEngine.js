const trendsRepository =
    require("../../repositories/businessTrendsRepository");

// ============================================================
// REVENUE TREND ENGINE
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

function getRevenueTrend(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    const current =
        trendsRepository.getThisMonthSales(
            accountId
        );


    const previous =
        trendsRepository.getLastMonthSales(
            accountId
        );


    let percentage = 0;


    if (previous > 0) {

        percentage =
            (
                (current - previous) /
                previous
            ) * 100;

    }


    let direction =
        "Stable";


    if (percentage > 5) {

        direction =
            "Growing";

    }
    else if (percentage < -5) {

        direction =
            "Declining";

    }


    return {

        current,

        previous,

        percentage,

        direction

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getRevenueTrend

};