// ============================================================
// PROFIT FORECAST SERVICE
// ============================================================
//
// Responsibilities:
//
// 1. Calculate gross profit.
// 2. Calculate net profit.
// 3. Calculate gross margin.
// 4. Calculate net profit margin.
// 5. Calculate average daily COGS.
// 6. Calculate COGS / revenue ratio.
// 7. Calculate average daily operating expenses.
// 8. Forecast future COGS based on historical COGS ratio.
// 9. Forecast future profit from:
//
//      Revenue
//          ↓
//      COGS
//          ↓
//      Gross Profit
//          ↓
//      Operating Expenses
//          ↓
//      Net Profit
//
// IMPORTANT:
//
// This service does NOT call getRevenueForecast().
//
// Revenue forecasting is handled separately by the Revenue
// Forecast Service and passed into getProfitForecast().
//
// ============================================================


// ============================================================
// NUMBER SAFETY
// ============================================================

function toNumber(
    value
) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// CALCULATE GROSS PROFIT
// ============================================================
//
// Gross Profit:
//
// Revenue - Cost of Goods Sold
//
// ============================================================

function calculateGrossProfit(
    revenue,
    costOfGoods
) {

    const totalRevenue =
        toNumber(
            revenue
        );

    const totalCOGS =
        toNumber(
            costOfGoods
        );

    return (
        totalRevenue -
        totalCOGS
    );
}


// ============================================================
// CALCULATE NET PROFIT
// ============================================================
//
// Net Profit:
//
// Revenue
// - COGS
// - Operating Expenses
//
// ============================================================

function calculateProfit(
    revenue,
    costOfGoods,
    expenses
) {

    const totalRevenue =
        toNumber(
            revenue
        );

    const totalCOGS =
        toNumber(
            costOfGoods
        );

    const totalExpenses =
        toNumber(
            expenses
        );

    return (
        totalRevenue -
        totalCOGS -
        totalExpenses
    );
}


// ============================================================
// CALCULATE GROSS MARGIN
// ============================================================

function calculateGrossMargin(
    revenue,
    grossProfit
) {

    const totalRevenue =
        toNumber(
            revenue
        );

    const totalGrossProfit =
        toNumber(
            grossProfit
        );

    if (
        totalRevenue <= 0
    ) {

        return 0;
    }

    return (
        totalGrossProfit /
        totalRevenue
    ) * 100;
}


// ============================================================
// CALCULATE NET PROFIT MARGIN
// ============================================================

function calculateProfitMargin(
    revenue,
    profit
) {

    const totalRevenue =
        toNumber(
            revenue
        );

    const totalProfit =
        toNumber(
            profit
        );

    if (
        totalRevenue <= 0
    ) {

        return 0;
    }

    return (
        totalProfit /
        totalRevenue
    ) * 100;
}


// ============================================================
// CALCULATE AVERAGE DAILY EXPENSES
// ============================================================
//
// The expense history should contain calendar days,
// including zero-expense days.
//
// ============================================================

function calculateAverageDailyExpenses(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }

    const expenses =
        history.map(
            day =>
                toNumber(
                    day?.expenses
                )
        );

    const total =
        expenses.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        );

    return (
        total /
        expenses.length
    );
}


// ============================================================
// CALCULATE DAILY COGS
// ============================================================
//
// COGS comes from products actually sold.
//
// Expected field:
//
//     costOfGoods
//
// ============================================================

function calculateDailyCOGS(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }

    const cogs =
        history.map(
            day =>
                toNumber(
                    day?.costOfGoods
                )
        );

    const total =
        cogs.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        );

    return (
        total /
        history.length
    );
}


// ============================================================
// CALCULATE AVERAGE DAILY COGS
// ============================================================

function calculateAverageDailyCOGS(
    history
) {

    return calculateDailyCOGS(
        history
    );
}


// ============================================================
// CALCULATE COGS / REVENUE RATIO
// ============================================================
//
// This is the important intelligence upgrade.
//
// Example:
//
// Revenue = ₦300,000
// COGS    = ₦120,000
//
// COGS Ratio:
//
// 120,000 / 300,000
// = 0.40
// = 40%
//
// We calculate the ratio from TOTAL historical revenue
// and TOTAL historical COGS rather than averaging daily
// percentages.
//
// This prevents small days from disproportionately
// affecting the ratio.
//
// Only days with positive revenue are included.
//
// ============================================================

