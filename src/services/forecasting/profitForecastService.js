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
// 6. Calculate average daily operating expenses.
// 7. Forecast future profit from:
//
//      Revenue
//          ↓
//      COGS
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

function toNumber(value) {

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
        toNumber(revenue);

    const totalCOGS =
        toNumber(costOfGoods);

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
        toNumber(revenue);

    const totalCOGS =
        toNumber(costOfGoods);

    const totalExpenses =
        toNumber(expenses);

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
        toNumber(revenue);

    const totalGrossProfit =
        toNumber(grossProfit);


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
        toNumber(revenue);

    const totalProfit =
        toNumber(profit);


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
// Example:
//
// Aug 4 → ₦12,000
// Aug 5 → ₦0
// Aug 6 → ₦0
//
// This produces a calendar-day operating expense average.
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
// COGS must come from products actually sold.
//
// We use the sales table's:
//
//     cost_of_goods
//
// field.
//
// This is different from purchases.
//
// PURCHASES:
//     Inventory acquired.
//
// COGS:
//     Inventory actually sold.
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
// GET COGS HISTORY FROM SALES
// ============================================================
//
// The Forecast Engine will provide daily sales/COGS history.
//
// Expected format:
//
// [
//     {
//         date: "2026-08-04",
//         revenue: 85600,
//         costOfGoods: 58800
//     }
// ]
//
// ============================================================

function calculateAverageDailyCOGS(
    history
) {

    return calculateDailyCOGS(
        history
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

    const tomorrowCOGS =
        averageDailyCOGS;


    const next7DaysCOGS =
        averageDailyCOGS *
        7;


    const next30DaysCOGS =
        averageDailyCOGS *
        30;


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
        // DAILY COGS
        // ----------------------------------------------------

        averageDailyCOGS,


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

    getProfitForecast

};