const {
    describe,
    it,
    expect,
    vi,
    beforeEach
} = await import("vitest");


// ============================================================
// LOAD REAL SERVICE OBJECTS
// ============================================================
//
// executiveReportService.js uses CommonJS:
//
//     const analytics = require("./financialAnalyticsService");
//
// Therefore we use the same CommonJS module objects here
// and spy on their methods.
//
// This keeps the Executive Report tests isolated from the
// database without changing production code.
// ============================================================

const {
    createRequire
} = await import("node:module");


const require =
    createRequire(import.meta.url);


const analytics =
    require(
        "../src/services/financialAnalyticsService"
    );


const kpiService =
    require(
        "../src/services/businessKPIService"
    );


const trendService =
    require(
        "../src/services/businessTrendsService"
    );


const forecastService =
    require(
        "../src/services/businessForecastService"
    );


const insightsService =
    require(
        "../src/services/businessInsightsService"
    );


const profitLossService =
    require(
        "../src/services/profitLossService"
    );


const cashFlowService =
    require(
        "../src/services/cashFlowService"
    );


// ============================================================
// MOCK RETURN VALUES
// ============================================================

const mocks = {

    getBusinessSnapshot:
        vi.fn(),

    getBusinessHealth:
        vi.fn(),

    getBusinessKPIs:
        vi.fn(),

    getBusinessTrends:
        vi.fn(),

    getBusinessForecast:
        vi.fn(),

    getBusinessInsights:
        vi.fn(),

    getProfitLoss:
        vi.fn(),

    getCashFlow:
        vi.fn()

};


// ============================================================
// SPY ON REAL SERVICE METHODS
// ============================================================
//
// Executive Report uses CommonJS require() internally.
//
// These spies intercept those exact service methods so that
// the Executive Report tests never reach the real database.
// ============================================================

vi.spyOn(
    analytics,
    "getBusinessSnapshot"
).mockImplementation(
    (...args) =>
        mocks.getBusinessSnapshot(
            ...args
        )
);


vi.spyOn(
    analytics,
    "getBusinessHealth"
).mockImplementation(
    (...args) =>
        mocks.getBusinessHealth(
            ...args
        )
);


vi.spyOn(
    kpiService,
    "getBusinessKPIs"
).mockImplementation(
    (...args) =>
        mocks.getBusinessKPIs(
            ...args
        )
);


vi.spyOn(
    trendService,
    "getBusinessTrends"
).mockImplementation(
    (...args) =>
        mocks.getBusinessTrends(
            ...args
        )
);


vi.spyOn(
    forecastService,
    "getBusinessForecast"
).mockImplementation(
    (...args) =>
        mocks.getBusinessForecast(
            ...args
        )
);


vi.spyOn(
    insightsService,
    "getBusinessInsights"
).mockImplementation(
    (...args) =>
        mocks.getBusinessInsights(
            ...args
        )
);


vi.spyOn(
    profitLossService,
    "getProfitLoss"
).mockImplementation(
    (...args) =>
        mocks.getProfitLoss(
            ...args
        )
);


vi.spyOn(
    cashFlowService,
    "getCashFlow"
).mockImplementation(
    (...args) =>
        mocks.getCashFlow(
            ...args
        )
);


// ============================================================
// EXECUTIVE REPORT SERVICE
// ============================================================

const {
    getExecutiveReport
} = await import(
    "../src/services/executiveReportService"
);


// ============================================================
// TEST DATA
// ============================================================

const USER_ID =
    999999;


// ============================================================
// COMPLETE MOCK FORECAST
// ============================================================

