// ======================================================
// CASH FORECAST SERVICE TEST
// ======================================================
//
// IMPORTANT:
//
// cashForecastService.js depends on:
//
// 1. financialAnalyticsService.getCashMetrics()
// 2. revenueForecastService.getRevenueForecast()
// 3. businessTrendsRepository.getAverageDailyPurchaseCashOutflow()
// 4. businessTrendsRepository.getAverageDailyExpenses()
//
// These tests mock those exact dependencies.
//
// Production logic is NOT being changed.
// ======================================================

const {
    describe,
    it,
    expect,
    beforeEach,
    vi
} = await import("vitest");


// ======================================================
// MOCK BUSINESS TRENDS REPOSITORY
// ======================================================

const trendsRepo =
    require(
        "../src/repositories/businessTrendsRepository"
    );

const getAverageDailyExpensesMock =
    vi.fn();

const getAverageDailyPurchaseCashOutflowMock =
    vi.fn();

trendsRepo.getAverageDailyExpenses =
    getAverageDailyExpensesMock;

trendsRepo.getAverageDailyPurchaseCashOutflow =
    getAverageDailyPurchaseCashOutflowMock;


// ======================================================
// MOCK REVENUE FORECAST SERVICE
// ======================================================

const revenueForecastService =
    require(
        "../src/services/forecasting/revenueForecastService"
    );

const getRevenueForecastMock =
    vi.fn();

revenueForecastService.getRevenueForecast =
    getRevenueForecastMock;


// ======================================================
// MOCK FINANCIAL ANALYTICS SERVICE
// ======================================================

const analyticsService =
    require(
        "../src/services/financialAnalyticsService"
    );

const getCashMetricsMock =
    vi.fn();

analyticsService.getCashMetrics =
    getCashMetricsMock;


// ======================================================
// IMPORT CASH FORECAST SERVICE
// ======================================================

const {
    getCashForecast
} =
    require(
        "../src/services/forecasting/cashForecastService"
    );


// ======================================================
// TEST USER
// ======================================================

const USER_ID = 999999;


// ======================================================
// DEFAULT FINANCIAL SCENARIO
// ======================================================
//
// Current cash       = ₦500,000
// Daily sales        = ₦100,000
// Daily purchases    = ₦20,000
// Daily expenses     = ₦10,000
//
// Daily outflow      = ₦30,000
//
// Net daily flow     = ₦70,000
//
// 7 days:
// ₦500,000 + (₦70,000 × 7)
// = ₦990,000
//
// 30 days:
// ₦500,000 + (₦70,000 × 30)
// = ₦2,600,000
// ======================================================

beforeEach(
    () => {

        vi.clearAllMocks();


        // ----------------------------------------------
        // CURRENT CASH
        // ----------------------------------------------

        getCashMetricsMock.mockReturnValue({

            cashPosition:
                500000

        });


        // ----------------------------------------------
        // REVENUE FORECAST
        // ----------------------------------------------

        getRevenueForecastMock.mockReturnValue({

            averageDailySales:
                100000

        });


        // ----------------------------------------------
        // PURCHASE CASH OUTFLOW
        // ----------------------------------------------

        getAverageDailyPurchaseCashOutflowMock
            .mockReturnValue(
                20000
            );


        // ----------------------------------------------
        // OPERATING EXPENSES
        // ----------------------------------------------

        getAverageDailyExpensesMock
            .mockReturnValue(
                10000
            );

    }
);


// ======================================================
// TEST SUITE
// ======================================================

