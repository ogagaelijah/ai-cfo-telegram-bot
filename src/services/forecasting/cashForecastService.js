const analytics =
    require("../financialAnalyticsService");

const {
    getAverageDailySales,
    getAverageDailyExpenses,
    getAverageDailyPurchases
} = require("../../repositories/businessTrendsRepository");


// ======================================================
// SAFE NUMBER
// ======================================================
//
// Converts invalid financial values into 0.
//
// Handles:
//
// undefined
// null
// NaN
// Infinity
// -Infinity
// numeric strings
//
// This prevents invalid values from contaminating
// the entire forecast.
// ======================================================

function safeNumber(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


// ======================================================
// CASH FLOW FORECAST ENGINE
// ======================================================

function getCashForecast(telegramId) {

    // ==================================================
    // CURRENT CASH
    // ==================================================

    const cash =
        analytics.getCashMetrics(
            telegramId
        ) || {};


    const currentCash =
        safeNumber(
            cash.cashPosition
        );


    // ==================================================
    // DAILY CASH INFLOW
    // ==================================================

    const averageDailySales =
        Math.max(
            0,
            safeNumber(
                getAverageDailySales(
                    telegramId
                )
            )
        );


    // ==================================================
    // DAILY PURCHASE OUTFLOW
    // ==================================================

    const averageDailyPurchases =
        Math.max(
            0,
            safeNumber(
                getAverageDailyPurchases(
                    telegramId
                )
            )
        );


    // ==================================================
    // DAILY OPERATING EXPENSES
    // ==================================================

    const averageDailyExpenses =
        Math.max(
            0,
            safeNumber(
                getAverageDailyExpenses(
                    telegramId
                )
            )
        );


    // ==================================================
    // TOTAL DAILY OUTFLOW
    // ==================================================

    const averageDailyOutflow =
        averageDailyPurchases +
        averageDailyExpenses;


    // ==================================================
    // NET DAILY CASH FLOW
    // ==================================================

    const estimatedDailyNetCashFlow =
        averageDailySales -
        averageDailyOutflow;


    // ==================================================
    // CASH BURN
    // ==================================================

    const estimatedDailyBurn =
        estimatedDailyNetCashFlow < 0
            ? Math.abs(
                estimatedDailyNetCashFlow
            )
            : 0;


    // ==================================================
    // PROJECTED CASH BALANCES
    // ==================================================
    //
    // These are projected ENDING CASH BALANCES.
    //
    // They are NOT revenue generated during the period.
    // ==================================================

    const next7Days =
        currentCash +
        (
            estimatedDailyNetCashFlow *
            7
        );


    const next30Days =
        currentCash +
        (
            estimatedDailyNetCashFlow *
            30
        );


    // ==================================================
    // DAYS OF CASH REMAINING
    // ==================================================

    let daysRemaining =
        Infinity;


    // No available cash.
    if (
        currentCash <= 0
    ) {

        daysRemaining = 0;

    }

    // Cash is currently being consumed.
    else if (
        estimatedDailyBurn > 0
    ) {

        daysRemaining =
            Math.floor(
                currentCash /
                estimatedDailyBurn
            );
    }


    // ==================================================
    // CASH STATUS
    // ==================================================

    let status =
        "Healthy";


    // Current negative cash always takes priority.
    if (
        currentCash < 0
    ) {

        status =
            "Critical";
    }

    // Cash becomes negative within 7 days.
    else if (
        next7Days < 0
    ) {

        status =
            "High Risk";
    }

    // Cash becomes negative within 30 days.
    else if (
        next30Days < 0
    ) {

        status =
            "Monitor Closely";
    }


    // ==================================================
    // CASH TREND
    // ==================================================

    let cashTrend =
        "Stable";


    if (
        estimatedDailyNetCashFlow > 0
    ) {

        cashTrend =
            "Improving";

    }

    else if (
        estimatedDailyNetCashFlow < 0
    ) {

        cashTrend =
            "Declining";
    }


    // ==================================================
    // RECOMMENDATION
    // ==================================================

    let recommendation =
        "Cash flow is healthy. Continue monitoring collections and expenses.";


    if (
        status === "Critical"
    ) {

        recommendation =
            "Cash liquidity is currently negative. Prioritize collections, control purchases and reduce non-essential spending.";

    }

    else if (
        status === "High Risk"
    ) {

        recommendation =
            "Projected cash may become negative within seven days. Accelerate collections and control purchases and operating expenses.";

    }

    else if (
        status === "Monitor Closely"
    ) {

        recommendation =
            "Cash reserves may become insufficient within 30 days. Monitor purchases, expenses and customer collections.";

    }

    else if (
        cashTrend === "Improving"
    ) {

        recommendation =
            "Cash flow is improving. Maintain disciplined purchasing and spending while building cash reserves.";
    }


    // ==================================================
    // CFO EXPLANATION
    // ==================================================

    let explanation =
        "Cash inflows are currently sufficient to cover estimated purchases and operating expenses.";


    if (
        estimatedDailyNetCashFlow < 0
    ) {

        explanation =
            `Average daily cash inflow is approximately ₦${Math.round(
                averageDailySales
            ).toLocaleString()}, while estimated daily purchases are approximately ₦${Math.round(
                averageDailyPurchases
            ).toLocaleString()} and operating expenses are approximately ₦${Math.round(
                averageDailyExpenses
            ).toLocaleString()}. This creates an estimated daily cash deficit of ₦${Math.round(
                estimatedDailyBurn
            ).toLocaleString()}.`;

    }

    else if (
        estimatedDailyNetCashFlow > 0
    ) {

        explanation =
            `Average daily cash inflow is approximately ₦${Math.round(
                averageDailySales
            ).toLocaleString()}, compared with estimated daily purchases of ₦${Math.round(
                averageDailyPurchases
            ).toLocaleString()} and operating expenses of ₦${Math.round(
                averageDailyExpenses
            ).toLocaleString()}. This produces an estimated positive daily cash flow of ₦${Math.round(
                estimatedDailyNetCashFlow
            ).toLocaleString()}.`;
    }


    // ==================================================
    // RETURN
    // ==================================================

    return {

        currentCash,

        averageDailySales,

        averageDailyPurchases,

        averageDailyExpenses,

        averageDailyOutflow,

        estimatedDailyNetCashFlow,

        estimatedDailyBurn,

        estimatedDaysRemaining:
            daysRemaining,

        // Projected ENDING cash balances.

        next7Days,

        next30Days,

        status,

        cashTrend,

        explanation,

        recommendation
    };
}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getCashForecast

};