const historicalTrendEngine =
    require("../trendEngines/historicalTrendEngine");

// ======================================================
// PROJECT NEXT VALUE
// ======================================================

function projectNext(
    average,
    trend,
    activeSalesDays
) {

    const base =
        Number(average) || 0;

    // Never apply trend adjustment
    // when there is not enough history.
    if (
        !activeSalesDays ||
        activeSalesDays < 2
    ) {
        return base;
    }

    switch (trend) {

        case "Growing":

            return base * 1.10;

        case "Declining":

            return base * 0.90;

        case "Stable":

            return base;

        case "Insufficient Data":

            return base;

        case "No Data":

            return 0;

        default:

            return base;
    }
}


// ======================================================
// CONFIDENCE SCORE
// ======================================================

function getConfidence(
    activeSalesDays
) {

    const days =
        Number(activeSalesDays) || 0;

    // No sales history
    if (
        days <= 0
    ) {

        return 0;
    }

    // Only one actual selling day
    if (
        days === 1
    ) {

        return 50;
    }

    // 2–6 selling days
    if (
        days < 7
    ) {

        return 65;
    }

    // 7–13 selling days
    if (
        days < 14
    ) {

        return 80;
    }

    // 14–29 selling days
    if (
        days < 30
    ) {

        return 90;
    }

    // 30+ selling days
    return 95;
}


// ======================================================
// CALCULATE GROWTH RATE
// ======================================================
//
// History must be:
//
// oldest → newest
//
// Only ACTIVE selling days should be supplied.
//
// Example:
//
// [
//   { date: "2026-08-01", sales: 100000 },
//   { date: "2026-08-04", sales: 150000 }
// ]
//
// Growth = 50%
// ======================================================

function calculateGrowthRate(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length < 2
    ) {

        return 0;
    }

    const oldest =
        Number(
            history[0]?.sales
        ) || 0;

    const newest =
        Number(
            history[
                history.length - 1
            ]?.sales
        ) || 0;


    // If the previous active
    // value somehow equals zero.
    if (
        oldest === 0
    ) {

        return newest > 0
            ? 100
            : 0;
    }


    return (
        (
            (
                newest -
                oldest
            ) /
            Math.abs(oldest)
        ) * 100
    );
}


// ======================================================
// CALCULATE ACTIVE-DAY AVERAGE
// ======================================================
//
// This is the average revenue earned on days
// where the business actually made sales.
//
// Example:
//
// Day 1 = ₦100,000
// Day 2 = ₦200,000
//
// Average = ₦150,000
// ======================================================

function calculateActiveDayAverage(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }


    const sales =
        history.map(
            day =>
                Number(
                    day.sales
                ) || 0
        );


    const total =
        sales.reduce(
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


// ======================================================
// CALCULATE CALENDAR-DAY AVERAGE
// ======================================================
//
// This is kept as a supporting statistic.
//
// IMPORTANT:
//
// It is NOT used as the main forecast base.
//
// This prevents a single legitimate sales day from
// producing an artificially tiny forecast simply because
// there are many zero-sales days in the history.
// ======================================================

function calculateCalendarDayAverage(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;
    }


    const total =
        history.reduce(
            (
                sum,
                day
            ) =>
                sum +
                (
                    Number(
                        day.sales
                    ) || 0
                ),
            0
        );


    return (
        total /
        history.length
    );
}


// ======================================================
// DETERMINE FORECAST BASE
// ======================================================
//
// Strategy:
//
// 1 selling day
//     → 100% active-day average
//
// 2–6 selling days
//     → active-day average
//
// 7–13 selling days
//     → active-day average
//
// 14–29 selling days
//     → active-day average
//
// 30+ selling days
//     → active-day average
//
// The reason is simple:
//
// We are forecasting the amount the business can make
// on a future selling day. Zero-sales calendar days should
// not automatically be interpreted as poor selling ability.
// ======================================================

function determineForecastBase(
    activeDayAverage,
    activeSalesDays
) {

    const average =
        Number(
            activeDayAverage
        ) || 0;

    const days =
        Number(
            activeSalesDays
        ) || 0;


    if (
        days <= 0
    ) {

        return 0;
    }


    return average;
}


// ======================================================
// REVENUE FORECAST ENGINE
// ======================================================

