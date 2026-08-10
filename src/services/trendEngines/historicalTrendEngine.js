const historyRepository =
    require("../../repositories/historyRepository");

const trendsRepository =
    require("../../repositories/businessTrendsRepository");


// ==========================
// CALCULATE AVERAGE
// ==========================
function movingAverage(values) {

    if (
        !values ||
        values.length === 0
    ) {

        return 0;
    }


    const numbers =
        values.map(
            value =>
                Number(value) || 0
        );


    const total =
        numbers.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        );


    return (
        total /
        numbers.length
    );
}


// ==========================
// DETERMINE TREND
// ==========================
function determineTrend(
    first,
    last
) {

    const firstValue =
        Number(first) || 0;

    const lastValue =
        Number(last) || 0;


    // ==========================
    // BOTH ZERO
    // ==========================

    if (
        firstValue === 0 &&
        lastValue === 0
    ) {

        return "Stable";

    }


    // ==========================
    // NEW BUSINESS
    // ==========================

    if (
        firstValue === 0
    ) {

        return lastValue > 0
            ? "Growing"
            : "Stable";

    }


    // ==========================
    // CALCULATE CHANGE
    // ==========================

    const percentageChange =
        (
            (
                lastValue -
                firstValue
            ) /
            Math.abs(firstValue)
        ) * 100;


    // ==========================
    // TREND THRESHOLD
    // ==========================

    if (
        percentageChange >= 10
    ) {

        return "Growing";

    }


    if (
        percentageChange <= -10
    ) {

        return "Declining";

    }


    return "Stable";
}


// ==========================
// BUILD ACTIVE DAILY HISTORY
// ==========================
function buildActiveHistory(
    history
) {

    if (
        !history ||
        history.length === 0
    ) {

        return [];

    }


    // Keep only days where
    // recognized revenue actually occurred.
    //
    // historyRepository already uses
    // recognized revenue rather than raw
    // transaction totals.

    const active =
        history.filter(
            day =>
                Number(day.sales) > 0
        );


    // Repository returns newest first.
    // Reverse to oldest → newest.

    return [...active]
        .reverse()
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
}


// ==========================
// BUILD CALENDAR HISTORY
// ==========================
function buildCalendarHistory(
    history
) {

    if (
        !history ||
        history.length === 0
    ) {

        return [];

    }


    // Repository returns newest first.
    // Reverse to oldest → newest.

    return [...history]
        .reverse()
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
}


// ==========================
// HISTORICAL SALES TREND
// ==========================
function getHistoricalSalesTrend(
    telegramId
) {

    // ==========================
    // TELEGRAM → INTERNAL USER
    // ==========================

    const userId =
        trendsRepository.getUserId(
            telegramId
        );


    // ==========================
    // GET DAILY SALES
    // ==========================

    const rawHistory =
        historyRepository.getDailySales(
            userId
        );


    console.log(
        "📚 RAW SALES HISTORY:",
        rawHistory
    );


    // ==========================
    // CALENDAR HISTORY
    // ==========================

    const calendarHistory =
        buildCalendarHistory(
            rawHistory
        );


    // ==========================
    // ACTIVE SALES DAYS
    // ==========================

    const activeHistory =
        buildActiveHistory(
            rawHistory
        );


    console.log(
        "📊 ACTIVE SALES DAYS:",
        activeHistory
    );


    // ==========================
    // NO DATA
    // ==========================

    if (
        activeHistory.length === 0
    ) {

        console.log(
            "📈 SALES TREND: No Data"
        );


        return {

            trend:
                "No Data",

            average:
                0,

            calendarAverage:
                0,

            activeDays:
                0,

            history:
                [],

            calendarHistory

        };

    }


    // ==========================
    // ACTIVE-DAY AVERAGE
    // ==========================

    const activeSalesValues =
        activeHistory.map(
            day =>
                Number(
                    day.sales
                ) || 0
        );


    const activeDayAverage =
        movingAverage(
            activeSalesValues
        );


    // ==========================
    // CALENDAR-DAY AVERAGE
    // ==========================

    const calendarSalesValues =
        calendarHistory.map(
            day =>
                Number(
                    day.sales
                ) || 0
        );


    const calendarAverage =
        movingAverage(
            calendarSalesValues
        );


    // ==========================
    // INSUFFICIENT ACTIVE SALES DAYS
    // ==========================
    //
    // 1–6 active selling days are
    // not enough to confidently classify
    // the business as Growing, Declining
    // or Stable.
    //
    // The active-day average remains
    // available for forecasting.
    //
    // Trend classification begins only
    // when there are at least 7 active
    // selling days.
    //
    // This prevents situations such as:
    //
    // ₦85,600 → ₦6,800
    //
    // being classified as a genuine
    // -92% business decline when the
    // business only has two selling days
    // in the available history.
    //
    // ==========================

    if (
        activeHistory.length < 7
    ) {

        console.log(
            "📈 SALES TREND: Insufficient Data"
        );

        console.log(
            "💰 ACTIVE DAY AVERAGE:",
            activeDayAverage
        );

        console.log(
            "📅 CALENDAR DAY AVERAGE:",
            calendarAverage
        );

        console.log(
            "📊 ACTIVE SALES DAYS:",
            activeHistory.length
        );


        return {

            trend:
                "Insufficient Data",

            average:
                activeDayAverage,

            calendarAverage,

            activeDays:
                activeHistory.length,

            history:
                activeHistory,

            calendarHistory

        };

    }


    // ==========================
    // TREND VALUES
    // ==========================

    const sales =
        activeHistory.map(
            day =>
                Number(
                    day.sales
                ) || 0
        );


    // ==========================
    // DETERMINE TREND
    // ==========================

    const trend =
        determineTrend(
            sales[0],
            sales[
                sales.length - 1
            ]
        );


    // ==========================
    // DEBUG
    // ==========================

    console.log(
        "📈 SALES TREND:",
        trend
    );

    console.log(
        "💰 ACTIVE DAY AVERAGE:",
        activeDayAverage
    );

    console.log(
        "📅 CALENDAR DAY AVERAGE:",
        calendarAverage
    );

    console.log(
        "📊 ACTIVE SALES DAYS:",
        activeHistory.length
    );


    // ==========================
    // RETURN
    // ==========================

    return {

        trend,

        // Existing property.
        // Other services can continue
        // using this without breaking.

        average:
            activeDayAverage,

        calendarAverage,

        activeDays:
            activeHistory.length,

        history:
            activeHistory,

        calendarHistory

    };
}