function calculateCOGSRevenueRatio(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }


    let totalRevenue = 0;

    let totalCOGS = 0;


    history.forEach(
        day => {

            const revenue =
                toNumber(
                    day?.revenue
                );

            const costOfGoods =
                toNumber(
                    day?.costOfGoods
                );


            // Ignore days with no revenue because
            // they cannot provide a meaningful
            // COGS/revenue ratio.

            if (
                revenue <= 0
            ) {

                return;
            }


            totalRevenue +=
                revenue;

            totalCOGS +=
                costOfGoods;

        }
    );


    if (
        totalRevenue <= 0
    ) {

        return 0;
    }


    return (
        totalCOGS /
        totalRevenue
    );
}


// ============================================================
// FORECAST PROFIT
// ============================================================

function getProfitForecast(
    revenueForecast,
    expenseHistory,
    cogsHistory
) {

    // ========================================================
    // SAFETY
    // ========================================================

    const revenue =
        revenueForecast || {};


    const expenses =
        Array.isArray(
            expenseHistory
        )
            ? expenseHistory
            : [];


    const cogs =
        Array.isArray(
            cogsHistory
        )
            ? cogsHistory
            : [];


    // ========================================================
    // AVERAGE DAILY OPERATING EXPENSES
    // ========================================================

    const averageDailyExpenses =
        calculateAverageDailyExpenses(
            expenses
        );


    // ========================================================
    // AVERAGE DAILY COGS
    // ========================================================

    const averageDailyCOGS =
        calculateAverageDailyCOGS(
            cogs
        );


    // ========================================================
    // COGS / REVENUE RATIO
    // ========================================================

    const cogsRevenueRatio =
        calculateCOGSRevenueRatio(
            cogs
        );


    // ========================================================
    // FORECAST REVENUE
    // ========================================================

    const tomorrowRevenue =
        toNumber(
            revenue.tomorrow
        );


    const next7DaysRevenue =
        toNumber(
            revenue.next7Days
        );


    const next30DaysRevenue =
        toNumber(
            revenue.next30Days
        );


    // ========================================================
    // FORECAST COGS
    // ========================================================
    //
    // PRIMARY METHOD:
    //
    // Forecast Revenue × Historical COGS Ratio
    //
    // FALLBACK:
    //
    // If there is no usable revenue history,
    // use the historical average daily COGS.
    //
    // This prevents the forecast from producing
    // zero COGS simply because historical revenue
    // data is unavailable.
    //
    // ========================================================

    const tomorrowCOGS =
        cogsRevenueRatio > 0
            ? tomorrowRevenue *
                cogsRevenueRatio
            : averageDailyCOGS;


    const next7DaysCOGS =
        cogsRevenueRatio > 0
            ? next7DaysRevenue *
                cogsRevenueRatio
            : averageDailyCOGS * 7;


    const next30DaysCOGS =
        cogsRevenueRatio > 0
            ? next30DaysRevenue *
                cogsRevenueRatio
            : averageDailyCOGS * 30;


    // ========================================================
    // GROSS PROFIT
    // ========================================================

    const tomorrowGrossProfit =
        calculateGrossProfit(
            tomorrowRevenue,
            tomorrowCOGS
        );


    const next7DaysGrossProfit =
        calculateGrossProfit(
            next7DaysRevenue,
            next7DaysCOGS
        );


    const next30DaysGrossProfit =
        calculateGrossProfit(
            next30DaysRevenue,
            next30DaysCOGS
        );


    // ========================================================
    // GROSS MARGINS
    // ========================================================

    const tomorrowGrossMargin =
        calculateGrossMargin(
            tomorrowRevenue,
            tomorrowGrossProfit
        );


    const next7DaysGrossMargin =
        calculateGrossMargin(
            next7DaysRevenue,
            next7DaysGrossProfit
        );


    const next30DaysGrossMargin =
        calculateGrossMargin(
            next30DaysRevenue,
            next30DaysGrossProfit
        );


    // ========================================================
    // FORECAST OPERATING EXPENSES
    // ========================================================

    const tomorrowExpenses =
        averageDailyExpenses;


    const next7DaysExpenses =
        averageDailyExpenses *
        7;


    const next30DaysExpenses =
        averageDailyExpenses *
        30;


    // ========================================================
    // NET PROFIT
    // ========================================================

    const tomorrowProfit =
        calculateProfit(
            tomorrowRevenue,
            tomorrowCOGS,
            tomorrowExpenses
        );


    const next7DaysProfit =
        calculateProfit(
            next7DaysRevenue,
            next7DaysCOGS,
            next7DaysExpenses
        );


    const next30DaysProfit =
        calculateProfit(
            next30DaysRevenue,
            next30DaysCOGS,
            next30DaysExpenses
        );


    // ========================================================
    // NET PROFIT MARGINS
    // ========================================================

    const tomorrowProfitMargin =
        calculateProfitMargin(
            tomorrowRevenue,
            tomorrowProfit
        );


    const next7DaysProfitMargin =
        calculateProfitMargin(
            next7DaysRevenue,
            next7DaysProfit
        );


    const next30DaysProfitMargin =
        calculateProfitMargin(
            next30DaysRevenue,
            next30DaysProfit
        );


    // ========================================================
    // STATUS
    // ========================================================

    let status =
        "Profitable";


    if (
        tomorrowProfit < 0
    ) {

        status =
            "Loss";

    }

    else if (
        tomorrowProfit === 0
    ) {

        status =
            "Break-even";
    }


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "💰 PROFIT FORECAST"
    );


    console.log(
        "Average Daily COGS:",
        averageDailyCOGS
    );


    console.log(
        "COGS / Revenue Ratio:",
        cogsRevenueRatio
    );


    console.log(
        "Average Daily Expenses:",
        averageDailyExpenses
    );


    console.log(
        "Tomorrow Revenue:",
        tomorrowRevenue
    );


    console.log(
        "Tomorrow COGS:",
        tomorrowCOGS
    );


    console.log(
        "Tomorrow Expenses:",
        tomorrowExpenses
    );


    console.log(
        "Tomorrow Gross Profit:",
        tomorrowGrossProfit
    );


    console.log(
        "Tomorrow Gross Margin:",
        tomorrowGrossMargin
    );


    console.log(
        "Tomorrow Net Profit:",
        tomorrowProfit
    );


    console.log(
        "Tomorrow Net Profit Margin:",
        tomorrowProfitMargin
    );


    console.log(
        "Next 7 Days Net Profit:",
        next7DaysProfit
    );


    console.log(
        "Next 30 Days Net Profit:",
        next30DaysProfit
    );


    console.log(
        "Status:",
        status
    );


    // ========================================================
    // RETURN
    // ========================================================

    return {

        // ----------------------------------------------------
        // COGS INTELLIGENCE
        // ----------------------------------------------------

        averageDailyCOGS,

        cogsRevenueRatio,


        // ----------------------------------------------------
        // DAILY EXPENSES
        // ----------------------------------------------------

        averageDailyExpenses,


        // ----------------------------------------------------
        // TOMORROW
        // ----------------------------------------------------

        tomorrowRevenue,

        tomorrowCOGS,

        tomorrowExpenses,

        tomorrowGrossProfit,

        tomorrowGrossMargin,

        tomorrowProfit,

        tomorrowProfitMargin,


        // ----------------------------------------------------
        // NEXT 7 DAYS
        // ----------------------------------------------------

        next7DaysRevenue,

        next7DaysCOGS,

        next7DaysExpenses,

        next7DaysGrossProfit,

        next7DaysGrossMargin,

        next7DaysProfit,

        next7DaysProfitMargin,


        // ----------------------------------------------------
        // NEXT 30 DAYS
        // ----------------------------------------------------

        next30DaysRevenue,

        next30DaysCOGS,

        next30DaysExpenses,

        next30DaysGrossProfit,

        next30DaysGrossMargin,

        next30DaysProfit,

        next30DaysProfitMargin,


        // ----------------------------------------------------
        // STATUS
        // ----------------------------------------------------

        status,


        // ----------------------------------------------------
        // REVENUE FORECAST CONFIDENCE
        // ----------------------------------------------------

        confidence:
            toNumber(
                revenue.confidence
            )

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    calculateGrossProfit,

    calculateProfit,

    calculateGrossMargin,

    calculateProfitMargin,

    calculateAverageDailyExpenses,

    calculateAverageDailyCOGS,

    calculateCOGSRevenueRatio,

    getProfitForecast

};