import {
    describe,
    it,
    expect
} from "vitest";


// ============================================================
// RISK FORECAST SERVICE
// ============================================================

const {
    getRiskForecast
} = await import(
    "../src/services/forecasting/riskForecastService"
);


// ============================================================
// TEST USER
// ============================================================

const USER_ID = 999999;


// ============================================================
// TEST SUITE
// ============================================================

describe(
    "Risk Forecast Service",
    () => {

        // ========================================================
        // CURRENT NEGATIVE CASH
        // ========================================================

        describe(
            "Cash Flow Risk",
            () => {

                it(
                    "should detect negative current cash",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Stable",

                                    confidence:
                                        90
                                },

                                {
                                    currentCash:
                                        -395610,

                                    next7Days:
                                        -919221.6667,

                                    next30Days:
                                        -2639660,

                                    estimatedDailyBurn:
                                        74801.6667,

                                    cashTrend:
                                        "Declining"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: []
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Cash Flow Risk"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Critical");


                        expect(
                            risk.category
                        ).toBe("Liquidity");


                        expect(
                            risk.message
                        ).toContain(
                            "Cash is currently negative"
                        );

                    }
                );


                // ====================================================
                // PROJECTED CASH SHORTAGE
                // ====================================================

                it(
                    "should detect projected cash shortage",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Stable",

                                    confidence:
                                        90
                                },

                                {
                                    currentCash:
                                        250000,

                                    next7Days:
                                        -50000,

                                    next30Days:
                                        -100000,

                                    estimatedDailyBurn:
                                        5000,

                                    cashTrend:
                                        "Declining"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: []
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Projected Cash Shortage"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Critical");


                        expect(
                            risk.category
                        ).toBe("Liquidity");

                    }
                );


                // ====================================================
                // DECLINING CASH FLOW
                // ====================================================

                it(
                    "should detect declining cash flow when cash is positive",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Stable",

                                    confidence:
                                        90
                                },

                                {
                                    currentCash:
                                        250000,

                                    next7Days:
                                        150000,

                                    next30Days:
                                        50000,

                                    estimatedDailyBurn:
                                        10000,

                                    cashTrend:
                                        "Declining"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: []
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Declining Cash Flow"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Warning");


                        expect(
                            risk.category
                        ).toBe("Liquidity");

                    }
                );

            }
        );


        // ========================================================
        // REVENUE RISKS
        // ========================================================

        describe(
            "Revenue Risk",
            () => {

                // ====================================================
                // DECLINING SALES
                // ====================================================

                it(
                    "should detect declining sales",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Declining",

                                    confidence:
                                        80
                                },

                                {
                                    currentCash:
                                        500000,

                                    next7Days:
                                        400000,

                                    next30Days:
                                        300000,

                                    estimatedDailyBurn:
                                        0,

                                    cashTrend:
                                        "Stable"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: []
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Sales Trend"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Warning");


                        expect(
                            risk.category
                        ).toBe("Revenue");

                    }
                );


                // ====================================================
                // LIMITED REVENUE HISTORY
                // ====================================================

                it(
                    "should detect limited revenue history",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Insufficient Data",

                                    confidence:
                                        50,

                                    activeSalesDays:
                                        2
                                },

                                {
                                    currentCash:
                                        500000,

                                    next7Days:
                                        400000,

                                    next30Days:
                                        300000,

                                    estimatedDailyBurn:
                                        0,

                                    cashTrend:
                                        "Stable"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: []
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Limited Revenue History"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Info");


                        expect(
                            risk.category
                        ).toBe("Revenue");


                        expect(
                            risk.message
                        ).toContain(
                            "2 active selling day(s)"
                        );

                    }
                );

            }
        );


        // ========================================================
        // INVENTORY RISKS
        // ========================================================

        describe(
            "Inventory Risk",
            () => {

                // ====================================================
                // CRITICAL INVENTORY
                // ====================================================

                it(
                    "should detect critical inventory",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Stable",

                                    confidence:
                                        90
                                },

                                {
                                    currentCash:
                                        500000,

                                    next7Days:
                                        400000,

                                    next30Days:
                                        300000,

                                    estimatedDailyBurn:
                                        0,

                                    cashTrend:
                                        "Stable"
                                },

                                {
                                    restockUrgency:
                                        "Critical"
                                },

                                {
                                    products: []
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Inventory Risk"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Critical");


                        expect(
                            risk.category
                        ).toBe("Inventory");

                    }
                );

            }
        );


        // ========================================================
        // INVENTORY DEMAND RISKS
        // ========================================================

        describe(
            "Inventory Demand Risk",
            () => {

                // ====================================================
                // URGENT REORDER
                // ====================================================

                it(
                    "should detect urgent product reorder",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Insufficient Data",

                                    confidence:
                                        65
                                },

                                {
                                    currentCash:
                                        500000,

                                    next7Days:
                                        400000,

                                    next30Days:
                                        300000,

                                    estimatedDailyBurn:
                                        0,

                                    cashTrend:
                                        "Stable"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: [

                                        {
                                            productId:
                                                1,

                                            productName:
                                                "Garri",

                                            estimatedStockoutDays:
                                                7.63,

                                            reorderRecommendation:
                                                "Urgent",

                                            confidence:
                                                30
                                        }

                                    ]
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Urgent Product Reorder: Garri"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Critical");


                        expect(
                            risk.category
                        ).toBe("Inventory Demand");


                        expect(
                            risk.message
                        ).toContain(
                            "7.6 days"
                        );

                    }
                );


                // ====================================================
                // REORDER SOON
                // ====================================================

                it(
                    "should detect products requiring reorder soon",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Stable",

                                    confidence:
                                        90
                                },

                                {
                                    currentCash:
                                        500000,

                                    next7Days:
                                        400000,

                                    next30Days:
                                        300000,

                                    estimatedDailyBurn:
                                        0,

                                    cashTrend:
                                        "Stable"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: [

                                        {
                                            productId:
                                                2,

                                            productName:
                                                "Noodles",

                                            estimatedStockoutDays:
                                                12.4,

                                            reorderRecommendation:
                                                "Reorder Soon",

                                            confidence:
                                                70
                                        }

                                    ]
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Upcoming Product Stockout: Noodles"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Warning");


                        expect(
                            risk.category
                        ).toBe("Inventory Demand");


                        expect(
                            risk.message
                        ).toContain(
                            "12.4 days"
                        );

                    }
                );


                // ====================================================
                // LOW DEMAND CONFIDENCE
                // ====================================================

                it(
                    "should detect low inventory demand confidence",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Stable",

                                    confidence:
                                        90
                                },

                                {
                                    currentCash:
                                        500000,

                                    next7Days:
                                        400000,

                                    next30Days:
                                        300000,

                                    estimatedDailyBurn:
                                        0,

                                    cashTrend:
                                        "Stable"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: [

                                        {
                                            productId:
                                                1,

                                            productName:
                                                "Garri",

                                            estimatedStockoutDays:
                                                7.6,

                                            reorderRecommendation:
                                                "Urgent",

                                            confidence:
                                                30
                                        },

                                        {
                                            productId:
                                                2,

                                            productName:
                                                "Noodles",

                                            estimatedStockoutDays:
                                                8,

                                            reorderRecommendation:
                                                "Urgent",

                                            confidence:
                                                30
                                        }

                                    ]
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Inventory Demand Confidence"
                            );


                        expect(
                            risk
                        ).toBeDefined();


                        expect(
                            risk.severity
                        ).toBe("Info");


                        expect(
                            risk.category
                        ).toBe("Data Quality");


                        expect(
                            risk.message
                        ).toContain(
                            "2 product(s)"
                        );

                    }
                );

            }
        );


        // ========================================================
        // PROFITABILITY RISKS
        // ========================================================

        describe(
            "Profitability Risk",
            () => {

                it(
                    "should detect break-even forecast",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Stable",

                                    confidence:
                                        90
                                },

                                {
                                    currentCash:
                                        500000,

                                    next7Days:
                                        400000,

                                    next30Days:
                                        300000,

                                    estimatedDailyBurn:
                                        0,

                                    cashTrend:
                                        "Stable"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: []
                                }
                            );


                        const risk =
                            result.find(
                                item =>
                                    item.title ===
                                    "Break-even Forecast"
                            );


                        if (
                            risk
                        ) {

                            expect(
                                risk.severity
                            ).toBe("Warning");


                            expect(
                                risk.category
                            ).toBe("Profitability");

                        }

                    }
                );

            }
        );


        // ========================================================
        // CURRENT FORECAST SCENARIO
        // ========================================================

        describe(
            "Current Forecast Scenario",
            () => {

                it(
                    "should produce the expected risk categories",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,

                                {
                                    trend:
                                        "Insufficient Data",

                                    confidence:
                                        65,

                                    activeSalesDays:
                                        2
                                },

                                {
                                    currentCash:
                                        -395610,

                                    next7Days:
                                        -919221.6667,

                                    next30Days:
                                        -2639660,

                                    estimatedDailyBurn:
                                        74801.6667,

                                    cashTrend:
                                        "Declining"
                                },

                                {
                                    restockUrgency:
                                        "Low"
                                },

                                {
                                    products: [

                                        {
                                            productId:
                                                1,

                                            productName:
                                                "Garri",

                                            estimatedStockoutDays:
                                                7.63,

                                            reorderRecommendation:
                                                "Urgent",

                                            confidence:
                                                30
                                        },

                                        {
                                            productId:
                                                2,

                                            productName:
                                                "Noodles",

                                            estimatedStockoutDays:
                                                8,

                                            reorderRecommendation:
                                                "Urgent",

                                            confidence:
                                                30
                                        }

                                    ]
                                }
                            );


                        expect(
                            result.length
                        ).toBeGreaterThanOrEqual(
                            4
                        );


                        const criticalRisks =
                            result.filter(
                                risk =>
                                    risk.severity ===
                                    "Critical"
                            );


                        expect(
                            criticalRisks.length
                        ).toBeGreaterThanOrEqual(
                            3
                        );


                        const cashRisk =
                            result.find(
                                risk =>
                                    risk.title ===
                                    "Cash Flow Risk"
                            );


                        expect(
                            cashRisk
                        ).toBeDefined();


                        const garriRisk =
                            result.find(
                                risk =>
                                    risk.title ===
                                    "Urgent Product Reorder: Garri"
                            );


                        expect(
                            garriRisk
                        ).toBeDefined();


                        const noodlesRisk =
                            result.find(
                                risk =>
                                    risk.title ===
                                    "Urgent Product Reorder: Noodles"
                            );


                        expect(
                            noodlesRisk
                        ).toBeDefined();


                        const confidenceRisk =
                            result.find(
                                risk =>
                                    risk.title ===
                                    "Inventory Demand Confidence"
                            );


                        expect(
                            confidenceRisk
                        ).toBeDefined();

                    }
                );

            }
        );


        // ========================================================
        // INPUT SAFETY
        // ========================================================

        describe(
            "Input Safety",
            () => {

                it(
                    "should safely handle missing forecast objects",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,
                                null,
                                null,
                                null,
                                null
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            Array.isArray(
                                result
                            )
                        ).toBe(true);


                        expect(
                            result.length
                        ).toBeGreaterThan(
                            0
                        );

                    }
                );


                it(
                    "should safely handle empty forecast objects",
                    () => {

                        const result =
                            getRiskForecast(
                                USER_ID,
                                {},
                                {},
                                {},
                                {}
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            Array.isArray(
                                result
                            )
                        ).toBe(true);

                    }
                );

            }
        );

    }
);