// ==========================
// HISTORICAL PROFIT TREND
// ==========================
function getHistoricalProfitTrend(
    telegramId
) {

    // ==========================
    // TELEGRAM → INTERNAL USER
    // ==========================

    const userId =
        trendsRepository.getUserId(
            telegramId
        );


    // ==========================
    // GET DAILY PROFIT
    // ==========================

    const rawHistory =
        historyRepository.getDailyProfit(
            userId
        );


    console.log(
        "📚 RAW PROFIT HISTORY:",
        rawHistory
    );


    // ==========================
    // ACTIVE PROFIT DAYS
    // ==========================

    const history =
        (rawHistory || [])
            .filter(
                day =>
                    Number(
                        day.profit
                    ) !== 0
            )
            .reverse()
            .map(
                day => ({

                    date:
                        day.date,

                    profit:
                        Number(
                            day.profit
                        ) || 0

                })
            );


    console.log(
        "📊 ACTIVE PROFIT DAYS:",
        history
    );


    // ==========================
    // NO DATA
    // ==========================

    if (
        history.length === 0
    ) {

        return {

            trend:
                "No Data",

            average:
                0,

            history:
                []

        };

    }


    // ==========================
    // INSUFFICIENT PROFIT DAYS
    // ==========================
    //
    // Require at least 7 active
    // profit days before classifying
    // profit as Growing, Declining
    // or Stable.
    //
    // This keeps profit intelligence
    // consistent with revenue intelligence.
    // ==========================

    if (
        history.length < 7
    ) {

        const insufficientAverage =
            movingAverage(
                history.map(
                    day =>
                        Number(
                            day.profit
                        ) || 0
                )
            );


        return {

            trend:
                "Insufficient Data",

            average:
                insufficientAverage,

            history

        };

    }


    // ==========================
    // PROFIT VALUES
    // ==========================

    const profits =
        history.map(
            day =>
                Number(
                    day.profit
                ) || 0
        );


    // ==========================
    // AVERAGE DAILY PROFIT
    // ==========================

    const average =
        movingAverage(
            profits
        );


    // ==========================
    // TREND
    // ==========================

    const trend =
        determineTrend(
            profits[0],
            profits[
                profits.length - 1
            ]
        );


    // ==========================
    // RETURN
    // ==========================

    return {

        trend,

        average,

        history

    };
}


// ==========================
// EXPORT
// ==========================
module.exports = {

    getHistoricalSalesTrend,

    getHistoricalProfitTrend

};