function getRevenueForecast(
    userId
) {

    // ==================================================
    // GET HISTORICAL SALES DATA
    // ==================================================

    const historical =
        historicalTrendEngine
            .getHistoricalSalesTrend(
                userId
            );


    // ==================================================
    // NO HISTORICAL DATA
    // ==================================================

    if (
        !historical ||
        !Array.isArray(
            historical.history
        ) ||
        historical.history.length === 0
    ) {

        console.log(
            "📈 REVENUE FORECAST: No Data"
        );


        return {

            averageDailySales: 0,

            activeDayAverage: 0,

            calendarDayAverage: 0,

            growthRate: 0,

            trend: "No Data",

            confidence: 0,

            tomorrow: 0,

            next7Days: 0,

            next30Days: 0,

            activeSalesDays: 0,

            history: []

        };
    }


    // ==================================================
    // HISTORICAL ACTIVE SALES HISTORY
    // ==================================================

    const history =
        historical.history;


    // The historical trend engine already returns
    // active selling days, but we normalize them here
    // to guarantee clean numeric values.

    const activeHistory =
        history
            .filter(
                day =>
                    Number(
                        day.sales
                    ) > 0
            )
            .map(
                day => ({

                    date:
                        day.date,

                    sales:
                        Number(
                            day.sales
                        ) || 0

                })
            );


    const activeSalesDays =
        activeHistory.length;


    // ==================================================
    // NO ACTIVE SALES
    // ==================================================

    if (
        activeSalesDays === 0
    ) {

        console.log(
            "📈 REVENUE FORECAST: No Active Sales"
        );


        return {

            averageDailySales: 0,

            activeDayAverage: 0,

            calendarDayAverage:
                calculateCalendarDayAverage(
                    history
                ),

            growthRate: 0,

            trend: "No Data",

            confidence: 0,

            tomorrow: 0,

            next7Days: 0,

            next30Days: 0,

            activeSalesDays: 0,

            history: []

        };
    }


    // ==================================================
    // ACTIVE-DAY AVERAGE
    // ==================================================

    const activeDayAverage =
        calculateActiveDayAverage(
            activeHistory
        );


    // ==================================================
    // CALENDAR-DAY AVERAGE
    // ==================================================

    const calendarDayAverage =
        calculateCalendarDayAverage(
            history
        );


    // ==================================================
    // FORECAST BASE
    // ==================================================

    const forecastBase =
        determineForecastBase(
            activeDayAverage,
            activeSalesDays
        );


    // ==================================================
    // TREND
    // ==================================================

    let trend =
        historical.trend ||
        "Insufficient Data";


    // One selling day is never enough
    // to establish a meaningful trend.

    if (
        activeSalesDays < 2
    ) {

        trend =
            "Insufficient Data";
    }


    // ==================================================
    // GROWTH RATE
    // ==================================================

    const growthRate =
        activeSalesDays >= 2
            ? calculateGrowthRate(
                activeHistory
            )
            : 0;


    // ==================================================
    // PROJECT DAILY REVENUE
    // ==================================================

    const projectedDailyRevenue =
        projectNext(
            forecastBase,
            trend,
            activeSalesDays
        );


    // ==================================================
    // REVENUE PROJECTIONS
    // ==================================================

    const tomorrow =
        projectedDailyRevenue;


    const next7Days =
        projectedDailyRevenue * 7;


    const next30Days =
        projectedDailyRevenue * 30;


    // ==================================================
    // CONFIDENCE
    // ==================================================

    const confidence =
        getConfidence(
            activeSalesDays
        );


    // ==================================================
    // DEBUG
    // ==================================================

    console.log(
        "📈 REVENUE FORECAST"
    );

    console.log(
        "Active Sales Days:",
        activeSalesDays
    );

    console.log(
        "Active Day Average:",
        activeDayAverage
    );

    console.log(
        "Calendar Day Average:",
        calendarDayAverage
    );

    console.log(
        "Forecast Base:",
        forecastBase
    );

    console.log(
        "Projected Daily Revenue:",
        projectedDailyRevenue
    );

    console.log(
        "Tomorrow:",
        tomorrow
    );

    console.log(
        "Next 7 Days:",
        next7Days
    );

    console.log(
        "Next 30 Days:",
        next30Days
    );

    console.log(
        "Growth Rate:",
        growthRate
    );

    console.log(
        "Trend:",
        trend
    );

    console.log(
        "Confidence:",
        confidence
    );


    // ==================================================
    // RETURN
    // ==================================================

    return {

        // Main forecast value
        // used by the AI CFO.

        averageDailySales:
            projectedDailyRevenue,


        // Supporting analytics.

        activeDayAverage,

        calendarDayAverage,

        growthRate,

        trend,

        confidence,

        tomorrow,

        next7Days,

        next30Days,

        activeSalesDays,

        history

    };
}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getRevenueForecast

};