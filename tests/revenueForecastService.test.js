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
            "should return 65 for 2 to 6 active sales days",
            () => {

                expect(
                    getConfidence(2)
                ).toBe(65);

                expect(
                    getConfidence(6)
                ).toBe(65);

            }
        );


        it(
            "should return 80 for 7 to 13 active sales days",
            () => {

                expect(
                    getConfidence(7)
                ).toBe(80);

            }
        );


        it(
            "should return 90 for 14 to 29 active sales days",
            () => {

                expect(
                    getConfidence(14)
                ).toBe(90);

            }
        );


        it(
            "should return 95 for 30 or more active sales days",
            () => {

                expect(
                    getConfidence(30)
                ).toBe(95);

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