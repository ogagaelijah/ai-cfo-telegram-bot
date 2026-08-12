const {
    describe,
    it,
    expect,
    vi
} = await import("vitest");

// ============================================================
// FORECAST ENGINE
// ============================================================

const {
    buildForecast
} = await import(
    "../src/services/forecasting/forecastEngine"
);

// ============================================================
// TEST USER
// ============================================================

const USER_ID = 999999;

// ============================================================
// MOCK FORECAST SERVICES
// ============================================================

const getRevenueForecastMock =
    vi.fn();

const getCashForecastMock =
    vi.fn();

const getInventoryForecastMock =
    vi.fn();

const getInventoryDemandForecastMock =
    vi.fn();

const getProfitForecastMock =
    vi.fn();

const getRiskForecastMock =
    vi.fn();

// ============================================================
// MOCK DATA SERVICES
// ============================================================

const getExpenseHistoryMock =
    vi.fn();

const getDailyCOGSMock =
    vi.fn();

// ============================================================
// HISTORICAL EXPENSE DATA
// ============================================================

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
            25000
    }

];

// ============================================================
// HISTORICAL COGS DATA
// ============================================================

const cogsHistory = [

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
            70000
    }

];

// ============================================================
// REVENUE FORECAST
// ============================================================

const revenueForecast = {

    tomorrow:
        100000,

    next7Days:
        700000,

    next30Days:
        3000000,

    confidence:
        65

};

// ============================================================
// CASH FORECAST
// ============================================================

const cashForecast = {

    tomorrow:
        80000,

    next7Days:
        560000,

    next30Days:
        2400000

};

// ============================================================
// INVENTORY FORECAST
// ============================================================

const inventoryForecast = {

    totalProducts:
        5,

    productsRequiringReorder:
        2

};

// ============================================================
// INVENTORY DEMAND FORECAST
// ============================================================

const inventoryDemandForecast = {

    products:
        [],

    productsRequiringReorder:
        2

};

// ============================================================
// PROFIT FORECAST
// ============================================================

const profitForecast = {

    tomorrowProfit:
        40000,

    next7DaysProfit:
        280000,

    next30DaysProfit:
        1200000,

    status:
        "Profitable"

};

// ============================================================
// RISK FORECAST
// ============================================================

const riskForecast = {

    overallRisk:
        "Low",

    risks:
        []

};

// ============================================================
// MOCK SERVICES
// ============================================================
//
// These names MUST match the dependency-injection names
// used by forecastEngine.js.
//
// ============================================================

const mockServices = {

    getRevenueForecast:
        getRevenueForecastMock,

    getCashForecast:
        getCashForecastMock,

    getInventoryForecast:
        getInventoryForecastMock,

    getInventoryDemandForecast:
        getInventoryDemandForecastMock,

    getProfitForecast:
        getProfitForecastMock,

    getRiskForecast:
        getRiskForecastMock,

    getExpenseHistory:
        getExpenseHistoryMock,

    getDailyCOGS:
        getDailyCOGSMock

};

// ============================================================
// RESET MOCKS
// ============================================================

function setupMocks() {

    vi.clearAllMocks();

    getRevenueForecastMock
        .mockReturnValue(
            revenueForecast
        );

    getCashForecastMock
        .mockReturnValue(
            cashForecast
        );

    getInventoryForecastMock
        .mockReturnValue(
            inventoryForecast
        );

    getInventoryDemandForecastMock
        .mockReturnValue(
            inventoryDemandForecast
        );

    getProfitForecastMock
        .mockReturnValue(
            profitForecast
        );

    getRiskForecastMock
        .mockReturnValue(
            riskForecast
        );

    getExpenseHistoryMock
        .mockReturnValue(
            expenseHistory
        );

    getDailyCOGSMock
        .mockReturnValue(
            cogsHistory
        );

}

// ============================================================
// FORECAST ENGINE TESTS
// ============================================================

