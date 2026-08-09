const {
calculateActiveDayAverage,
calculateCalendarDayAverage,
calculateGrowthRate,
determineForecastBase,
projectNext,
getConfidence,
getRevenueForecast
} = require("../src/services/forecasting/revenueForecastService");

const {
describe,
it,
expect
} = await import("vitest");

describe("Revenue Forecast Service", () => {

    // ======================================================
    // CALCULATE ACTIVE-DAY AVERAGE
    // ======================================================

    describe("calculateActiveDayAverage()", () => {

        it(
            "should calculate the average revenue across active sales days",
            () => {

                const history = [

                    {
                        date: "2026-08-04",
                        sales: 85600
                    },

                    {
                        date: "2026-08-08",
                        sales: 6800
                    }

                ];

                const result =
                    calculateActiveDayAverage(
                        history
                    );

                expect(result).toBe(46200);

            }
        );


        it(
            "should return 0 for empty history",
            () => {

                const result =
                    calculateActiveDayAverage([]);

                expect(result).toBe(0);

            }
        );

    });


    // ======================================================
    // CALCULATE CALENDAR-DAY AVERAGE
    // ======================================================

    describe("calculateCalendarDayAverage()", () => {

        it(
            "should include zero-sales calendar days",
            () => {

                const history = [

                    {
                        date: "2026-08-01",
                        sales: 0
                    },

                    {
                        date: "2026-08-02",
                        sales: 10000
                    },

                    {
                        date: "2026-08-03",
                        sales: 0
                    }

                ];

                const result =
                    calculateCalendarDayAverage(
                        history
                    );

                expect(result).toBeCloseTo(
                    3333.3333333333335
                );

            }
        );


        it(
            "should return 0 for empty history",
            () => {

                const result =
                    calculateCalendarDayAverage([]);

                expect(result).toBe(0);

            }
        );

    });


    // ======================================================
    // CALCULATE GROWTH RATE
    // ======================================================

    describe("calculateGrowthRate()", () => {

        it(
            "should calculate percentage growth correctly",
            () => {

                const history = [

                    {
                        date: "2026-08-04",
                        sales: 85600
                    },

                    {
                        date: "2026-08-08",
                        sales: 6800
                    }

                ];

                const result =
                    calculateGrowthRate(
                        history
                    );

                expect(result).toBeCloseTo(
                    -92.05607476635514
                );

            }
        );


        it(
            "should return 0 when there is insufficient history",
            () => {

                const result =
                    calculateGrowthRate([

                        {
                            date: "2026-08-08",
                            sales: 6800
                        }

                    ]);

                expect(result).toBe(0);

            }
        );


        it(
            "should return 100% growth when oldest sales value is zero and newest is positive",
            () => {

                const history = [

                    {
                        date: "2026-08-01",
                        sales: 0
                    },

                    {
                        date: "2026-08-02",
                        sales: 50000
                    }

                ];

                const result =
                    calculateGrowthRate(
                        history
                    );

                expect(result).toBe(100);

            }
        );


        it(
            "should return 0 when both oldest and newest sales are zero",
            () => {

                const history = [

                    {
                        date: "2026-08-01",
                        sales: 0
                    },

                    {
                        date: "2026-08-02",
                        sales: 0
                    }

                ];

                const result =
                    calculateGrowthRate(
                        history
                    );

                expect(result).toBe(0);

            }
        );

    });


    // ======================================================
    // DETERMINE FORECAST BASE
    // ======================================================

    describe("determineForecastBase()", () => {

        it(
            "should use active-day average when active sales exist",
            () => {

                const result =
                    determineForecastBase(
                        46200,
                        2
                    );

                expect(result).toBe(46200);

            }
        );


        it(
            "should return 0 when there are no active sales days",
            () => {

                const result =
                    determineForecastBase(
                        46200,
                        0
                    );

                expect(result).toBe(0);

            }
        );


        it(
            "should use the active-day average regardless of history size",
            () => {

                expect(
                    determineForecastBase(
                        100000,
                        1
                    )
                ).toBe(100000);


                expect(
                    determineForecastBase(
                        100000,
                        6
                    )
                ).toBe(100000);


                expect(
                    determineForecastBase(
                        100000,
                        7
                    )
                ).toBe(100000);


                expect(
                    determineForecastBase(
                        100000,
                        30
                    )
                ).toBe(100000);

            }
        );

    });


    // ======================================================
    // PROJECT NEXT
    // ======================================================

    describe("projectNext()", () => {

        it(
            "should not adjust a forecast when trend is Insufficient Data",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Insufficient Data",
                        2
                    );

                expect(result).toBe(46200);

            }
        );


        it(
            "should not apply Growing adjustment with fewer than 7 active sales days",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Growing",
                        2
                    );

                expect(result).toBe(46200);

            }
        );


        it(
            "should not apply Declining adjustment with fewer than 7 active sales days",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Declining",
                        2
                    );

                expect(result).toBe(46200);

            }
        );


        it(
            "should apply Growing adjustment with 7 or more active sales days",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Growing",
                        7
                    );

                expect(result).toBe(50820);

            }
        );


        it(
            "should apply Declining adjustment with 7 or more active sales days",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Declining",
                        7
                    );

                expect(result).toBe(41580);

            }
        );


        it(
            "should not adjust the forecast for a Stable trend",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Stable",
                        7
                    );

                expect(result).toBe(46200);

            }
        );


        it(
            "should return the base when there is only one active sales day",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Growing",
                        1
                    );

                expect(result).toBe(46200);

            }
        );


        it(
            "should return the base when there are no active sales days",
            () => {

                const result =
                    projectNext(
                        46200,
                        "Growing",
                        0
                    );

                expect(result).toBe(0);

            }
        );


        it(
            "should apply the growth adjustment at exactly 7 active sales days",
            () => {

                const result =
                    projectNext(
                        100000,
                        "Growing",
                        7
                    );

                expect(result).toBe(110000);

            }
        );


        it(
            "should apply the declining adjustment at exactly 7 active sales days",
            () => {

                const result =
                    projectNext(
                        100000,
                        "Declining",
                        7
                    );

                expect(result).toBe(90000);

            }
        );

    });


    // ======================================================
    // CONFIDENCE
    // ======================================================

    describe("getConfidence()", () => {

        it(
            "should return 0 with no sales history",
            () => {

                expect(
                    getConfidence(0)
                ).toBe(0);

            }
        );


        it(
            "should return 50 for one active sales day",
            () => {

                expect(
                    getConfidence(1)
                ).toBe(50);

            }
        );


        it(
            "should return 65 for 2 active sales days",
            () => {

                expect(
                    getConfidence(2)
                ).toBe(65);

            }
        );


        it(
            "should return 65 for 6 active sales days",
            () => {

                expect(
                    getConfidence(6)
                ).toBe(65);

            }
        );


        it(
            "should return 80 for 7 active sales days",
            () => {

                expect(
                    getConfidence(7)
                ).toBe(80);

            }
        );


        it(
            "should return 80 for 13 active sales days",
            () => {

                expect(
                    getConfidence(13)
                ).toBe(80);

            }
        );


        it(
            "should return 90 for 14 active sales days",
            () => {

                expect(
                    getConfidence(14)
                ).toBe(90);

            }
        );


        it(
            "should return 90 for 29 active sales days",
            () => {

                expect(
                    getConfidence(29)
                ).toBe(90);

            }
        );


        it(
            "should return 95 for 30 active sales days",
            () => {

                expect(
                    getConfidence(30)
                ).toBe(95);

            }
        );


        it(
            "should return 95 for 60 active sales days",
            () => {

                expect(
                    getConfidence(60)
                ).toBe(95);

            }
        );


        it(
            "should never exceed 95% confidence",
            () => {

                expect(
                    getConfidence(100)
                ).toBe(95);


                expect(
                    getConfidence(365)
                ).toBe(95);


                expect(
                    getConfidence(1000)
                ).toBe(95);

            }
        );


        it(
            "should produce a monotonically increasing confidence level",
            () => {

                const confidenceLevels = [

                    getConfidence(1),

                    getConfidence(2),

                    getConfidence(6),

                    getConfidence(7),

                    getConfidence(13),

                    getConfidence(14),

                    getConfidence(29),

                    getConfidence(30),

                    getConfidence(60)

                ];


                for (
                    let index = 1;
                    index < confidenceLevels.length;
                    index++
                ) {

                    expect(
                        confidenceLevels[index]
                    ).toBeGreaterThanOrEqual(
                        confidenceLevels[
                            index - 1
                        ]
                    );

                }

            }
        );


        it(
            "should match the complete confidence progression",
            () => {

                const expected = {

                    1: 50,

                    6: 65,

                    7: 80,

                    14: 90,

                    30: 95

                };


                Object.entries(
                    expected
                ).forEach(
                    (
                        [
                            days,
                            confidence
                        ]
                    ) => {

                        expect(
                            getConfidence(
                                Number(days)
                            )
                        ).toBe(
                            confidence
                        );

                    }
                );

            }
        );

    });


    // ======================================================
    // GET REVENUE FORECAST
    // ======================================================

    describe("getRevenueForecast()", () => {

        it(
            "should return a complete forecast object",
            () => {

                const result =
                    getRevenueForecast(
                        2068830830
                    );

                expect(result).toBeDefined();

                expect(result).toHaveProperty(
                    "averageDailySales"
                );

                expect(result).toHaveProperty(
                    "activeDayAverage"
                );

                expect(result).toHaveProperty(
                    "calendarDayAverage"
                );

                expect(result).toHaveProperty(
                    "growthRate"
                );

                expect(result).toHaveProperty(
                    "trend"
                );

                expect(result).toHaveProperty(
                    "confidence"
                );

                expect(result).toHaveProperty(
                    "tomorrow"
                );

                expect(result).toHaveProperty(
                    "next7Days"
                );

                expect(result).toHaveProperty(
                    "next30Days"
                );

                expect(result).toHaveProperty(
                    "activeSalesDays"
                );

                expect(result).toHaveProperty(
                    "history"
                );

            }
        );

    });

});