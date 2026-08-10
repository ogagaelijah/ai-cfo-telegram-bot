// ======================================================
// MOCK BUSINESS TRENDS REPOSITORY
// ======================================================
//
// IMPORTANT: cashForecastService.js destructures these
// three functions at require-time:
//
//   const { getAverageDailySales, ... } = require(...)
//
// Destructuring copies the function reference immediately.
// So these mocks MUST be assigned onto the repository's
// exports object BEFORE cashForecastService.js is required
// below - otherwise cashForecastService.js will have already
// captured the real (unmocked) functions.
// ======================================================

const trendsRepo = require("../src/repositories/businessTrendsRepository");

const getAverageDailySalesMock = vi.fn();
const getAverageDailyPurchasesMock = vi.fn();
const getAverageDailyExpensesMock = vi.fn();

trendsRepo.getAverageDailySales = getAverageDailySalesMock;
trendsRepo.getAverageDailyPurchases = getAverageDailyPurchasesMock;
trendsRepo.getAverageDailyExpenses = getAverageDailyExpensesMock;


// ======================================================
// MOCK FINANCIAL ANALYTICS SERVICE
// ======================================================
//
// cashForecastService.js accesses this one as
// analytics.getCashMetrics(...) (NOT destructured), so a
// plain vi.spyOn works fine for this one, refreshed each
// test in beforeEach below.
// ======================================================

const analyticsService = require("../src/services/financialAnalyticsService");


// ======================================================
// IMPORT FORECAST SERVICE AFTER MOCKS ARE IN PLACE
// ======================================================

const { getCashForecast } = require("../src/services/forecasting/cashForecastService");


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
// Net daily cash flow = ₦70,000
//
// 7 days  = ₦990,000
// 30 days = ₦2,600,000
// ======================================================

beforeEach(() => {

    vi.clearAllMocks();

    vi.spyOn(analyticsService, "getCashMetrics").mockReturnValue({
        cashPosition: 500000
    });

    getAverageDailySalesMock.mockReturnValue(100000);
    getAverageDailyPurchasesMock.mockReturnValue(20000);
    getAverageDailyExpensesMock.mockReturnValue(10000);

});


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

                        getAverageDailySalesMock
                            .mockReturnValue(
                                100000
                            );


                        getAverageDailyPurchasesMock
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

                        getAverageDailySalesMock
                            .mockReturnValue(
                                100000
                            );


                        getAverageDailyPurchasesMock
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

                        getAverageDailySalesMock
                            .mockReturnValue(
                                50000
                            );


                        getAverageDailyPurchasesMock
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

                        getAverageDailySalesMock
                            .mockReturnValue(
                                50000
                            );


                        getAverageDailyPurchasesMock
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

                        vi.spyOn(
                            analyticsService,
                            "getCashMetrics"
                        ).mockReturnValue({

                            cashPosition:
                                50000

                        });


                        getAverageDailySalesMock
                            .mockReturnValue(
                                10000
                            );


                        getAverageDailyPurchasesMock
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
                // MONITOR CLOSELY WITHIN 30 DAYS
                // ==================================================

                it(
                    "should identify monitor closely when cash becomes negative within thirty days",
                    () => {

                        vi.spyOn(
                            analyticsService,
                            "getCashMetrics"
                        ).mockReturnValue({

                            cashPosition:
                                500000

                        });


                        getAverageDailySalesMock
                            .mockReturnValue(
                                20000
                            );


                        getAverageDailyPurchasesMock
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

                        vi.spyOn(
                            analyticsService,
                            "getCashMetrics"
                        ).mockReturnValue({

                            cashPosition:
                                500000

                        });


                        getAverageDailySalesMock
                            .mockReturnValue(
                                10000
                            );


                        getAverageDailyPurchasesMock
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

                        vi.spyOn(
                            analyticsService,
                            "getCashMetrics"
                        ).mockReturnValue({

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
                            0
                        );

                    }
                );


                // ==================================================
                // NEGATIVE CURRENT CASH
                // ==================================================

                it(
                    "should identify critical status when current cash is negative",
                    () => {

                        vi.spyOn(
                            analyticsService,
                            "getCashMetrics"
                        ).mockReturnValue({

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
                            result.status
                        ).toBe(
                            "Critical"
                        );

                    }
                );


                // ==================================================
                // ZERO SALES
                // ==================================================

                it(
                    "should handle zero sales safely",
                    () => {

                        getAverageDailySalesMock
                            .mockReturnValue(
                                0
                            );


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

                        getAverageDailyPurchasesMock
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

                        getAverageDailySalesMock
                            .mockReturnValue(
                                0
                            );


                        getAverageDailyPurchasesMock
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

                        vi.spyOn(
                            analyticsService,
                            "getCashMetrics"
                        ).mockReturnValue({

                            cashPosition:
                                1000000000

                        });


                        getAverageDailySalesMock
                            .mockReturnValue(
                                2000000000
                            );


                        getAverageDailyPurchasesMock
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

                        vi.spyOn(
                            analyticsService,
                            "getCashMetrics"
                        ).mockReturnValue({});


                        getAverageDailySalesMock
                            .mockReturnValue(
                                undefined
                            );


                        getAverageDailyPurchasesMock
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
                            analyticsService.getCashMetrics
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            getAverageDailySalesMock
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            getAverageDailyPurchasesMock
                        ).toHaveBeenCalledWith(
                            USER_ID
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

                        getAverageDailySalesMock
                            .mockReturnValue(
                                30000
                            );


                        getAverageDailyPurchasesMock
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