describe(
    "Cash Forecast Service",
    () => {

        describe(
            "getCashForecast()",
            () => {


                // ==================================================
                // COMPLETE FORECAST
                // ==================================================

                it(
                    "should generate a complete cash forecast",
                    () => {

                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.currentCash
                        ).toBe(
                            500000
                        );


                        expect(
                            result.averageDailySales
                        ).toBe(
                            100000
                        );


                        expect(
                            result.averageDailyPurchases
                        ).toBe(
                            20000
                        );


                        expect(
                            result.averageDailyExpenses
                        ).toBe(
                            10000
                        );


                        expect(
                            result.averageDailyOutflow
                        ).toBe(
                            30000
                        );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            70000
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            0
                        );


                        expect(
                            result.status
                        ).toBe(
                            "Healthy"
                        );


                        expect(
                            result.cashTrend
                        ).toBe(
                            "Improving"
                        );

                    }
                );


                // ==================================================
                // POSITIVE DAILY CASH FLOW
                // ==================================================

                it(
                    "should calculate positive daily cash flow correctly",
                    () => {

                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            70000
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            0
                        );

                    }
                );


                // ==================================================
                // SEVEN DAY PROJECTION
                // ==================================================

                it(
                    "should calculate the seven-day cash projection correctly",
                    () => {

                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.next7Days
                        ).toBe(
                            990000
                        );

                    }
                );


                // ==================================================
                // THIRTY DAY PROJECTION
                // ==================================================

                it(
                    "should calculate the thirty-day cash projection correctly",
                    () => {

                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.next30Days
                        ).toBe(
                            2600000
                        );

                    }
                );


                // ==================================================
                // IMPROVING CASH FLOW
                // ==================================================

                it(
                    "should identify improving cash flow",
                    () => {

                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    100000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                20000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                10000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            70000
                        );


                        expect(
                            result.cashTrend
                        ).toBe(
                            "Improving"
                        );

                    }
                );


                // ==================================================
                // STABLE CASH FLOW
                // ==================================================

                it(
                    "should identify stable cash flow",
                    () => {

                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    100000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                60000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                40000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            0
                        );


                        expect(
                            result.cashTrend
                        ).toBe(
                            "Stable"
                        );

                    }
                );


                // ==================================================
                // DECLINING CASH FLOW
                // ==================================================

                it(
                    "should identify declining cash flow",
                    () => {

                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    50000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                40000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                30000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            -20000
                        );


                        expect(
                            result.cashTrend
                        ).toBe(
                            "Declining"
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            20000
                        );

                    }
                );


                // ==================================================
                // CASH BURN
                // ==================================================

                it(
                    "should calculate cash burn correctly",
                    () => {

                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    50000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                40000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                30000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            20000
                        );

                    }
                );


                // ==================================================
                // HIGH RISK WITHIN 7 DAYS
                // ==================================================

                it(
                    "should identify high risk when cash becomes negative within seven days",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({

                                cashPosition:
                                    50000

                            });


                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    10000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                40000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                10000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            -40000
                        );


                        expect(
                            result.next7Days
                        ).toBe(
                            -230000
                        );


                        expect(
                            result.status
                        ).toBe(
                            "High Risk"
                        );

                    }
                );


                // ==================================================
                // CASH REMAINS POSITIVE
                // ==================================================

                it(
                    "should remain healthy when cash stays positive within thirty days",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({

                                cashPosition:
                                    500000

                            });


                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    20000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                25000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                0
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.next7Days
                        ).toBe(
                            465000
                        );


                        expect(
                            result.next30Days
                        ).toBe(
                            350000
                        );


                        expect(
                            result.status
                        ).toBe(
                            "Healthy"
                        );

                    }
                );


                // ==================================================
                // THIRTY-DAY NEGATIVE CASH
                // ==================================================

                it(
                    "should identify monitor closely when thirty-day cash becomes negative",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({

                                cashPosition:
                                    500000

                            });


                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    10000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                20000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                10000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.next7Days
                        ).toBe(
                            360000
                        );


                        expect(
                            result.next30Days
                        ).toBe(
                            -100000
                        );


                        expect(
                            result.status
                        ).toBe(
                            "Monitor Closely"
                        );

                    }
                );


                // ==================================================
                // ZERO CURRENT CASH
                // ==================================================

                it(
                    "should safely handle zero current cash",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({

                                cashPosition:
                                    0

                            });


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.currentCash
                        ).toBe(
                            0
                        );


                        expect(
                            result.estimatedDaysRemaining
                        ).toBe(
                            Infinity
                        );

                    }
                );


                // ==================================================
                // NEGATIVE CASH + POSITIVE FLOW
                // ==================================================
                //
                // This is intentionally:
                //
                // "Critical - Recovering"
                //
                // because the production logic says:
                //
                // currentCash < 0
                // AND
                // net daily flow > 0
                //
                // => Critical - Recovering
                //
                // ==================================================

                it(
                    "should identify critical recovering status when current cash is negative but cash flow is positive",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({

                                cashPosition:
                                    -100000

                            });


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.currentCash
                        ).toBe(
                            -100000
                        );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            70000
                        );


                        expect(
                            result.status
                        ).toBe(
                            "Critical - Recovering"
                        );


                        expect(
                            result.cashRecoveryDays
                        ).toBe(
                            2
                        );

                    }
                );


                // ==================================================
                // NEGATIVE CASH + NEGATIVE FLOW
                // ==================================================
                //
                // This is the actual Critical scenario.
                //
                // currentCash < 0
                // AND
                // net daily flow < 0
                //
                // => Critical
                //
                // ==================================================

                it(
                    "should identify critical status when current cash is negative and cash flow is negative",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({

                                cashPosition:
                                    -100000

                            });


                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    10000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                40000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                30000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.currentCash
                        ).toBe(
                            -100000
                        );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            -60000
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            60000
                        );


                        expect(
                            result.status
                        ).toBe(
                            "Critical"
                        );


                        expect(
                            result.cashRecoveryDays
                        ).toBe(
                            null
                        );

                    }
                );


                // ==================================================
                // ZERO SALES
                // ==================================================

                it(
                    "should handle zero sales safely",
                    () => {

                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    0

                            });


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.averageDailySales
                        ).toBe(
                            0
                        );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            -30000
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            30000
                        );

                    }
                );


                // ==================================================
                // ZERO PURCHASES
                // ==================================================

                it(
                    "should handle zero purchases safely",
                    () => {

                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                0
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.averageDailyPurchases
                        ).toBe(
                            0
                        );


                        expect(
                            result.averageDailyOutflow
                        ).toBe(
                            10000
                        );

                    }
                );


                // ==================================================
                // ZERO OPERATING EXPENSES
                // ==================================================

                it(
                    "should handle zero operating expenses safely",
                    () => {

                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                0
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.averageDailyExpenses
                        ).toBe(
                            0
                        );


                        expect(
                            result.averageDailyOutflow
                        ).toBe(
                            20000
                        );

                    }
                );


                // ==================================================
                // ZERO INFLOW AND OUTFLOW
                // ==================================================

                it(
                    "should handle zero inflow and zero outflow",
                    () => {

                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    0

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                0
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                0
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            0
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            0
                        );


                        expect(
                            result.cashTrend
                        ).toBe(
                            "Stable"
                        );

                    }
                );


                // ==================================================
                // LARGE FINANCIAL VALUES
                // ==================================================

                it(
                    "should handle large financial values",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({

                                cashPosition:
                                    1000000000

                            });


                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    2000000000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                500000000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                250000000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.currentCash
                        ).toBe(
                            1000000000
                        );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            1250000000
                        );


                        expect(
                            result.next7Days
                        ).toBe(
                            9750000000
                        );


                        expect(
                            result.next30Days
                        ).toBe(
                            38500000000
                        );

                    }
                );


                // ==================================================
                // MISSING REPOSITORY VALUES
                // ==================================================

                it(
                    "should safely handle missing repository values",
                    () => {

                        getCashMetricsMock
                            .mockReturnValue({});


                        getRevenueForecastMock
                            .mockReturnValue({});


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                null
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                undefined
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.currentCash
                        ).toBe(
                            0
                        );


                        expect(
                            result.averageDailySales
                        ).toBe(
                            0
                        );


                        expect(
                            result.averageDailyPurchases
                        ).toBe(
                            0
                        );


                        expect(
                            result.averageDailyExpenses
                        ).toBe(
                            0
                        );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            0
                        );

                    }
                );


                // ==================================================
                // USER ID PASSED CORRECTLY
                // ==================================================

                it(
                    "should request all financial metrics using the supplied user ID",
                    () => {

                        getCashForecast(
                            USER_ID
                        );


                        expect(
                            getCashMetricsMock
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            getRevenueForecastMock
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            getAverageDailyPurchaseCashOutflowMock
                        ).toHaveBeenCalledWith(
                            USER_ID,
                            30
                        );


                        expect(
                            getAverageDailyExpensesMock
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );

                    }
                );


                // ==================================================
                // FORECAST PERIOD CONSISTENCY
                // ==================================================

                it(
                    "should maintain consistent forecast periods",
                    () => {

                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        const daily =
                            result.estimatedDailyNetCashFlow;


                        expect(
                            result.next7Days
                        ).toBe(
                            result.currentCash +
                            (
                                daily * 7
                            )
                        );


                        expect(
                            result.next30Days
                        ).toBe(
                            result.currentCash +
                            (
                                daily * 30
                            )
                        );

                    }
                );


                // ==================================================
                // NO BURN WHEN POSITIVE
                // ==================================================

                it(
                    "should never report cash burn when net cash flow is positive",
                    () => {

                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBeGreaterThan(
                            0
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            0
                        );

                    }
                );


                // ==================================================
                // BURN ABSOLUTE VALUE
                // ==================================================

                it(
                    "should calculate burn as the absolute value of negative cash flow",
                    () => {

                        getRevenueForecastMock
                            .mockReturnValue({

                                averageDailySales:
                                    30000

                            });


                        getAverageDailyPurchaseCashOutflowMock
                            .mockReturnValue(
                                40000
                            );


                        getAverageDailyExpensesMock
                            .mockReturnValue(
                                10000
                            );


                        const result =
                            getCashForecast(
                                USER_ID
                            );


                        expect(
                            result.estimatedDailyNetCashFlow
                        ).toBe(
                            -20000
                        );


                        expect(
                            result.estimatedDailyBurn
                        ).toBe(
                            20000
                        );

                    }
                );

            }
        );

    }
);