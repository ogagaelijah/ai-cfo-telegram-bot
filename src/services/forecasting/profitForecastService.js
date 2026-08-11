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
// 5. Calculate historical average daily COGS.
// 6. Calculate known historical COGS ratio.
// 7. Calculate average daily operating expenses.
// 8. Forecast future COGS from forecast revenue using the
//    known historical COGS ratio.
//
// IMPORTANT:
//
// Revenue forecasting is handled separately by the Revenue
// Forecast Service and passed into getProfitForecast().
//
// ============================================================
// HISTORICAL COGS DATA RULE
// ============================================================
//
// Historical sales can contain:
//
// COMPLETE SALE
//
//     revenue > 0
//     costOfGoods > 0
//
// LEGACY / INCOMPLETE SALE
//
//     total > 0
//     revenue = 0
//     costOfGoods = 0
//
// The legacy/incomplete sale revenue may still be represented
// in the Revenue Forecast Service through the sales `total`
// field.
//
// However, this Profit Forecast Service MUST NOT invent COGS
// for those records.
//
// Therefore:
//
//     Known COGS
//         ↓
//     Only records where revenue > 0 AND costOfGoods > 0
//
//     Known COGS Ratio
//         ↓
//     Known COGS / Known Revenue
//
// Future COGS:
//
//     Forecast Revenue × Known COGS Ratio
//
// This keeps the forecast conservative and prevents the system
// from pretending that unknown historical COGS is known.
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
// ROUND MONEY
// ============================================================
//
// Prevent floating-point noise such as:
//
// 57066.666666666664
//
// Financial forecast values are rounded to the nearest whole
// currency unit.
//
// ============================================================

function roundMoney(value) {

    return Math.round(
        toNumber(value)
    );
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
// The supplied expense history should contain calendar days,
// including zero-expense days.
//
// Example:
//
// Aug 4 → ₦12,000
// Aug 5 → ₦0
// Aug 6 → ₦0
//
// Average:
//
// ₦12,000 / 3
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
// CALCULATE HISTORICAL DAILY COGS
// ============================================================
//
// Supporting statistic only.
//
// This uses the COGS values that are actually present.
//
// It does NOT invent COGS for records where COGS is unknown.
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
// CALCULATE KNOWN COGS RATIO
// ============================================================
//
// IMPORTANT:
//
// We calculate the COGS ratio ONLY from records where:
//
//     revenue > 0
//     AND
//     costOfGoods > 0
//
// Example:
//
// Complete revenue:
//     ₦99,200
//
// Known COGS:
//     ₦69,600
//
// Ratio:
//
//     ₦69,600 / ₦99,200
//
//     ≈ 70.16%
//
// Any historical sale whose COGS is unknown is excluded from
// this calculation.
//
// This prevents the system from inventing historical COGS.
//
// ============================================================

function calculateKnownCOGSRatio(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }

    let knownRevenue =
        0;

    let knownCOGS =
        0;

    for (
        const day of history
    ) {

        const revenue =
            toNumber(
                day?.revenue
            );

        const costOfGoods =
            toNumber(
                day?.costOfGoods
            );

        // --------------------------------------------------
        // Only complete COGS information is allowed.
        // --------------------------------------------------

        if (
            revenue > 0 &&
            costOfGoods > 0
        ) {

            knownRevenue +=
                revenue;

            knownCOGS +=
                costOfGoods;
        }
    }

    if (
        knownRevenue <= 0
    ) {

        return 0;
    }

    const ratio =
        knownCOGS /
        knownRevenue;

    // --------------------------------------------------
    // Safety check.
    //
    // A COGS ratio above 100% can happen in unusual
    // accounting situations, but for this forecasting
    // engine we do not want accidental database values
    // to create impossible gross margins.
    // --------------------------------------------------

    if (
        ratio < 0
    ) {

        return 0;
    }

    if (
        ratio > 1
    ) {

        return 1;
    }

    return ratio;
}


// ============================================================
// CALCULATE KNOWN COGS REVENUE
// ============================================================
//
// Returns the amount of historical revenue for which COGS
// is actually known.
//
// This is different from total business revenue.
//
// ============================================================

function calculateKnownCOGSRevenue(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }

    let knownRevenue =
        0;

    for (
        const day of history
    ) {

        const revenue =
            toNumber(
                day?.revenue
            );

        const costOfGoods =
            toNumber(
                day?.costOfGoods
            );

        if (
            revenue > 0 &&
            costOfGoods > 0
        ) {

            knownRevenue +=
                revenue;
        }
    }

    return knownRevenue;
}


