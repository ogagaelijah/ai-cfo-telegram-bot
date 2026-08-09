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
// TEST DATA
// ============================================================

const USER_ID =
    999999;


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
// MOCK RESULTS
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


const cashForecast = {

    tomorrow:
        80000,

    next7Days:
        560000,

    next30Days:
        2400000

};


const inventoryForecast = {

    totalProducts:
        5,

    productsRequiringReorder:
        2

};


const inventoryDemandForecast = {

    products:
        5,

    productsRequiringReorder:
        2

};


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


const riskForecast = {

    overallRisk:
        "Low",

    risks:
        []

};


// ============================================================
// SERVICES OBJECT
// ============================================================
//
// Instead of relying on vi.mock() to intercept CommonJS
// require() calls, we inject the mock services directly
// into forecastEngine.
//
// This keeps the test isolated from the database.
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
        getRiskForecastMock

};


// ============================================================
// HELPER
// ============================================================

function setupMocks() {

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

}


// ============================================================
// FORECAST ENGINE TESTS
// ============================================================

describe(
    "Forecast Engine",
    () => {


        // ====================================================
        // COMPLETE FORECAST
        // ====================================================

        it(
            "should build the complete forecast",
            () => {

                vi.clearAllMocks();

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
                ).toHaveProperty(
                    "revenue"
                );


                expect(
                    result
                ).toHaveProperty(
                    "cash"
                );


                expect(
                    result
                ).toHaveProperty(
                    "inventory"
                );


                expect(
                    result
                ).toHaveProperty(
                    "inventoryDemand"
                );


                expect(
                    result
                ).toHaveProperty(
                    "profit"
                );


                expect(
                    result
                ).toHaveProperty(
                    "risks"
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


        // ====================================================
        // SERVICE CALL COUNT
        // ====================================================

        it(
            "should call every forecast service exactly once",
            () => {

                vi.clearAllMocks();

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
        // USER ID PROPAGATION
        // ====================================================

        it(
            "should pass the user ID to independent forecast services",
            () => {

                vi.clearAllMocks();

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
        // PROFIT INTEGRATION
        // ====================================================

        it(
            "should pass revenue forecast into profit forecast",
            () => {

                vi.clearAllMocks();

                setupMocks();


                buildForecast(
                    USER_ID,
                    mockServices
                );


                expect(
                    getProfitForecastMock
                ).toHaveBeenCalledWith(
                    USER_ID,
                    revenueForecast
                );

            }
        );


        // ====================================================
        // RISK INTEGRATION
        // ====================================================

        it(
            "should pass all required forecasts into risk forecast",
            () => {

                vi.clearAllMocks();

                setupMocks();


                buildForecast(
                    USER_ID,
                    mockServices
                );


                expect(
                    getRiskForecastMock
                ).toHaveBeenCalledWith(

                    USER_ID,

                    revenueForecast,

                    cashForecast,

                    inventoryForecast,

                    inventoryDemandForecast

                );

            }
        );


        // ====================================================
        // OBJECT IDENTITY
        // ====================================================

        it(
            "should return the exact objects produced by the forecast services",
            () => {

                vi.clearAllMocks();

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