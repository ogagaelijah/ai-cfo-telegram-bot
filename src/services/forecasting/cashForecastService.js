const analytics =
    require("../financialAnalyticsService");

const {
    getAverageDailyExpenses,
    getAverageDailyPurchaseCashOutflow
} = require("../../repositories/businessTrendsRepository");

const {
    getRevenueForecast
} = require("./revenueForecastService");

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
        );

    const currentCash =
        Number(
            cash?.cashPosition
        ) || 0;


    // ==================================================
    // DAILY CASH INFLOW
    // ==================================================
    //
    // Use the same revenue forecast used by the
    // main forecasting engine.
    //
    // This keeps revenue forecasting consistent
    // across the CFO system.
    // ==================================================

    const revenueForecast =
        getRevenueForecast(
            telegramId
        );

    const averageDailySales =
        Number(
            revenueForecast?.averageDailySales
        ) || 0;


    // ==================================================
    // DAILY PURCHASE CASH OUTFLOW
    // ==================================================
    //
    // Cash forecasting must use actual purchase
    // payments, not total purchase commitments.
    //
    // amount_paid = actual cash leaving the business.
    // ==================================================

    const averageDailyPurchases =
        Number(
            getAverageDailyPurchaseCashOutflow(
                telegramId,
                30
            )
        ) || 0;


    // ==================================================
    // DAILY OPERATING EXPENSES
    // ==================================================

    const averageDailyExpenses =
        Number(
            getAverageDailyExpenses(
                telegramId
            )
        ) || 0;


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
    //
    // Burn exists only when daily cash flow is negative.
    // ==================================================

    const estimatedDailyBurn =
        estimatedDailyNetCashFlow < 0
            ? Math.abs(
                estimatedDailyNetCashFlow
            )
            : 0;


    // ==================================================
    // PROJECTED CASH
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
    // CASH RUNWAY / RECOVERY
    // ==================================================

    let daysRemaining =
        Infinity;

    let cashRecoveryDays =
        null;


    // ==================================================
    // NEGATIVE CASH
    // ==================================================

    if (
        currentCash < 0
    ) {

        // ==============================================
        // NEGATIVE CASH + POSITIVE FLOW
        // ==============================================

        if (
            estimatedDailyNetCashFlow > 0
        ) {

            cashRecoveryDays =
                Math.ceil(
                    Math.abs(
                        currentCash
                    ) /
                    estimatedDailyNetCashFlow
                );

        }

        // ==============================================
        // NEGATIVE CASH + NEGATIVE/STABLE FLOW
        // ==============================================

        else {

            cashRecoveryDays =
                null;

        }

    }


    // ==================================================
    // POSITIVE CASH + NEGATIVE FLOW
    // ==================================================

    else if (
        currentCash > 0 &&
        estimatedDailyBurn > 0
    ) {

        daysRemaining =
            Math.floor(
                currentCash /
                estimatedDailyBurn
            );

    }


    // ==================================================
    // ZERO CASH
    // ==================================================

    else if (
        currentCash === 0
    ) {

        if (
            estimatedDailyNetCashFlow < 0
        ) {

            daysRemaining =
                0;

        }

        else {

            daysRemaining =
                Infinity;

        }

    }


    // ==================================================
    // CASH STATUS
    // ==================================================

    let status =
        "Healthy";


    // Current cash is already negative and continues
    // declining.
    if (
        currentCash < 0 &&
        estimatedDailyNetCashFlow < 0
    ) {

        status =
            "Critical";

    }

    // Current cash is negative but daily flow is positive.
    else if (
        currentCash < 0 &&
        estimatedDailyNetCashFlow > 0
    ) {

        status =
            "Critical - Recovering";

    }

    // Current cash is positive but becomes negative
    // within seven days.
    else if (
        currentCash >= 0 &&
        next7Days < 0
    ) {

        status =
            "High Risk";

    }

    // Current cash remains positive for seven days but
    // becomes negative within thirty days.
    else if (
        currentCash >= 0 &&
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
            "Cash liquidity is negative and daily cash flow is also negative. Immediate action is required to increase collections, reduce purchase cash outflows and control non-essential spending.";

    }

    else if (
        status === "Critical - Recovering"
    ) {

        recommendation =
            `Cash liquidity is currently negative, but daily cash flow is positive. Maintain the current positive cash-flow discipline and prioritize collections. The negative cash position is estimated to recover in approximately ${cashRecoveryDays} day(s).`;

    }

    else if (
        status === "High Risk"
    ) {

        recommendation =
            "Cash is currently positive, but projected cash may become negative within seven days. Accelerate collections and control purchases and operating expenses.";

    }

    else if (
        status === "Monitor Closely"
    ) {

        recommendation =
            "Cash reserves may become insufficient within 30 days. Monitor purchasing, operating expenses and customer collections closely.";

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
        "Cash inflows are currently sufficient to cover estimated purchase cash payments and operating expenses.";


    // ==================================================
    // NEGATIVE CASH + NEGATIVE FLOW
    // ==================================================

    if (
        currentCash < 0 &&
        estimatedDailyNetCashFlow < 0
    ) {

        explanation =
            `Cash is currently negative at ₦${Math.round(
                currentCash
            ).toLocaleString()}. Average daily cash inflow is approximately ₦${Math.round(
                averageDailySales
            ).toLocaleString()}, while average daily purchase cash payments are approximately ₦${Math.round(
                averageDailyPurchases
            ).toLocaleString()} and operating expenses are approximately ₦${Math.round(
                averageDailyExpenses
            ).toLocaleString()}. This creates an estimated daily cash deficit of ₦${Math.round(
                estimatedDailyBurn
            ).toLocaleString()}. Immediate liquidity action is required.`;

    }


    // ==================================================
    // NEGATIVE CASH + POSITIVE FLOW
    // ==================================================

    else if (
        currentCash < 0 &&
        estimatedDailyNetCashFlow > 0
    ) {

        explanation =
            `Cash is currently negative at ₦${Math.round(
                currentCash
            ).toLocaleString()}, but the business is generating approximately ₦${Math.round(
                estimatedDailyNetCashFlow
            ).toLocaleString()} in positive cash flow per day. At the current rate, the negative cash position could be recovered in approximately ${cashRecoveryDays} day(s).`;

    }


    // ==================================================
    // POSITIVE CASH + NEGATIVE FLOW
    // ==================================================

    else if (
        currentCash >= 0 &&
        estimatedDailyNetCashFlow < 0
    ) {

        explanation =
            `Cash is currently positive at ₦${Math.round(
                currentCash
            ).toLocaleString()}, but the business is losing approximately ₦${Math.round(
                estimatedDailyBurn
            ).toLocaleString()} in cash per day. At the current burn rate, projected cash is ${
                next7Days < 0
                    ? "expected to become negative within seven days"
                    : "under pressure over the next 30 days"
            }.`;

    }


    // ==================================================
    // POSITIVE CASH + POSITIVE FLOW
    // ==================================================

    else if (
        currentCash >= 0 &&
        estimatedDailyNetCashFlow > 0
    ) {

        explanation =
            `Cash is currently positive at ₦${Math.round(
                currentCash
            ).toLocaleString()}, and the business is generating approximately ₦${Math.round(
                estimatedDailyNetCashFlow
            ).toLocaleString()} in positive cash flow per day. Cash liquidity is currently improving.`;

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

        cashRecoveryDays,

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