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

    // No sales history.
    if (
        !activeSalesDays ||
        activeSalesDays <= 0
    ) {
        return 0;
    }

    // 1–6 active selling days:
    // There is not enough evidence to apply
    // a trend adjustment.
    if (
        activeSalesDays < 7
    ) {
        return base;
    }

    switch (trend) {

        case "Growing":
            return Math.round(
                base * 1.10
            );

        case "Declining":
            return Math.round(
                base * 0.90
            );

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

    // No sales history.
    if (
        days <= 0
    ) {
        return 0;
    }

    // One actual selling day.
    if (
        days === 1
    ) {
        return 50;
    }

    // 2–6 selling days.
    if (
        days < 7
    ) {
        return 65;
    }

    // 7–13 selling days.
    if (
        days < 14
    ) {
        return 80;
    }

    // 14–29 selling days.
    if (
        days < 30
    ) {
        return 90;
    }

    // 30+ selling days.
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

    // If the previous active value equals zero.
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

function calculateActiveDayAverage(
    history
) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {
        return 0;
    }

    const activeSales =
        history.filter(
            day =>
                (
                    Number(
                        day?.sales
                    ) || 0
                ) > 0
        );

    if (
        activeSales.length === 0
    ) {
        return 0;
    }

    const total =
        activeSales.reduce(
            (
                sum,
                day
            ) =>
                sum +
                (
                    Number(
                        day?.sales
                    ) || 0
                ),
            0
        );

    return (
        total /
        activeSales.length
    );
}


// ======================================================
// CALCULATE CALENDAR-DAY AVERAGE
// ======================================================

function calculateCalendarDayAverage(
    calendarHistory
) {

    if (
        !Array.isArray(calendarHistory) ||
        calendarHistory.length === 0
    ) {
        return 0;
    }

    const total =
        calendarHistory.reduce(
            (
                sum,
                day
            ) =>
                sum +
                (
                    Number(
                        day?.sales
                    ) || 0
                ),
            0
        );

    return (
        total /
        calendarHistory.length
    );
}


// ======================================================
// DETERMINE FORECAST BASE
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
//
// trendEngine is optional.
//
// Production:
//     getRevenueForecast(userId)
//
// Testing:
//     getRevenueForecast(userId, mockTrendEngine)
//
// This allows the forecasting logic to be tested without
// connecting to SQLite or requiring a real user record.
// ======================================================

function getRevenueForecast(
    userId,
    trendEngine = historicalTrendEngine
) {

    // ==================================================
    // GET HISTORICAL SALES DATA
    // ==================================================

    const historical =
        trendEngine
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
    // ACTIVE SALES HISTORY
    // ==================================================

    const activeHistory =
        historical.history
            .filter(
                day =>
                    Number(
                        day?.sales
                    ) > 0
            )
            .map(
                day => ({

                    date:
                        day?.date,

                    sales:
                        Number(
                            day?.sales
                        ) || 0

                })
            );

    const activeSalesDays =
        activeHistory.length;

    // ==================================================
    // CALENDAR HISTORY
    // ==================================================

    const calendarHistory =
        Array.isArray(
            historical.calendarHistory
        )
            ? historical.calendarHistory
            : historical.history;

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
                    calendarHistory
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
            calendarHistory
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

    // Fewer than 7 active selling days are not
    // sufficient to establish a reliable trend.

    if (
        activeSalesDays < 7
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

        averageDailySales:
            projectedDailyRevenue,

        activeDayAverage,

        calendarDayAverage,

        growthRate,

        trend,

        confidence,

        tomorrow,

        next7Days,

        next30Days,

        activeSalesDays,

        history:
            activeHistory

    };
}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    calculateActiveDayAverage,

    calculateCalendarDayAverage,

    calculateGrowthRate,

    determineForecastBase,

    projectNext,

    getConfidence,

    getRevenueForecast

};