// ============================================================
// CALCULATE KNOWN COGS TOTAL
// ============================================================
//
// Returns the total historical COGS for records where COGS
// is actually known.
//
// ============================================================

function calculateKnownCOGSTotal(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }

    let knownCOGS =
        0;

    for (
        const day of history
    ) {

        const revenue =
            toNumber(
                day?.revenue
            );

        const costOfGoods =
            toNumber(
                day?.costOfGoods
            );

        if (
            revenue > 0 &&
            costOfGoods > 0
        ) {

            knownCOGS +=
                costOfGoods;
        }
    }

    return knownCOGS;
}


// ============================================================
// CALCULATE COGS DATA QUALITY
// ============================================================
//
// Because the current repository supplies DAILY aggregated
// COGS history, we cannot reliably count individual legacy
// sale records here.
//
// Therefore this function evaluates the quality of the
// COGS information that is actually available to this service.
//
// Possible states:
//
// No Data
//     No COGS history.
//
// Insufficient Data
//     History exists but no complete revenue/COGS records
//     are available.
//
// Partial Data
//     Some revenue has known COGS.
//
// Good
//     COGS history contains usable complete records.
//
// ============================================================

function calculateCOGSDataQuality(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return "No Data";
    }

    const knownRevenue =
        calculateKnownCOGSRevenue(
            history
        );

    const knownCOGS =
        calculateKnownCOGSTotal(
            history
        );

    if (
        knownRevenue <= 0 ||
        knownCOGS <= 0
    ) {

        return "Insufficient Data";
    }

    // --------------------------------------------------
    // The current repository returns daily aggregates.
    // Therefore we cannot safely claim that ALL sales
    // have known COGS.
    //
    // "Partial Data" is the safer classification.
    // --------------------------------------------------

    return "Partial Data";
}


// ============================================================
// CALCULATE AVERAGE DAILY COGS
// ============================================================
//
// Supporting historical statistic.
//
// This value is NOT used as the future COGS forecast base.
//
// Future COGS uses:
//
//     Forecast Revenue × Known COGS Ratio
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
// FORECAST COGS
// ============================================================
//
// Forecast COGS:
//
//     Forecast Revenue × Known COGS Ratio
//
// ============================================================

