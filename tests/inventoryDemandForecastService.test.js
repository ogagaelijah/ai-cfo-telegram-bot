const {
    describe,
    it,
    expect,
    vi,
    beforeEach
} = await import("vitest");

const inventoryRepository =
    require("../src/repositories/inventoryRepository");

const trendsRepository =
    require("../src/repositories/businessTrendsRepository");

const {
    getInventoryDemandForecast
} =
    require("../src/services/forecasting/inventoryDemandForecastService");


// ============================================================
// INVENTORY DEMAND FORECAST SERVICE TESTS
// ============================================================

describe(
    "Inventory Demand Forecast Service",
    () => {

        beforeEach(() => {

            vi.restoreAllMocks();

        });


        // ======================================================
        // NO INVENTORY
        // ======================================================

        describe(
            "getInventoryDemandForecast() - no inventory",
            () => {

                it(
                    "should return No Inventory when user has no inventory",
                    () => {

                        vi.spyOn(
                            trendsRepository,
                            "getUserId"
                        ).mockReturnValue(1);

                        vi.spyOn(
                            inventoryRepository,
                            "findAll"
                        ).mockReturnValue([]);


                        const result =
                            getInventoryDemandForecast(
                                123456789
                            );


                        expect(
                            result
                        ).toEqual({

                            historyDays: 30,

                            products: [],

                            totalProducts: 0,

                            productsRequiringReorder: 0,

                            status: "No Inventory"

                        });

                    }
                );

            }
        );


        // ======================================================
        // HEALTHY PRODUCT
        // ======================================================

        describe(
            "getInventoryDemandForecast() - healthy product",
            () => {

                it(
                    "should generate a demand forecast for an inventory product",
                    () => {

                        vi.spyOn(
                            trendsRepository,
                            "getUserId"
                        ).mockReturnValue(1);


                        vi.spyOn(
                            inventoryRepository,
                            "findAll"
                        ).mockReturnValue([

                            {
                                id: 1,

                                product_name:
                                    "Rice",

                                quantity:
                                    100,

                                cost_price:
                                    1000,

                                selling_price:
                                    1500

                            }

                        ]);


                        vi.spyOn(
                            trendsRepository,
                            "getProductDailyDemand"
                        ).mockReturnValue([

                            {
                                product_name:
                                    "Rice",

                                date:
                                    "2026-08-01",

                                quantity:
                                    10

                            },

                            {
                                product_name:
                                    "Rice",

                                date:
                                    "2026-08-02",

                                quantity:
                                    12

                            },

                            {
                                product_name:
                                    "Rice",

                                date:
                                    "2026-08-03",

                                quantity:
                                    8

                            },

                            {
                                product_name:
                                    "Rice",

                                date:
                                    "2026-08-04",

                                quantity:
                                    10

                            }

                        ]);


                        const result =
                            getInventoryDemandForecast(
                                123456789
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.historyDays
                        ).toBe(30);


                        expect(
                            result.totalProducts
                        ).toBe(1);


                        expect(
                            result.products
                        ).toHaveLength(1);


                        const product =
                            result.products[0];


                        expect(
                            product.productId
                        ).toBe(1);


                        expect(
                            product.productName
                        ).toBe("Rice");


                        expect(
                            product.currentStock
                        ).toBe(100);


                        expect(
                            product.averageDailyDemand
                        ).toBe(10);


                        expect(
                            product.next7DaysDemand
                        ).toBe(70);


                        expect(
                            product.next30DaysDemand
                        ).toBe(300);


                        expect(
                            product.demandTrend
                        ).toBe(
                            "Stable"
                        );


                        expect(
                            product.demandStatus
                        ).toBe(
                            "Normal"
                        );


                        expect(
                            product.estimatedStockoutDays
                        ).toBe(10);


                        expect(
                            product.reorderRecommendation
                        ).toBe(
                            "Urgent"
                        );


                        expect(
                            product.confidence
                        ).toBe(50);


                        expect(
                            product.observations
                        ).toBe(4);


                        expect(
                            result.productsRequiringReorder
                        ).toBe(1);


                        expect(
                            result.status
                        ).toBe(
                            "Reorder Required"
                        );

                    }
                );

            }
        );


        // ======================================================
        // GROWING / DECLINING DEMAND
        // ======================================================

        describe(
            "Demand trend",
            () => {

                it(
                    "should identify growing demand",
                    () => {

                        vi.spyOn(
                            trendsRepository,
                            "getUserId"
                        ).mockReturnValue(1);


                        vi.spyOn(
                            inventoryRepository,
                            "findAll"
                        ).mockReturnValue([

                            {
                                id: 1,

                                product_name:
                                    "Bread",

                                quantity:
                                    100

                            }

                        ]);


                        vi.spyOn(
                            trendsRepository,
                            "getProductDailyDemand"
                        ).mockReturnValue([

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-01",

                                quantity:
                                    5

                            },

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-02",

                                quantity:
                                    5

                            },

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-03",

                                quantity:
                                    10

                            },

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-04",

                                quantity:
                                    10

                            }

                        ]);


                        const result =
                            getInventoryDemandForecast(
                                123456789
                            );


                        expect(
                            result.products[0].demandTrend
                        ).toBe(
                            "Growing"
                        );


                        expect(
                            result.products[0].demandStatus
                        ).toBe(
                            "Increasing"
                        );

                    }
                );


                it(
                    "should identify declining demand",
                    () => {

                        vi.spyOn(
                            trendsRepository,
                            "getUserId"
                        ).mockReturnValue(1);


                        vi.spyOn(
                            inventoryRepository,
                            "findAll"
                        ).mockReturnValue([

                            {
                                id: 1,

                                product_name:
                                    "Bread",

                                quantity:
                                    100

                            }

                        ]);


                        vi.spyOn(
                            trendsRepository,
                            "getProductDailyDemand"
                        ).mockReturnValue([

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-01",

                                quantity:
                                    10

                            },

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-02",

                                quantity:
                                    10

                            },

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-03",

                                quantity:
                                    5

                            },

                            {
                                product_name:
                                    "Bread",

                                date:
                                    "2026-08-04",

                                quantity:
                                    5

                            }

                        ]);


                        const result =
                            getInventoryDemandForecast(
                                123456789
                            );


                        expect(
                            result.products[0].demandTrend
                        ).toBe(
                            "Declining"
                        );


                        expect(
                            result.products[0].demandStatus
                        ).toBe(
                            "Declining"
                        );

                    }
                );

            }
        );


        // ======================================================
        // NO DEMAND
        // ======================================================

        describe(
            "No recent demand",
            () => {

                it(
                    "should handle products with no demand history",
                    () => {

                        vi.spyOn(
                            trendsRepository,
                            "getUserId"
                        ).mockReturnValue(1);


                        vi.spyOn(
                            inventoryRepository,
                            "findAll"
                        ).mockReturnValue([

                            {
                                id: 1,

                                product_name:
                                    "Milk",

                                quantity:
                                    50

                            }

                        ]);


                        vi.spyOn(
                            trendsRepository,
                            "getProductDailyDemand"
                        ).mockReturnValue([]);


                        const result =
                            getInventoryDemandForecast(
                                123456789
                            );


                        const product =
                            result.products[0];


                        expect(
                            product.averageDailyDemand
                        ).toBe(0);


                        expect(
                            product.next7DaysDemand
                        ).toBe(0);


                        expect(
                            product.next30DaysDemand
                        ).toBe(0);


                        expect(
                            product.demandTrend
                        ).toBe(
                            "Insufficient Data"
                        );


                        expect(
                            product.demandStatus
                        ).toBe(
                            "No Recent Demand"
                        );


                        expect(
                            product.estimatedStockoutDays
                        ).toBeNull();


                        expect(
                            product.reorderRecommendation
                        ).toBe(
                            "No Immediate Reorder"
                        );


                        expect(
                            product.confidence
                        ).toBe(0);


                        expect(
                            product.observations
                        ).toBe(0);


                        expect(
                            result.productsRequiringReorder
                        ).toBe(0);


                        expect(
                            result.status
                        ).toBe(
                            "Healthy"
                        );

                    }
                );

            }
        );


        // ======================================================
        // OUT OF STOCK
        // ======================================================

        describe(
            "Out of stock",
            () => {

                it(
                    "should recommend immediate reorder for zero stock",
                    () => {

                        vi.spyOn(
                            trendsRepository,
                            "getUserId"
                        ).mockReturnValue(1);


                        vi.spyOn(
                            inventoryRepository,
                            "findAll"
                        ).mockReturnValue([

                            {
                                id: 1,

                                product_name:
                                    "Sugar",

                                quantity:
                                    0

                            }

                        ]);


                        vi.spyOn(
                            trendsRepository,
                            "getProductDailyDemand"
                        ).mockReturnValue([

                            {
                                product_name:
                                    "Sugar",

                                date:
                                    "2026-08-01",

                                quantity:
                                    10

                            },

                            {
                                product_name:
                                    "Sugar",

                                date:
                                    "2026-08-02",

                                quantity:
                                    10

                            }

                        ]);


                        const result =
                            getInventoryDemandForecast(
                                123456789
                            );


                        const product =
                            result.products[0];


                        expect(
                            product.currentStock
                        ).toBe(0);


                        expect(
                            product.estimatedStockoutDays
                        ).toBe(0);


                        expect(
                            product.reorderRecommendation
                        ).toBe(
                            "Reorder Immediately"
                        );


                        expect(
                            result.productsRequiringReorder
                        ).toBe(1);


                        expect(
                            result.status
                        ).toBe(
                            "Reorder Required"
                        );

                    }
                );

            }
        );


        // ======================================================
        // MULTIPLE PRODUCTS
        // ======================================================

        describe(
            "Multiple products",
            () => {

                it(
                    "should forecast each inventory product independently",
                    () => {

                        vi.spyOn(
                            trendsRepository,
                            "getUserId"
                        ).mockReturnValue(1);


                        vi.spyOn(
                            inventoryRepository,
                            "findAll"
                        ).mockReturnValue([

                            {
                                id: 1,

                                product_name:
                                    "Rice",

                                quantity:
                                    100

                            },

                            {
                                id: 2,

                                product_name:
                                    "Beans",

                                quantity:
                                    200

                            }

                        ]);


                        vi.spyOn(
                            trendsRepository,
                            "getProductDailyDemand"
                        ).mockReturnValue([

                            {
                                product_name:
                                    "Rice",

                                date:
                                    "2026-08-01",

                                quantity:
                                    10

                            },

                            {
                                product_name:
                                    "Rice",

                                date:
                                    "2026-08-02",

                                quantity:
                                    10

                            },

                            {
                                product_name:
                                    "Beans",

                                date:
                                    "2026-08-01",

                                quantity:
                                    20

                            },

                            {
                                product_name:
                                    "Beans",

                                date:
                                    "2026-08-02",

                                quantity:
                                    30

                            }

                        ]);


                        const result =
                            getInventoryDemandForecast(
                                123456789
                            );


                        expect(
                            result.totalProducts
                        ).toBe(2);


                        expect(
                            result.products
                        ).toHaveLength(2);


                        expect(
                            result.products[0].productName
                        ).toBe(
                            "Rice"
                        );


                        expect(
                            result.products[0].averageDailyDemand
                        ).toBe(10);


                        expect(
                            result.products[1].productName
                        ).toBe(
                            "Beans"
                        );


                        expect(
                            result.products[1].averageDailyDemand
                        ).toBe(25);

                    }
                );

            }
        );

    }
);