const analytics =
    require("../financialAnalyticsService");

const {
    getAverageDailySales,
    getAverageDailyExpenses,
    getAverageDailyPurchases
} = require("../../repositories/businessTrendsRepository");


// ==========================
// CASH FLOW FORECAST ENGINE
// ==========================
function getCashForecast(telegramId) {

    // ==========================
    // CURRENT CASH
    // ==========================
    const cash =
        analytics.getCashMetrics(telegramId);

    const currentCash =
        Number(cash.cashPosition) || 0;


    // ==========================
    // DAILY CASH INFLOW
    // ==========================
    const averageDailySales =
        Number(
            getAverageDailySales(telegramId)
        ) || 0;


    // ==========================
    // DAILY PURCHASE OUTFLOW
    // ==========================
    const averageDailyPurchases =
        Number(
            getAverageDailyPurchases(telegramId)
        ) || 0;


    // ==========================
    // DAILY OPERATING EXPENSES
    // ==========================
    const averageDailyExpenses =
        Number(
            getAverageDailyExpenses(telegramId)
        ) || 0;


    // ==========================
    // TOTAL DAILY OUTFLOW
    // ==========================
    const averageDailyOutflow =
        averageDailyPurchases +
        averageDailyExpenses;


    // ==========================
    // NET DAILY CASH FLOW
    // ==========================
    const estimatedDailyNetCashFlow =
        averageDailySales -
        averageDailyOutflow;


    // ==========================
    // CASH BURN
    // ==========================
    const estimatedDailyBurn =
        estimatedDailyNetCashFlow < 0
            ? Math.abs(
                estimatedDailyNetCashFlow
            )
            : 0;


    // ==========================
    // PROJECTED CASH
    // ==========================
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


    // ==========================
    // DAYS OF CASH REMAINING
    // ==========================
    let daysRemaining =
        Infinity;


    if (currentCash <= 0) {

        daysRemaining = 0;

    }

    else if (estimatedDailyBurn > 0) {

        daysRemaining =
            Math.floor(
                currentCash /
                estimatedDailyBurn
            );

    }


    // ==========================
    // CASH STATUS
    // ==========================
    let status =
        "Healthy";


    if (currentCash < 0) {

        status =
            "Critical";

    }

    else if (next7Days < 0) {

        status =
            "High Risk";

    }

    else if (next30Days < 0) {

        status =
            "Monitor Closely";

    }


    // ==========================
    // CASH TREND
    // ==========================
    let cashTrend =
        "Stable";


    if (estimatedDailyNetCashFlow > 0) {

        cashTrend =
            "Improving";

    }

    else if (estimatedDailyNetCashFlow < 0) {

        cashTrend =
            "Declining";

    }


    // ==========================
    // RECOMMENDATION
    // ==========================
    let recommendation =
        "Cash flow is healthy. Continue monitoring collections and expenses.";


    if (status === "Critical") {

        recommendation =
            "Cash liquidity is currently negative. Prioritize collections, control purchases and reduce non-essential spending.";

    }

    else if (status === "High Risk") {

        recommendation =
            "Projected cash may become negative within seven days. Accelerate collections and control purchases and operating expenses.";

    }

    else if (status === "Monitor Closely") {

        recommendation =
            "Cash reserves may become insufficient within 30 days. Monitor purchases, expenses and customer collections.";

    }

    else if (cashTrend === "Improving") {

        recommendation =
            "Cash flow is improving. Maintain disciplined purchasing and spending while building cash reserves.";

    }


    // ==========================
    // CFO EXPLANATION
    // ==========================
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


    // ==========================
    // RETURN
    // ==========================
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

        next7Days,

        next30Days,

        status,

        cashTrend,

        explanation,

        recommendation

    };

}


module.exports = {

    getCashForecast

};