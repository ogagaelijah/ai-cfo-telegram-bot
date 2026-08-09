const {
    calculateGrossProfit,
    calculateProfit,
    calculateGrossMargin,
    calculateProfitMargin,
    calculateAverageDailyExpenses,
    calculateAverageDailyCOGS,
    calculateCOGSRevenueRatio,
    getProfitForecast
} = require("../src/services/forecasting/profitForecastService");

// ======================================================
// PROFIT FORECAST SERVICE
// ======================================================

describe(
    "Profit Forecast Service",
    () => {

        // ==================================================
        // GROSS / NET PROFIT CALCULATION
        // ==================================================

        describe(
            "calculateProfit()",
            () => {

                it(
                    "should calculate net profit correctly",
                    () => {

                        const result =
                            calculateProfit(
                                100000,
                                20000,
                                40000
                            );

                        expect(
                            result
                        ).toBe(40000);

                    }
                );


                it(
                    "should calculate a loss correctly",
                    () => {

                        const result =
                            calculateProfit(
                                50000,
                                30000,
                                40000
                            );

                        expect(
                            result
                        ).toBe(-20000);

                    }
                );


                it(
                    "should handle zero revenue",
                    () => {

                        const result =
                            calculateProfit(
                                0,
                                0,
                                20000
                            );

                        expect(
                            result
                        ).toBe(-20000);

                    }
                );


                it(
                    "should handle zero COGS and expenses",
                    () => {

                        const result =
                            calculateProfit(
                                100000,
                                0,
                                0
                            );

                        expect(
                            result
                        ).toBe(100000);

                    }
                );


                it(
                    "should subtract both COGS and operating expenses",
                    () => {

                        const result =
                            calculateProfit(
                                100000,
                                30000,
                                20000
                            );

                        expect(
                            result
                        ).toBe(50000);

                    }
                );

            }
        );


        // ==================================================
        // GROSS PROFIT
        // ==================================================

        describe(
            "calculateGrossProfit()",
            () => {

                it(
                    "should calculate gross profit correctly",
                    () => {

                        const result =
                            calculateGrossProfit(
                                100000,
                                40000
                            );

                        expect(
                            result
                        ).toBe(60000);

                    }
                );


                it(
                    "should handle zero COGS",
                    () => {

                        const result =
                            calculateGrossProfit(
                                100000,
                                0
                            );

                        expect(
                            result
                        ).toBe(100000);

                    }
                );

            }
        );


        // ==================================================
        // GROSS MARGIN
        // ==================================================

        describe(
            "calculateGrossMargin()",
            () => {

                it(
                    "should calculate gross margin correctly",
                    () => {

                        const result =
                            calculateGrossMargin(
                                100000,
                                60000
                            );

                        expect(
                            result
                        ).toBe(60);

                    }
                );


                it(
                    "should return zero when revenue is zero",
                    () => {

                        const result =
                            calculateGrossMargin(
                                0,
                                0
                            );

                        expect(
                            result
                        ).toBe(0);

                    }
                );

            }
        );


        // ==================================================
        // PROFIT MARGIN
        // ==================================================

        describe(
            "calculateProfitMargin()",
            () => {

                it(
                    "should calculate profit margin correctly",
                    () => {

                        const result =
                            calculateProfitMargin(
                                100000,
                                40000
                            );

                        expect(
                            result
                        ).toBe(40);

                    }
                );


                it(
                    "should calculate negative profit margin",
                    () => {

                        const result =
                            calculateProfitMargin(
                                50000,
                                -20000
                            );

                        expect(
                            result
                        ).toBe(-40);

                    }
                );


                it(
                    "should return zero when revenue is zero",
                    () => {

                        const result =
                            calculateProfitMargin(
                                0,
                                -20000
                            );

                        expect(
                            result
                        ).toBe(0);

                    }
                );

            }
        );


        // ==================================================
        // AVERAGE DAILY EXPENSES
        // ==================================================

        describe(
            "calculateAverageDailyExpenses()",
            () => {

                it(
                    "should calculate average daily expenses",
                    () => {

                        const history = [

                            {
                                date:
                                    "2026-08-01",

                                expenses:
                                    20000
                            },

                            {
                                date:
                                    "2026-08-02",

                                expenses:
                                    30000
                            },

                            {
                                date:
                                    "2026-08-03",

                                expenses:
                                    40000
                            }

                        ];


                        const result =
                            calculateAverageDailyExpenses(
                                history
                            );


                        expect(
                            result
                        ).toBe(30000);

                    }
                );


                it(
                    "should return zero for empty expense history",
                    () => {

                        const result =
                            calculateAverageDailyExpenses(
                                []
                            );


                        expect(
                            result
                        ).toBe(0);

                    }
                );

            }
        );


        // ==================================================
        // AVERAGE DAILY COGS
        // ==================================================

        describe(
            "calculateAverageDailyCOGS()",
            () => {

                it(
                    "should calculate average daily COGS",
                    () => {

                        const history = [

                            {
                                date:
                                    "2026-08-01",

                                revenue:
                                    100000,

                                costOfGoods:
                                    60000
                            },

                            {
                                date:
                                    "2026-08-02",

                                revenue:
                                    120000,

                                costOfGoods:
                                    72000
                            },

                            {
                                date:
                                    "2026-08-03",

                                revenue:
                                    80000,

                                costOfGoods:
                                    48000
                            }

                        ];


                        const result =
                            calculateAverageDailyCOGS(
                                history
                            );


                        expect(
                            result
                        ).toBe(60000);

                    }
                );


                it(
                    "should return zero for empty COGS history",
                    () => {

                        const result =
                            calculateAverageDailyCOGS(
                                []
                            );


                        expect(
                            result
                        ).toBe(0);

                    }
                );


                it(
                    "should safely handle missing COGS values",
                    () => {

                        const history = [

                            {
                                date:
                                    "2026-08-01",

                                revenue:
                                    100000,

                                costOfGoods:
                                    50000
                            },

                            {
                                date:
                                    "2026-08-02",

                                revenue:
                                    100000
                            }

                        ];


                        const result =
                            calculateAverageDailyCOGS(
                                history
                            );


                        expect(
                            result
                        ).toBe(25000);

                    }
                );

            }
        );


        // ==================================================
        // COGS / REVENUE RATIO
        // ==================================================

        describe(
            "calculateCOGSRevenueRatio()",
            () => {

                it(
                    "should calculate COGS as a percentage of revenue",
                    () => {

                        const history = [

                            {
                                date:
                                    "2026-08-01",

                                revenue:
                                    100000,

                                costOfGoods:
                                    40000
                            },

                            {
                                date:
                                    "2026-08-02",

                                revenue:
                                    200000,

                                costOfGoods:
                                    80000
                            }

                        ];


                        const result =
                            calculateCOGSRevenueRatio(
                                history
                            );


                        expect(
                            result
                        ).toBe(0.4);

                    }
                );


                it(
                    "should return zero when historical revenue is zero",
                    () => {

                        const history = [

                            {
                                date:
                                    "2026-08-01",

                                revenue:
                                    0,

                                costOfGoods:
                                    10000
                            }

                        ];


                        const result =
                            calculateCOGSRevenueRatio(
                                history
                            );


                        expect(
                            result
                        ).toBe(0);

                    }
                );


                it(
                    "should safely ignore invalid revenue values",
                    () => {

                        const history = [

                            {
                                date:
                                    "2026-08-01",

                                revenue:
                                    0,

                                costOfGoods:
                                    10000
                            },

                            {
                                date:
                                    "2026-08-02",

                                revenue:
                                    100000,

                                costOfGoods:
                                    40000
                            }

                        ];


                        const result =
                            calculateCOGSRevenueRatio(
                                history
                            );


                        expect(
                            result
                        ).toBe(0.4);

                    }
                );

            }
        );


        // ==================================================
        // COMPLETE PROFIT FORECAST
        // ==================================================

        describe(
            "getProfitForecast()",
            () => {

                // ==================================================
                // NO COGS HISTORY
                // ==================================================

                it(
                    "should generate a complete profit forecast without COGS",
                    () => {

                        const revenueForecast = {

                            tomorrow:
                                100000,

                            next7Days:
                                700000,

                            next30Days:
                                3000000,

                            confidence:
                                90
                        };


                        const expenseHistory = [

                            {
                                date:
                                    "2026-08-01",

                                expenses:
                                    50000
                            },

                            {
                                date:
                                    "2026-08-02",

                                expenses:
                                    60000
                            },

                            {
                                date:
                                    "2026-08-03",

                                expenses:
                                    70000
                            }

                        ];


                        const result =
                            getProfitForecast(
                                revenueForecast,
                                expenseHistory,
                                []
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.averageDailyCOGS
                        ).toBe(0);


                        expect(
                            result.cogsRevenueRatio
                        ).toBe(0);


                        expect(
                            result.tomorrowRevenue
                        ).toBe(100000);


                        expect(
                            result.tomorrowCOGS
                        ).toBe(0);


                        expect(
                            result.tomorrowExpenses
                        ).toBe(60000);


                        expect(
                            result.tomorrowProfit
                        ).toBe(40000);


                        expect(
                            result.tomorrowProfitMargin
                        ).toBe(40);


                        expect(
                            result.status
                        ).toBe(
                            "Profitable"
                        );

                    }
                );


                // ==================================================
                // SMART COGS FORECAST
                // ==================================================

                it(
                    "should forecast COGS using historical COGS/revenue ratio",
                    () => {

                        const revenueForecast = {

                            tomorrow:
                                200000,

                            next7Days:
                                1400000,

                            next30Days:
                                6000000,

                            confidence:
                                90
                        };


                        const expenseHistory = [

                            {
                                date:
                                    "2026-08-01",

                                expenses:
                                    20000
                            },

                            {
                                date:
                                    "2026-08-02",

                                expenses:
                                    20000
                            }

                        ];


                        const cogsHistory = [

                            {
                                date:
                                    "2026-08-01",

                                revenue:
                                    100000,

                                costOfGoods:
                                    40000
                            },

                            {
                                date:
                                    "2026-08-02",

                                revenue:
                                    100000,

                                costOfGoods:
                                    40000
                            }

                        ];


                        const result =
                            getProfitForecast(
                                revenueForecast,
                                expenseHistory,
                                cogsHistory
                            );


                        // 40% COGS ratio.
                        expect(
                            result.cogsRevenueRatio
                        ).toBe(0.4);


                        // ₦200,000 × 40%.
                        expect(
                            result.tomorrowCOGS
                        ).toBe(80000);


                        // ₦1,400,000 × 40%.
                        expect(
                            result.next7DaysCOGS
                        ).toBe(560000);


                        // ₦6,000,000 × 40%.
                        expect(
                            result.next30DaysCOGS
                        ).toBe(2400000);


                        // Gross profit.

                        expect(
                            result.tomorrowGrossProfit
                        ).toBe(120000);


                        expect(
                            result.next7DaysGrossProfit
                        ).toBe(840000);


                        expect(
                            result.next30DaysGrossProfit
                        ).toBe(3600000);


                        // Net profit.

                        expect(
                            result.tomorrowProfit
                        ).toBe(100000);


                        expect(
                            result.next7DaysProfit
                        ).toBe(700000);


                        expect(
                            result.next30DaysProfit
                        ).toBe(3000000);

                    }
                );


                // ==================================================
                // COGS INTEGRATION
                // ==================================================

                it(
                    "should integrate COGS into gross and net profit",
                    () => {

                        const revenueForecast = {

                            tomorrow:
                                100000,

                            next7Days:
                                700000,

                            next30Days:
                                3000000,

                            confidence:
                                90
                        };


                        const expenseHistory = [

                            {
                                date:
                                    "2026-08-01",

                                expenses:
                                    20000
                            },

                            {
                                date:
                                    "2026-08-02",

                                expenses:
                                    20000
                            }

                        ];


                        const cogsHistory = [

                            {
                                date:
                                    "2026-08-01",

                                revenue:
                                    100000,

                                costOfGoods:
                                    40000
                            },

                            {
                                date:
                                    "2026-08-02",

                                revenue:
                                    100000,

                                costOfGoods:
                                    40000
                            }

                        ];


                        const result =
                            getProfitForecast(
                                revenueForecast,
                                expenseHistory,
                                cogsHistory
                            );


                        expect(
                            result.averageDailyCOGS
                        ).toBe(40000);


                        expect(
                            result.cogsRevenueRatio
                        ).toBe(0.4);


                        expect(
                            result.averageDailyExpenses
                        ).toBe(20000);


                        expect(
                            result.tomorrowRevenue
                        ).toBe(100000);


                        expect(
                            result.tomorrowCOGS
                        ).toBe(40000);


                        expect(
                            result.tomorrowGrossProfit
                        ).toBe(60000);


                        expect(
                            result.tomorrowGrossMargin
                        ).toBe(60);


                        expect(
                            result.tomorrowExpenses
                        ).toBe(20000);


                        expect(
                            result.tomorrowProfit
                        ).toBe(40000);


                        expect(
                            result.tomorrowProfitMargin
                        ).toBe(40);


                        expect(
                            result.next7DaysCOGS
                        ).toBe(280000);


                        expect(
                            result.next7DaysGrossProfit
                        ).toBe(420000);


                        expect(
                            result.next7DaysProfit
                        ).toBe(280000);


                        expect(
                            result.next30DaysCOGS
                        ).toBe(1200000);


                        expect(
                            result.next30DaysGrossProfit
                        ).toBe(1800000);


                        expect(
                            result.next30DaysProfit
                        ).toBe(1200000);


                        expect(
                            result.status
                        ).toBe(
                            "Profitable"
                        );

                    }
                );


                // ==================================================
                // LOSS-MAKING FORECAST
                // ==================================================

                it(
                    "should identify a loss-making forecast",
                    () => {

                        const revenueForecast = {

                            tomorrow:
                                50000,

                            next7Days:
                                350000,

                            next30Days:
                                1500000,

                            confidence:
                                80
                        };


                        const expenseHistory = [

                            {
                                date:
                                    "2026-08-01",

                                expenses:
                                    70000
                            },

                            {
                                date:
                                    "2026-08-02",

                                expenses:
                                    70000
                            }

                        ];


                        const result =
                            getProfitForecast(
                                revenueForecast,
                                expenseHistory,
                                []
                            );


                        expect(
                            result.tomorrowProfit
                        ).toBe(-20000);


                        expect(
                            result.tomorrowProfitMargin
                        ).toBe(-40);


                        expect(
                            result.status
                        ).toBe(
                            "Loss"
                        );

                    }
                );


                // ==================================================
                // ZERO REVENUE
                // ==================================================

                it(
                    "should handle zero revenue",
                    () => {

                        const revenueForecast = {

                            tomorrow:
                                0,

                            next7Days:
                                0,

                            next30Days:
                                0,

                            confidence:
                                0
                        };


                        const expenseHistory = [

                            {
                                date:
                                    "2026-08-01",

                                expenses:
                                    20000
                            }

                        ];


                        const result =
                            getProfitForecast(
                                revenueForecast,
                                expenseHistory,
                                []
                            );


                        expect(
                            result.tomorrowProfit
                        ).toBe(-20000);


                        expect(
                            result.status
                        ).toBe(
                            "Loss"
                        );

                    }
                );


                // ==================================================
                // ZERO EXPENSES
                // ==================================================

                it(
                    "should handle zero expenses",
                    () => {

                        const revenueForecast = {

                            tomorrow:
                                100000,

                            next7Days:
                                700000,

                            next30Days:
                                3000000,

                            confidence:
                                90
                        };


                        const expenseHistory = [];


                        const result =
                            getProfitForecast(
                                revenueForecast,
                                expenseHistory,
                                []
                            );


                        expect(
                            result.tomorrowExpenses
                        ).toBe(0);


                        expect(
                            result.tomorrowCOGS
                        ).toBe(0);


                        expect(
                            result.tomorrowProfit
                        ).toBe(100000);


                        expect(
                            result.status
                        ).toBe(
                            "Profitable"
                        );

                    }
                );

            }
        );

    }
);