describe(
    "Forecast Engine",
    () => {

        // ====================================================
        // TEST 1
        // ====================================================

        it(
            "should build the complete forecast",
            () => {

                setupMocks();

                const result =
                    buildForecast(
                        USER_ID,
                        mockServices
                    );

                expect(
                    result
                ).toBeDefined();

                expect(
                    result
                ).toEqual({

                    revenue:
                        revenueForecast,

                    cash:
                        cashForecast,

                    inventory:
                        inventoryForecast,

                    inventoryDemand:
                        inventoryDemandForecast,

                    profit:
                        profitForecast,

                    expenseHistory:
                        expenseHistory,

                    cogsHistory:
                        cogsHistory,

                    risks:
                        riskForecast,

                    decisions:
                        [],

                    recommendations:
                        [],

                    executiveSummary: {

                        headline:
                            "No immediate business decisions are required.",

                        message:
                            "Current forecasts do not indicate significant conditions requiring immediate management action.",

                        status:
                            "Healthy",

                        topPriority:
                            "Maintain Current Operations"

                    },

                    advisor: {

                        businessStatus:
                            "Healthy",

                        overallPriority:
                            "Low",

                        headline:
                            "Business performance is currently healthy. Continue monitoring key financial indicators.",

                        assessment:
                            "The business currently appears healthy based on the available financial intelligence.",

                        keyIssues:
                            [],

                        opportunities:
                            [],

                        recommendedActions:
                            [],

                        confidence:
                            65,

                        sourceData: {

                            risks:
                                [],

                            decisions:
                                []

                        }

                    }

                });

            }
        );


        // ====================================================
        // TEST 2
        // ====================================================

        it(
            "should call every forecast service exactly once",
            () => {

                setupMocks();

                buildForecast(
                    USER_ID,
                    mockServices
                );

                expect(
                    getRevenueForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getCashForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getInventoryForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getInventoryDemandForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getProfitForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getRiskForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

            }
        );


        // ====================================================
        // TEST 3
        // ====================================================

        it(
            "should pass user ID to independent forecast services",
            () => {

                setupMocks();

                buildForecast(
                    USER_ID,
                    mockServices
                );

                expect(
                    getRevenueForecastMock
                ).toHaveBeenCalledWith(
                    USER_ID
                );

                expect(
                    getCashForecastMock
                ).toHaveBeenCalledWith(
                    USER_ID
                );

                expect(
                    getInventoryForecastMock
                ).toHaveBeenCalledWith(
                    USER_ID
                );

                expect(
                    getInventoryDemandForecastMock
                ).toHaveBeenCalledWith(
                    USER_ID
                );

            }
        );


        // ====================================================
        // TEST 4
        // ====================================================

        it(
            "should retrieve expense history exactly once",
            () => {

                setupMocks();

                buildForecast(
                    USER_ID,
                    mockServices
                );

                expect(
                    getExpenseHistoryMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getExpenseHistoryMock
                ).toHaveBeenCalledWith(
                    USER_ID
                );

            }
        );


        // ====================================================
        // TEST 5
        // ====================================================

        it(
            "should retrieve COGS history exactly once",
            () => {

                setupMocks();

                buildForecast(
                    USER_ID,
                    mockServices
                );

                expect(
                    getDailyCOGSMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getDailyCOGSMock
                ).toHaveBeenCalledWith(
                    USER_ID
                );

            }
        );


        // ====================================================
        // TEST 6
        // ====================================================

        it(
            "should pass revenue, expenses and COGS into profit forecast",
            () => {

                setupMocks();

                buildForecast(
                    USER_ID,
                    mockServices
                );

                expect(
                    getProfitForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getProfitForecastMock
                ).toHaveBeenCalledWith(

                    revenueForecast,

                    expenseHistory,

                    cogsHistory

                );

            }
        );


        // ====================================================
        // TEST 7
        // ====================================================

        it(
            "should pass all forecast objects into risk forecast",
            () => {

                setupMocks();

                buildForecast(
                    USER_ID,
                    mockServices
                );

                expect(
                    getRiskForecastMock
                ).toHaveBeenCalledTimes(
                    1
                );

                expect(
                    getRiskForecastMock
                ).toHaveBeenCalledWith(

                    USER_ID,

                    revenueForecast,

                    cashForecast,

                    inventoryForecast,

                    inventoryDemandForecast,

                    profitForecast

                );

            }
        );


        // ====================================================
        // TEST 8
        // ====================================================

        it(
            "should generate the Advisor Core assessment from complete intelligence",
            () => {

                setupMocks();

                const result =
                    buildForecast(
                        USER_ID,
                        mockServices
                    );

                expect(
                    result.advisor
                ).toBeDefined();

                expect(
                    result.advisor.businessStatus
                ).toBe(
                    "Healthy"
                );

                expect(
                    result.advisor.overallPriority
                ).toBe(
                    "Low"
                );

                expect(
                    result.advisor.confidence
                ).toBe(
                    65
                );

                expect(
                    result.advisor.keyIssues
                ).toEqual(
                    []
                );

                expect(
                    result.advisor.opportunities
                ).toEqual(
                    []
                );

                expect(
                    result.advisor.recommendedActions
                ).toEqual(
                    []
                );

                expect(
                    result.advisor.sourceData
                ).toEqual({

                    risks:
                        [],

                    decisions:
                        []

                });

            }
        );


        // ====================================================
        // TEST 9
        // ====================================================

        it(
            "should preserve the Advisor Core assessment structure",
            () => {

                setupMocks();

                const result =
                    buildForecast(
                        USER_ID,
                        mockServices
                    );

                expect(
                    result.advisor
                ).toStrictEqual({

                    businessStatus:
                        "Healthy",

                    overallPriority:
                        "Low",

                    headline:
                        "Business performance is currently healthy. Continue monitoring key financial indicators.",

                    assessment:
                        "The business currently appears healthy based on the available financial intelligence.",

                    keyIssues:
                        [],

                    opportunities:
                        [],

                    recommendedActions:
                        [],

                    confidence:
                        65,

                    sourceData: {

                        risks:
                            [],

                        decisions:
                            []

                    }

                });

            }
        );


        // ====================================================
        // TEST 10
        // ====================================================

        it(
            "should preserve forecast object identity",
            () => {

                setupMocks();

                const result =
                    buildForecast(
                        USER_ID,
                        mockServices
                    );

                expect(
                    result.revenue
                ).toBe(
                    revenueForecast
                );

                expect(
                    result.cash
                ).toBe(
                    cashForecast
                );

                expect(
                    result.inventory
                ).toBe(
                    inventoryForecast
                );

                expect(
                    result.inventoryDemand
                ).toBe(
                    inventoryDemandForecast
                );

                expect(
                    result.profit
                ).toBe(
                    profitForecast
                );

                expect(
                    result.risks
                ).toBe(
                    riskForecast
                );

            }
        );

    }
);