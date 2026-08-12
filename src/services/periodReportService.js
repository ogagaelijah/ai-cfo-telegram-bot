const trendsRepository =
    require("../repositories/businessTrendsRepository");

const accountContext =
    require("./accountContext");

// ==========================
// PERCENTAGE CHANGE
// ==========================

function percentageChange(
    current,
    previous
) {

    if (previous === 0) {

        return current === 0
            ? 0
            : 100;

    }

    return (
        (current - previous) /
        previous
    ) * 100;

}

// ==========================
// GET REPORT BY PERIOD
// ==========================

function getPeriodReport(
    telegramId,
    period
) {

    // ==================================================
    // CURRENT ACCOUNT
    // ==================================================

    const account =
        accountContext.requireAccount(
            telegramId
        );

    const accountId =
        account.accountId;

    // ==================================================
    // REPORT DEFINITIONS
    // ==================================================

    const reports = {

        daily: {

            title: "Daily",

            current: () =>
                trendsRepository.getTodaySales(
                    accountId
                ),

            previous: () =>
                trendsRepository.getYesterdaySales(
                    accountId
                )

        },

        weekly: {

            title: "Weekly",

            current: () =>
                trendsRepository.getThisWeekSales(
                    accountId
                ),

            previous: () =>
                trendsRepository.getLastWeekSales(
                    accountId
                )

        },

        monthly: {

            title: "Monthly",

            current: () =>
                trendsRepository.getThisMonthSales(
                    accountId
                ),

            previous: () =>
                trendsRepository.getLastMonthSales(
                    accountId
                )

        }

    };

    // ==================================================
    // VALIDATE PERIOD
    // ==================================================

    const report =
        reports[period];

    if (!report) {

        throw new Error(
            "Invalid report period."
        );

    }

    // ==================================================
    // CALCULATE REPORT
    // ==================================================

    const current =
        report.current();

    const previous =
        report.previous();

    return {

        title:
            report.title,

        current,

        previous,

        growth:
            percentageChange(
                current,
                previous
            )

    };

}

// ==========================
// EXPORTS
// ==========================

module.exports = {

    getPeriodReport

};