// ============================================================
// PROFIT FORECAST SERVICE
// ============================================================
//
// Responsibilities:
// - Calculate profit
// - Calculate profit margin
// - Calculate average daily expenses
// - Forecast future profit from revenue forecast + expense history
//
// IMPORTANT:
// This service does NOT call getRevenueForecast().
//
// Revenue forecasting is handled separately by the Revenue
// Forecast Service and passed into getProfitForecast().
//
// This prevents:
// - duplicate revenue calculations
// - duplicate database calls
// - repeated forecast logs
// - tight coupling between forecast engines
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
// CALCULATE PROFIT
// ============================================================

function calculateProfit(
    revenue,
    expenses
) {

    const totalRevenue =
        toNumber(revenue);

    const totalExpenses =
        toNumber(expenses);

    return (
        totalRevenue -
        totalExpenses
    );
}


// ============================================================
// CALCULATE PROFIT MARGIN
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
        totalRevenue === 0
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
// FORECAST PROFIT
// ============================================================

function getProfitForecast(
    revenueForecast,
    expenseHistory
) {

    // ========================================================
    // SAFETY
    // ========================================================

    const revenue =
        revenueForecast || {};

    const history =
        Array.isArray(
            expenseHistory
        )
            ? expenseHistory
            : [];


    // ========================================================
    // AVERAGE DAILY EXPENSES
    // ========================================================

    const averageDailyExpenses =
        calculateAverageDailyExpenses(
            history
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
    // FORECAST EXPENSES
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
    // FORECAST PROFIT
    // ========================================================

    const tomorrowProfit =
        calculateProfit(
            tomorrowRevenue,
            tomorrowExpenses
        );

    const next7DaysProfit =
        calculateProfit(
            next7DaysRevenue,
            next7DaysExpenses
        );

    const next30DaysProfit =
        calculateProfit(
            next30DaysRevenue,
            next30DaysExpenses
        );


    // ========================================================
    // PROFIT MARGINS
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


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "💰 PROFIT FORECAST"
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
        "Tomorrow Expenses:",
        tomorrowExpenses
    );

    console.log(
        "Tomorrow Profit:",
        tomorrowProfit
    );

    console.log(
        "Tomorrow Profit Margin:",
        tomorrowProfitMargin
    );

    console.log(
        "Next 7 Days Profit:",
        next7DaysProfit
    );

    console.log(
        "Next 30 Days Profit:",
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
        // AVERAGE EXPENSES
        // ----------------------------------------------------

        averageDailyExpenses,


        // ----------------------------------------------------
        // TOMORROW
        // ----------------------------------------------------

        tomorrowRevenue,

        tomorrowExpenses,

        tomorrowProfit,

        tomorrowProfitMargin,


        // ----------------------------------------------------
        // NEXT 7 DAYS
        // ----------------------------------------------------

        next7DaysRevenue,

        next7DaysExpenses,

        next7DaysProfit,

        next7DaysProfitMargin,


        // ----------------------------------------------------
        // NEXT 30 DAYS
        // ----------------------------------------------------

        next30DaysRevenue,

        next30DaysExpenses,

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

    calculateProfit,

    calculateProfitMargin,

    calculateAverageDailyExpenses,

    getProfitForecast

};