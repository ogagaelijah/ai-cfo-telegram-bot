const {
    calculateProfit,
    calculateProfitMargin,
    calculateAverageDailyExpenses,
    getProfitForecast
} = require("../src/services/profitForecastService");

// ======================================================
// PROFIT FORECAST SERVICE
// ======================================================

describe(
    "Profit Forecast Service",
    () => {

        // ==================================================
        // PROFIT CALCULATION
        // ==================================================

        describe(
            "calculateProfit()",
            () => {

                it(
                    "should calculate profit correctly",
                    () => {

                        const result =
                            calculateProfit(
                                100000,
                                60000
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
                                70000
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
                                20000
                            );

                        expect(
                            result
                        ).toBe(-20000);

                    }
                );


                it(
                    "should handle zero expenses",
                    () => {

                        const result =
                            calculateProfit(
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
        // COMPLETE PROFIT FORECAST
        // ==================================================

        describe(
            "getProfitForecast()",
            () => {

                it(
                    "should generate a complete profit forecast",
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
                                expenseHistory
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.tomorrowRevenue
                        ).toBe(100000);


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
                            result.next7DaysRevenue
                        ).toBe(700000);


                        expect(
                            result.next7DaysExpenses
                        ).toBe(420000);


                        expect(
                            result.next7DaysProfit
                        ).toBe(280000);


                        expect(
                            result.next7DaysProfitMargin
                        ).toBe(40);


                        expect(
                            result.next30DaysRevenue
                        ).toBe(3000000);


                        expect(
                            result.next30DaysExpenses
                        ).toBe(1800000);


                        expect(
                            result.next30DaysProfit
                        ).toBe(1200000);


                        expect(
                            result.next30DaysProfitMargin
                        ).toBe(40);


                        expect(
                            result.status
                        ).toBe(
                            "Profitable"
                        );

                    }
                );


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
                                expenseHistory
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
                                expenseHistory
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
                                expenseHistory
                            );


                        expect(
                            result.tomorrowExpenses
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