function calculateForecastCOGS(
    revenue,
    knownCOGSRatio
) {

    const forecastRevenue =
        toNumber(
            revenue
        );

    const ratio =
        toNumber(
            knownCOGSRatio
        );

    if (
        forecastRevenue <= 0 ||
        ratio <= 0
    ) {

        return 0;
    }

    return (
        forecastRevenue *
        ratio
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
    // HISTORICAL AVERAGE DAILY COGS
    // ========================================================
    //
    // Supporting statistic only.
    //
    // It is NOT used directly to forecast future COGS.
    //
    // ========================================================

    const averageDailyCOGS =
        calculateAverageDailyCOGS(
            cogs
        );


    // ========================================================
    // KNOWN COGS RATIO
    // ========================================================

    const knownCOGSRatio =
        calculateKnownCOGSRatio(
            cogs
        );


    // ========================================================
    // KNOWN COGS REVENUE
    // ========================================================

    const knownCOGSRevenue =
        calculateKnownCOGSRevenue(
            cogs
        );


    // ========================================================
    // KNOWN COGS TOTAL
    // ========================================================

    const knownCOGSTotal =
        calculateKnownCOGSTotal(
            cogs
        );


    // ========================================================
    // COGS DATA QUALITY
    // ========================================================

    const cogsDataQuality =
        calculateCOGSDataQuality(
            cogs
        );


    // ========================================================
    // FORECAST REVENUE
    // ========================================================

    const tomorrowRevenue =
        roundMoney(
            revenue.tomorrow
        );

    const next7DaysRevenue =
        roundMoney(
            revenue.next7Days
        );

    const next30DaysRevenue =
        roundMoney(
            revenue.next30Days
        );


    // ========================================================
    // FORECAST COGS
    // ========================================================
    //
    // IMPORTANT:
    //
    // We do NOT use averageDailyCOGS here.
    //
    // We use the known historical COGS ratio.
    //
    // ========================================================

    const tomorrowCOGS =
        roundMoney(
            calculateForecastCOGS(
                tomorrowRevenue,
                knownCOGSRatio
            )
        );

    const next7DaysCOGS =
        roundMoney(
            calculateForecastCOGS(
                next7DaysRevenue,
                knownCOGSRatio
            )
        );

    const next30DaysCOGS =
        roundMoney(
            calculateForecastCOGS(
                next30DaysRevenue,
                knownCOGSRatio
            )
        );


    // ========================================================
    // GROSS PROFIT
    // ========================================================

    const tomorrowGrossProfit =
        roundMoney(
            calculateGrossProfit(
                tomorrowRevenue,
                tomorrowCOGS
            )
        );

    const next7DaysGrossProfit =
        roundMoney(
            calculateGrossProfit(
                next7DaysRevenue,
                next7DaysCOGS
            )
        );

    const next30DaysGrossProfit =
        roundMoney(
            calculateGrossProfit(
                next30DaysRevenue,
                next30DaysCOGS
            )
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
        roundMoney(
            averageDailyExpenses
        );

    const next7DaysExpenses =
        roundMoney(
            averageDailyExpenses *
            7
        );

    const next30DaysExpenses =
        roundMoney(
            averageDailyExpenses *
            30
        );


    // ========================================================
    // NET PROFIT
    // ========================================================

    const tomorrowProfit =
        roundMoney(
            calculateProfit(
                tomorrowRevenue,
                tomorrowCOGS,
                tomorrowExpenses
            )
        );

    const next7DaysProfit =
        roundMoney(
            calculateProfit(
                next7DaysRevenue,
                next7DaysCOGS,
                next7DaysExpenses
            )
        );

    const next30DaysProfit =
        roundMoney(
            calculateProfit(
                next30DaysRevenue,
                next30DaysCOGS,
                next30DaysExpenses
            )
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
    // COGS ESTIMATION METHOD
    // ========================================================

    let cogsEstimateMethod =
        "Insufficient COGS Data";

    if (
        knownCOGSRatio > 0
    ) {

        cogsEstimateMethod =
            "Known COGS Ratio";
    }


    // ========================================================
    // COGS WARNING
    // ========================================================
    //
    // This warning is important because the current sales
    // database contains older records where total is populated
    // but revenue and COGS are not populated.
    //
    // We do NOT attempt to manufacture the missing COGS.
    //
    // ========================================================

    let cogsWarning =
        "Historical COGS data is sufficient to calculate a known COGS ratio.";

    if (
        cogsDataQuality ===
        "No Data"
    ) {

        cogsWarning =
            "No historical COGS data is available. Future COGS cannot be estimated reliably.";

    }

    else if (
        cogsDataQuality ===
        "Insufficient Data"
    ) {

        cogsWarning =
            "Historical COGS information is insufficient. Future COGS estimates may be unavailable.";

    }

    else if (
        cogsDataQuality ===
        "Partial Data"
    ) {

        cogsWarning =
            "Some historical sales have known COGS while other historical sales may have incomplete COGS information. Future COGS is estimated only from the known COGS ratio.";
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
        "Known COGS Revenue:",
        knownCOGSRevenue
    );

    console.log(
        "Known COGS Total:",
        knownCOGSTotal
    );

    console.log(
        "Known COGS Ratio:",
        knownCOGSRatio
    );

    console.log(
        "Known COGS Percentage:",
        knownCOGSRatio * 100
    );

    console.log(
        "COGS Data Quality:",
        cogsDataQuality
    );

    console.log(
        "COGS Estimate Method:",
        cogsEstimateMethod
    );

    console.log(
        "COGS Warning:",
        cogsWarning
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
        "Next 7 Days Revenue:",
        next7DaysRevenue
    );

    console.log(
        "Next 7 Days COGS:",
        next7DaysCOGS
    );

    console.log(
        "Next 7 Days Expenses:",
        next7DaysExpenses
    );

    console.log(
        "Next 7 Days Gross Profit:",
        next7DaysGrossProfit
    );

    console.log(
        "Next 7 Days Net Profit:",
        next7DaysProfit
    );

    console.log(
        "Next 30 Days Revenue:",
        next30DaysRevenue
    );

    console.log(
        "Next 30 Days COGS:",
        next30DaysCOGS
    );

    console.log(
        "Next 30 Days Expenses:",
        next30DaysExpenses
    );

    console.log(
        "Next 30 Days Gross Profit:",
        next30DaysGrossProfit
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
        // HISTORICAL COGS
        // ----------------------------------------------------

        averageDailyCOGS,


        // ----------------------------------------------------
        // KNOWN COGS INTELLIGENCE
        // ----------------------------------------------------

        knownCOGSRatio,

        knownCOGSPercentage:
            knownCOGSRatio * 100,

        knownCOGSRevenue,

        knownCOGSTotal,

        cogsDataQuality,

        cogsEstimateMethod,

        cogsWarning,


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

    calculateKnownCOGSRatio,

    calculateForecastCOGS,

    getProfitForecast

};