function createForecast() {

    return {

        revenue: {

            tomorrow:
                100000,

            next7Days:
                700000,

            next30Days:
                3000000,

            confidence:
                80

        },


        cash: {

            tomorrow:
                120000,

            next7Days:
                840000,

            next30Days:
                3600000

        },


        inventory: {

            status:
                "Healthy"

        },


        inventoryDemand: {

            products:
                3,

            productsRequiringReorder:
                1

        },


        profit: {

            tomorrowProfit:
                40000,

            next7DaysProfit:
                280000,

            next30DaysProfit:
                1200000

        },


        expenseHistory: [

            {

                date:
                    "2026-08-01",

                expenses:
                    50000

            }

        ],


        cogsHistory: [

            {

                date:
                    "2026-08-01",

                costOfGoods:
                    30000

            }

        ],


        risks: [

            {

                type:
                    "Cash Flow Risk",

                severity:
                    "Warning",

                message:
                    "Projected cash pressure."

            }

        ],


        decisions: [

            {

                title:
                    "Protect Cash Flow",

                priority:
                    "High",

                score:
                    85

            },

            {

                title:
                    "Monitor Inventory",

                priority:
                    "Medium",

                score:
                    60

            }

        ],


        recommendations: [

            {

                title:
                    "Reduce unnecessary expenses",

                priority:
                    "High",

                score:
                    90

            },

            {

                title:
                    "Review inventory levels",

                priority:
                    "Medium",

                score:
                    60

            }

        ],


        advisor: {

            businessStatus:
                "Healthy",

            overallPriority:
                "High",

            headline:
                "Business is financially stable.",

            assessment:
                "Cash flow should be monitored.",

            keyIssues: [

                "Projected cash pressure"

            ],

            opportunities: [

                "Improve expense control"

            ],

            recommendedActions: [

                "Review unnecessary expenses"

            ],

            confidence:
                80,

            sourceData: {

                risks: [],

                decisions: []

            }

        },


        executiveSummary: {

            headline:
                "Business is stable.",

            message:
                "Continue monitoring cash flow.",

            status:
                "Healthy",

            topPriority:
                "Protect Cash Flow"

        }

    };

}


// ============================================================
// MOCK ALL SERVICES
// ============================================================

function setupMocks(
    forecast = createForecast()
) {

    mocks.getBusinessSnapshot.mockReturnValue({

        totalRevenue:
            1000000,

        totalExpenses:
            600000

    });


    mocks.getBusinessHealth.mockReturnValue({

        status:
            "Healthy",

        score:
            85

    });


    mocks.getBusinessKPIs.mockReturnValue({

        revenue:
            1000000,

        profit:
            400000,

        cash:
            500000

    });


    mocks.getBusinessTrends.mockReturnValue({

        revenueTrend:
            "Growing",

        expenseTrend:
            "Stable"

    });


    mocks.getBusinessForecast.mockReturnValue(
        forecast
    );


    mocks.getBusinessInsights.mockReturnValue({

        insights: [

            "Revenue is stable.",

            "Cash flow requires monitoring."

        ]

    });


    mocks.getProfitLoss.mockReturnValue({

        revenue:
            1000000,

        expenses:
            600000,

        profit:
            400000

    });


    mocks.getCashFlow.mockReturnValue({

        openingCash:
            400000,

        closingCash:
            500000,

        netCashFlow:
            100000

    });

}


// ============================================================
// RESET BEFORE EACH TEST
// ============================================================

beforeEach(
    () => {

        vi.clearAllMocks();

        setupMocks();

    }
);


// ============================================================
// TEST SUITE
// ============================================================

