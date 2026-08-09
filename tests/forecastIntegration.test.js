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
// MOCK FORECAST RESULTS
// ============================================================

const revenueForecast = {

    tomorrow: 100000,

    next7Days: 700000,

    next30Days: 3000000,

    confidence: 65

};


const cashForecast = {

    tomorrow: 80000,

    next7Days: 560000,

    next30Days: 2400000

};


const inventoryForecast = {

    totalProducts: 5,

    productsRequiringReorder: 2

};


const inventoryDemandForecast = {

    products: 5,

    productsRequiringReorder: 2

};


const profitForecast = {

    tomorrowProfit: 40000,

    next7DaysProfit: 280000,

    next30DaysProfit: 1200000,

    status: "Profitable"

};


const riskForecast = {

    overallRisk: "Low",

    risks: []

};


// ============================================================
// MOCK SERVICES
// ============================================================

function createMockServices() {

    return {

        getRevenueForecast:
            vi.fn(
                () =>
                    revenueForecast
            ),

        getCashForecast:
            vi.fn(
                () =>
                    cashForecast
            ),

        getInventoryForecast:
            vi.fn(
                () =>
                    inventoryForecast
            ),

        getInventoryDemandForecast:
            vi.fn(
                () =>
                    inventoryDemandForecast
            ),

        getProfitForecast:
            vi.fn(
                (
                    userId,
                    revenue
                ) => {

                    return profitForecast;

                }
            ),

        getRiskForecast:
            vi.fn(
                (
                    userId,
                    revenue,
                    cash,
                    inventory,
                    inventoryDemand
                ) => {

                    return riskForecast;

                }
            )

    };

}


// ============================================================
// FORECAST INTEGRATION TESTS
// ============================================================

describe(
    "Forecast Integration",
    () => {

        // ====================================================
        // COMPLETE FORECAST
        // ====================================================

        it(
            "should combine revenue, profit and inventory forecasts",
            () => {

                const services =
                    createMockServices();


                const result =
                    buildForecast(
                        USER_ID,
                        services
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.revenue
                ).toBe(
                    revenueForecast
                );


                expect(
                    result.profit
                ).toBe(
                    profitForecast
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
                    result.cash
                ).toBe(
                    cashForecast
                );


                expect(
                    result.risks
                ).toBe(
                    riskForecast
                );

            }
        );


        // ====================================================
        // REVENUE → PROFIT RELATIONSHIP
        // ====================================================

        it(
            "should pass revenue forecast into profit forecast",
            () => {

                const services =
                    createMockServices();


                buildForecast(
                    USER_ID,
                    services
                );


                expect(
                    services.getProfitForecast
                ).toHaveBeenCalledTimes(
                    1
                );


                expect(
                    services.getProfitForecast
                ).toHaveBeenCalledWith(

                    USER_ID,

                    revenueForecast

                );

            }
        );


        // ====================================================
        // PRESERVE INDIVIDUAL FORECAST OBJECTS
        // ====================================================

        it(
            "should preserve each individual forecast object",
            () => {

                const services =
                    createMockServices();


                const result =
                    buildForecast(
                        USER_ID,
                        services
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
        // ZERO REVENUE
        // ====================================================

        it(
            "should handle zero revenue safely",
            () => {

                const services =
                    createMockServices();


                services.getRevenueForecast
                    .mockReturnValue(
                        {
                            tomorrow: 0,
                            next7Days: 0,
                            next30Days: 0,
                            confidence: 0
                        }
                    );


                const result =
                    buildForecast(
                        USER_ID,
                        services
                    );


                expect(
                    result.revenue.tomorrow
                ).toBe(
                    0
                );


                expect(
                    result.revenue.next7Days
                ).toBe(
                    0
                );


                expect(
                    result.revenue.next30Days
                ).toBe(
                    0
                );


                expect(
                    result
                ).toHaveProperty(
                    "profit"
                );

            }
        );


        // ====================================================
        // ZERO INVENTORY
        // ====================================================

        it(
            "should handle zero inventory safely",
            () => {

                const services =
                    createMockServices();


                services.getInventoryForecast
                    .mockReturnValue(
                        {
                            totalProducts: 0,
                            productsRequiringReorder: 0
                        }
                    );


                services.getInventoryDemandForecast
                    .mockReturnValue(
                        {
                            products: 0,
                            productsRequiringReorder: 0
                        }
                    );


                const result =
                    buildForecast(
                        USER_ID,
                        services
                    );


                expect(
                    result.inventory.totalProducts
                ).toBe(
                    0
                );


                expect(
                    result.inventory.productsRequiringReorder
                ).toBe(
                    0
                );


                expect(
                    result.inventoryDemand.products
                ).toBe(
                    0
                );


                expect(
                    result.inventoryDemand.productsRequiringReorder
                ).toBe(
                    0
                );

            }
        );


        // ====================================================
        // CONFLICTING SIGNALS
        // ====================================================

        it(
            "should preserve conflicting forecast signals",
            () => {

                const services =
                    createMockServices();


                const conflictingRevenue = {

                    tomorrow: 50000,

                    next7Days: 350000,

                    next30Days: 1500000,

                    confidence: 80,

                    trend: "Growing"

                };


                const conflictingInventory = {

                    totalProducts: 10,

                    productsRequiringReorder: 8

                };


                const conflictingProfit = {

                    tomorrowProfit: -20000,

                    next7DaysProfit: -140000,

                    next30DaysProfit: -600000,

                    status: "Loss"

                };


                services.getRevenueForecast
                    .mockReturnValue(
                        conflictingRevenue
                    );


                services.getInventoryForecast
                    .mockReturnValue(
                        conflictingInventory
                    );


                services.getProfitForecast
                    .mockReturnValue(
                        conflictingProfit
                    );


                const result =
                    buildForecast(
                        USER_ID,
                        services
                    );


                expect(
                    result.revenue
                ).toBe(
                    conflictingRevenue
                );


                expect(
                    result.inventory
                ).toBe(
                    conflictingInventory
                );


                expect(
                    result.profit
                ).toBe(
                    conflictingProfit
                );


                expect(
                    result.revenue.trend
                ).toBe(
                    "Growing"
                );


                expect(
                    result.profit.status
                ).toBe(
                    "Loss"
                );


                expect(
                    result.inventory.productsRequiringReorder
                ).toBe(
                    8
                );

            }
        );


        // ====================================================
        // FORECAST PERIOD CONSISTENCY
        // ====================================================

        it(
            "should maintain consistent forecast periods",
            () => {

                const services =
                    createMockServices();


                const result =
                    buildForecast(
                        USER_ID,
                        services
                    );


                expect(
                    result.revenue
                ).toHaveProperty(
                    "tomorrow"
                );


                expect(
                    result.revenue
                ).toHaveProperty(
                    "next7Days"
                );


                expect(
                    result.revenue
                ).toHaveProperty(
                    "next30Days"
                );


                expect(
                    result.cash
                ).toHaveProperty(
                    "tomorrow"
                );


                expect(
                    result.cash
                ).toHaveProperty(
                    "next7Days"
                );


                expect(
                    result.cash
                ).toHaveProperty(
                    "next30Days"
                );


                expect(
                    result.profit
                ).toHaveProperty(
                    "tomorrowProfit"
                );


                expect(
                    result.profit
                ).toHaveProperty(
                    "next7DaysProfit"
                );


                expect(
                    result.profit
                ).toHaveProperty(
                    "next30DaysProfit"
                );

            }
        );

    }
);