describe(
    "Executive Report Service",
    () => {


        // ====================================================
        // COMPLETE REPORT
        // ====================================================

        describe(
            "Complete Executive Report",
            () => {

                it(
                    "should build the complete executive report",
                    () => {

                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.dashboard
                        ).toBeDefined();


                        expect(
                            result.health
                        ).toBeDefined();


                        expect(
                            result.kpis
                        ).toBeDefined();


                        expect(
                            result.trends
                        ).toBeDefined();


                        expect(
                            result.forecast
                        ).toBeDefined();


                        expect(
                            result.insights
                        ).toBeDefined();


                        expect(
                            result.profitLoss
                        ).toBeDefined();


                        expect(
                            result.cashFlow
                        ).toBeDefined();


                        expect(
                            result.advisor
                        ).toBeDefined();


                        expect(
                            result.decisions
                        ).toBeDefined();


                        expect(
                            result.recommendations
                        ).toBeDefined();


                        expect(
                            result.executiveSummary
                        ).toBeDefined();

                    }
                );

            }
        );


        // ====================================================
        // SERVICE CALLS
        // ====================================================

        describe(
            "Service Calls",
            () => {

                it(
                    "should call every underlying service exactly once",
                    () => {

                        getExecutiveReport(
                            USER_ID
                        );


                        expect(
                            mocks.getBusinessSnapshot
                        ).toHaveBeenCalledTimes(
                            1
                        );


                        expect(
                            mocks.getBusinessHealth
                        ).toHaveBeenCalledTimes(
                            1
                        );


                        expect(
                            mocks.getBusinessKPIs
                        ).toHaveBeenCalledTimes(
                            1
                        );


                        expect(
                            mocks.getBusinessTrends
                        ).toHaveBeenCalledTimes(
                            1
                        );


                        expect(
                            mocks.getBusinessForecast
                        ).toHaveBeenCalledTimes(
                            1
                        );


                        expect(
                            mocks.getBusinessInsights
                        ).toHaveBeenCalledTimes(
                            1
                        );


                        expect(
                            mocks.getProfitLoss
                        ).toHaveBeenCalledTimes(
                            1
                        );


                        expect(
                            mocks.getCashFlow
                        ).toHaveBeenCalledTimes(
                            1
                        );

                    }
                );


                it(
                    "should pass the user ID to every service",
                    () => {

                        getExecutiveReport(
                            USER_ID
                        );


                        expect(
                            mocks.getBusinessSnapshot
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            mocks.getBusinessHealth
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            mocks.getBusinessKPIs
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            mocks.getBusinessTrends
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            mocks.getBusinessForecast
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            mocks.getBusinessInsights
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            mocks.getProfitLoss
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );


                        expect(
                            mocks.getCashFlow
                        ).toHaveBeenCalledWith(
                            USER_ID
                        );

                    }
                );

            }
        );


        // ====================================================
        // OBJECT PRESERVATION
        // ====================================================

        describe(
            "Object Preservation",
            () => {

                it(
                    "should preserve the exact forecast object",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.forecast
                        ).toBe(
                            forecast
                        );

                    }
                );


                it(
                    "should preserve the exact dashboard object",
                    () => {

                        const dashboard = {

                            totalRevenue:
                                2000000,

                            totalExpenses:
                                1000000

                        };


                        mocks.getBusinessSnapshot
                            .mockReturnValue(
                                dashboard
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.dashboard
                        ).toBe(
                            dashboard
                        );

                    }
                );


                it(
                    "should preserve the exact KPI object",
                    () => {

                        const kpis = {

                            revenue:
                                2000000,

                            profit:
                                900000,

                            cash:
                                700000

                        };


                        mocks.getBusinessKPIs
                            .mockReturnValue(
                                kpis
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.kpis
                        ).toBe(
                            kpis
                        );

                    }
                );

            }
        );


        // ====================================================
        // DECISION INTELLIGENCE
        // ====================================================

        describe(
            "Decision Intelligence",
            () => {

                it(
                    "should expose all decisions",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.decisions
                        ).toEqual(
                            forecast.decisions
                        );

                    }
                );


                it(
                    "should expose the highest-priority decision",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.topDecision
                        ).toEqual({

                            title:
                                "Protect Cash Flow",

                            priority:
                                "High",

                            score:
                                85

                        });

                    }
                );


                it(
                    "should return null top decision when no decisions exist",
                    () => {

                        const forecast =
                            createForecast();


                        forecast.decisions = [];


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.topDecision
                        ).toBeNull();

                    }
                );

            }
        );


        // ====================================================
        // RECOMMENDATION INTELLIGENCE
        // ====================================================

        describe(
            "Recommendation Intelligence",
            () => {

                it(
                    "should expose all recommendations",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.recommendations
                        ).toEqual(
                            forecast.recommendations
                        );

                    }
                );


                it(
                    "should expose the highest-priority recommendation",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.topRecommendation
                        ).toEqual({

                            title:
                                "Reduce unnecessary expenses",

                            priority:
                                "High",

                            score:
                                90

                        });

                    }
                );


                it(
                    "should return null top recommendation when none exist",
                    () => {

                        const forecast =
                            createForecast();


                        forecast.recommendations = [];


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.topRecommendation
                        ).toBeNull();

                    }
                );

            }
        );


        // ====================================================
        // ADVISOR INTELLIGENCE
        // ====================================================

        describe(
            "Advisor Intelligence",
            () => {

                it(
                    "should expose the advisor assessment from Forecast Engine",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.advisor
                        ).toEqual(
                            forecast.advisor
                        );

                    }
                );


                it(
                    "should preserve advisor fields",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.advisor.businessStatus
                        ).toBe(
                            "Healthy"
                        );


                        expect(
                            result.advisor.overallPriority
                        ).toBe(
                            "High"
                        );


                        expect(
                            result.advisor.confidence
                        ).toBe(
                            80
                        );


                        expect(
                            result.advisor.keyIssues
                        ).toEqual([

                            "Projected cash pressure"

                        ]);

                    }
                );

            }
        );


        // ====================================================
        // EXECUTIVE SUMMARY
        // ====================================================

        describe(
            "Executive Summary",
            () => {

                it(
                    "should expose the Forecast Engine executive summary",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.executiveSummary
                        ).toEqual(
                            forecast.executiveSummary
                        );

                    }
                );


                it(
                    "should fall back to advisor assessment when forecast summary is unavailable",
                    () => {

                        const forecast =
                            createForecast();


                        delete forecast.executiveSummary;


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.executiveSummary
                        ).toEqual({

                            headline:
                                forecast.advisor.headline,

                            message:
                                forecast.advisor.assessment,

                            status:
                                forecast.advisor.businessStatus,

                            topPriority:
                                forecast.advisor.overallPriority

                        });

                    }
                );


                it(
                    "should use the final fallback when both summary and advisor assessment are unavailable",
                    () => {

                        const forecast =
                            createForecast();


                        delete forecast.executiveSummary;

                        delete forecast.advisor;


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.executiveSummary
                        ).toEqual({

                            headline:
                                "No executive summary available.",

                            message:
                                "No executive summary is currently available.",

                            status:
                                "Unknown",

                            topPriority:
                                "None"

                        });

                    }
                );

            }
        );


        // ====================================================
        // RISK INTELLIGENCE
        // ====================================================

        describe(
            "Risk Intelligence",
            () => {

                it(
                    "should expose risks from the Forecast Engine",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.risks
                        ).toEqual(
                            forecast.risks
                        );

                    }
                );


                it(
                    "should safely return an empty risk list when risks are missing",
                    () => {

                        const forecast =
                            createForecast();


                        delete forecast.risks;


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result.risks
                        ).toEqual([]);

                    }
                );

            }
        );


        // ====================================================
        // DATA INTEGRITY
        // ====================================================

        describe(
            "Data Integrity",
            () => {

                it(
                    "should not mutate the Forecast Engine result",
                    () => {

                        const forecast =
                            createForecast();


                        const original =
                            JSON.parse(
                                JSON.stringify(
                                    forecast
                                )
                            );


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        getExecutiveReport(
                            USER_ID
                        );


                        expect(
                            forecast
                        ).toEqual(
                            original
                        );

                    }
                );


                it(
                    "should return independent report object",
                    () => {

                        const forecast =
                            createForecast();


                        mocks.getBusinessForecast
                            .mockReturnValue(
                                forecast
                            );


                        const result1 =
                            getExecutiveReport(
                                USER_ID
                            );


                        const result2 =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result1
                        ).not.toBe(
                            result2
                        );

                    }
                );

            }
        );


        // ====================================================
        // EMPTY INTELLIGENCE
        // ====================================================

        describe(
            "Empty Intelligence",
            () => {

                it(
                    "should safely handle an empty forecast object",
                    () => {

                        mocks.getBusinessForecast
                            .mockReturnValue({});


                        const result =
                            getExecutiveReport(
                                USER_ID
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.decisions
                        ).toEqual([]);


                        expect(
                            result.recommendations
                        ).toEqual([]);


                        expect(
                            result.risks
                        ).toEqual([]);


                        expect(
                            result.topDecision
                        ).toBeNull();


                        expect(
                            result.topRecommendation
                        ).toBeNull();

                    }
                );

            }
        );

    }
);