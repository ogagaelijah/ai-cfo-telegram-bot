const {
    describe,
    it,
    expect
} = await import("vitest");

// ============================================================
// SCENARIO ENGINE
// ============================================================
//
// Tests the deterministic Scenario Engine.
//
// The Scenario Engine must:
//
// 1. Never modify real business data.
// 2. Simulate revenue changes safely.
// 3. Simulate expense changes safely.
// 4. Calculate cash impact from revenue scenarios.
// 5. Determine scenario status.
// 6. Produce actionable scenario decisions.
// 7. Handle missing or invalid data safely.
// 8. Support revenue and expense scenarios.
// 9. Reject unsupported scenario types safely.
//
// ============================================================

const {
    buildScenario,
    buildRevenueScenario,
    buildExpenseScenario,
    analyzeRevenueScenario,
    analyzeExpenseScenario,
    simulateRevenueChange,
    simulateExpenseChange,
    analyzeCashImpact,
    determineCashOutlook,
    determineRevenueScenarioStatus,
    formatMoney
} = await import(
    "../src/services/intelligence/scenarioEngine.js"
);


// ============================================================
// TEST DATA
// ============================================================

const BASE_REVENUE = {

    tomorrow:
        100000,

    next7Days:
        700000,

    next30Days:
        3000000

};


const BASE_CASH = {

    next7Days:
        500000,

    next30Days:
        1500000

};


const EXPENSE_HISTORY = [

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
            40000
    }

];


const FORECAST = {

    revenue:
        BASE_REVENUE,

    cash:
        BASE_CASH,

    expenseHistory:
        EXPENSE_HISTORY

};


// ============================================================
// NUMBER SAFETY
// ============================================================

describe(
    "Scenario Engine - Number Safety",
    () => {

        it(
            "should safely handle invalid revenue values",
            () => {

                const result =
                    simulateRevenueChange(
                        {
                            tomorrow:
                                "invalid",

                            next7Days:
                                null,

                            next30Days:
                                undefined

                        },
                        -20
                    );


                expect(
                    result.tomorrow
                ).toBe(0);


                expect(
                    result.next7Days
                ).toBe(0);


                expect(
                    result.next30Days
                ).toBe(0);

            }
        );


        it(
            "should safely handle invalid expense values",
            () => {

                const result =
                    simulateExpenseChange(
                        [
                            {
                                expenses:
                                    "invalid"
                            },

                            {
                                expenses:
                                    null
                            },

                            {
                                expenses:
                                    undefined
                            }

                        ],
                        20
                    );


                expect(
                    result.currentExpenses
                ).toBe(0);


                expect(
                    result.projectedExpenses
                ).toBe(0);


                expect(
                    result.additionalExpenses
                ).toBe(0);

            }
        );

    }
);


// ============================================================
// FORMAT MONEY
// ============================================================

describe(
    "formatMoney()",
    () => {

        it(
            "should format positive money values",
            () => {

                expect(
                    formatMoney(
                        100000
                    )
                ).toBe(
                    "₦100,000"
                );

            }
        );


        it(
            "should format zero correctly",
            () => {

                expect(
                    formatMoney(
                        0
                    )
                ).toBe(
                    "₦0"
                );

            }
        );


        it(
            "should round decimal values",
            () => {

                expect(
                    formatMoney(
                        100000.75
                    )
                ).toBe(
                    "₦100,001"
                );

            }
        );


        it(
            "should safely format invalid values",
            () => {

                expect(
                    formatMoney(
                        "invalid"
                    )
                ).toBe(
                    "₦0"
                );

            }
        );

    }
);


// ============================================================
// SIMULATE REVENUE CHANGE
// ============================================================

describe(
    "simulateRevenueChange()",
    () => {

        it(
            "should simulate a 20 percent revenue decrease",
            () => {

                const result =
                    simulateRevenueChange(
                        BASE_REVENUE,
                        -20
                    );


                expect(
                    result.tomorrow
                ).toBe(
                    80000
                );


                expect(
                    result.next7Days
                ).toBe(
                    560000
                );


                expect(
                    result.next30Days
                ).toBe(
                    2400000
                );

            }
        );


        it(
            "should simulate a 10 percent revenue increase",
            () => {

                const result =
                    simulateRevenueChange(
                        BASE_REVENUE,
                        10
                    );


                expect(
                    result.tomorrow
                ).toBe(
                    110000
                );


                expect(
                    result.next7Days
                ).toBe(
                    770000
                );


                expect(
                    result.next30Days
                ).toBe(
                    3300000
                );

            }
        );


        it(
            "should return the baseline when change is zero",
            () => {

                const result =
                    simulateRevenueChange(
                        BASE_REVENUE,
                        0
                    );


                expect(
                    result.tomorrow
                ).toBe(
                    100000
                );


                expect(
                    result.next7Days
                ).toBe(
                    700000
                );


                expect(
                    result.next30Days
                ).toBe(
                    3000000
                );

            }
        );


        it(
            "should handle 100 percent revenue decrease",
            () => {

                const result =
                    simulateRevenueChange(
                        BASE_REVENUE,
                        -100
                    );


                expect(
                    result.tomorrow
                ).toBe(
                    0
                );


                expect(
                    result.next7Days
                ).toBe(
                    0
                );


                expect(
                    result.next30Days
                ).toBe(
                    0
                );

            }
        );


        it(
            "should handle revenue increases greater than 100 percent",
            () => {

                const result =
                    simulateRevenueChange(
                        BASE_REVENUE,
                        200
                    );


                expect(
                    result.tomorrow
                ).toBe(
                    300000
                );


                expect(
                    result.next7Days
                ).toBe(
                    2100000
                );


                expect(
                    result.next30Days
                ).toBe(
                    9000000
                );

            }
        );


        it(
            "should not modify the original revenue object",
            () => {

                const original = {

                    tomorrow:
                        100000,

                    next7Days:
                        700000,

                    next30Days:
                        3000000

                };


                simulateRevenueChange(
                    original,
                    -20
                );


                expect(
                    original
                ).toEqual({

                    tomorrow:
                        100000,

                    next7Days:
                        700000,

                    next30Days:
                        3000000

                });

            }
        );


        it(
            "should safely handle missing revenue data",
            () => {

                const result =
                    simulateRevenueChange(
                        {},
                        -20
                    );


                expect(
                    result.tomorrow
                ).toBe(0);


                expect(
                    result.next7Days
                ).toBe(0);


                expect(
                    result.next30Days
                ).toBe(0);

            }
        );

    }
);


// ============================================================
// ANALYZE REVENUE SCENARIO
// ============================================================

describe(
    "analyzeRevenueScenario()",
    () => {

        it(
            "should analyze a revenue decrease correctly",
            () => {

                const result =
                    analyzeRevenueScenario(
                        BASE_REVENUE,
                        -20
                    );


                expect(
                    result.type
                ).toBe(
                    "revenue"
                );


                expect(
                    result.changePercentage
                ).toBe(
                    -20
                );


                expect(
                    result.direction
                ).toBe(
                    "decrease"
                );


                expect(
                    result.baseline.tomorrow
                ).toBe(
                    100000
                );


                expect(
                    result.scenario.tomorrow
                ).toBe(
                    80000
                );


                expect(
                    result.difference.tomorrow
                ).toBe(
                    -20000
                );


                expect(
                    result.impact
                ).toContain(
                    "₦20,000"
                );

            }
        );


        it(
            "should analyze a revenue increase correctly",
            () => {

                const result =
                    analyzeRevenueScenario(
                        BASE_REVENUE,
                        10
                    );


                expect(
                    result.direction
                ).toBe(
                    "increase"
                );


                expect(
                    result.scenario.tomorrow
                ).toBe(
                    110000
                );


                expect(
                    result.difference.tomorrow
                ).toBe(
                    10000
                );


                expect(
                    result.impact
                ).toContain(
                    "₦10,000"
                );

            }
        );


        it(
            "should analyze a zero-change scenario",
            () => {

                const result =
                    analyzeRevenueScenario(
                        BASE_REVENUE,
                        0
                    );


                expect(
                    result.direction
                ).toBe(
                    "no change"
                );


                expect(
                    result.difference.tomorrow
                ).toBe(
                    0
                );


                expect(
                    result.impact
                ).toContain(
                    "no material revenue change"
                );

            }
        );


        it(
            "should calculate differences for all forecast periods",
            () => {

                const result =
                    analyzeRevenueScenario(
                        BASE_REVENUE,
                        -20
                    );


                expect(
                    result.difference.tomorrow
                ).toBe(
                    -20000
                );


                expect(
                    result.difference.next7Days
                ).toBe(
                    -140000
                );


                expect(
                    result.difference.next30Days
                ).toBe(
                    -600000
                );

            }
        );

    }
);


// ============================================================
// SIMULATE EXPENSE CHANGE
// ============================================================

describe(
    "simulateExpenseChange()",
    () => {

        it(
            "should calculate total expense history",
            () => {

                const result =
                    simulateExpenseChange(
                        EXPENSE_HISTORY,
                        0
                    );


                expect(
                    result.currentExpenses
                ).toBe(
                    150000
                );

            }
        );


        it(
            "should simulate a 20 percent expense increase",
            () => {

                const result =
                    simulateExpenseChange(
                        EXPENSE_HISTORY,
                        20
                    );


                expect(
                    result.currentExpenses
                ).toBe(
                    150000
                );


                expect(
                    result.projectedExpenses
                ).toBe(
                    180000
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    30000
                );


                expect(
                    result.direction
                ).toBe(
                    "increase"
                );

            }
        );


        it(
            "should simulate a 20 percent expense decrease",
            () => {

                const result =
                    simulateExpenseChange(
                        EXPENSE_HISTORY,
                        -20
                    );


                expect(
                    result.currentExpenses
                ).toBe(
                    150000
                );


                expect(
                    result.projectedExpenses
                ).toBe(
                    120000
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    -30000
                );


                expect(
                    result.direction
                ).toBe(
                    "decrease"
                );

            }
        );


        it(
            "should support amount instead of expenses",
            () => {

                const history = [

                    {
                        date:
                            "2026-08-01",

                        amount:
                            50000
                    },

                    {
                        date:
                            "2026-08-02",

                        amount:
                            25000
                    }

                ];


                const result =
                    simulateExpenseChange(
                        history,
                        20
                    );


                expect(
                    result.currentExpenses
                ).toBe(
                    75000
                );


                expect(
                    result.projectedExpenses
                ).toBe(
                    90000
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    15000
                );

            }
        );


        it(
            "should safely ignore negative expense values",
            () => {

                const history = [

                    {
                        expenses:
                            -50000
                    },

                    {
                        expenses:
                            100000
                    }

                ];


                const result =
                    simulateExpenseChange(
                        history,
                        0
                    );


                expect(
                    result.currentExpenses
                ).toBe(
                    100000
                );

            }
        );


        it(
            "should safely handle empty expense history",
            () => {

                const result =
                    simulateExpenseChange(
                        [],
                        20
                    );


                expect(
                    result.currentExpenses
                ).toBe(
                    0
                );


                expect(
                    result.projectedExpenses
                ).toBe(
                    0
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    0
                );

            }
        );


        it(
            "should safely handle non-array expense history",
            () => {

                const result =
                    simulateExpenseChange(
                        null,
                        20
                    );


                expect(
                    result.currentExpenses
                ).toBe(
                    0
                );


                expect(
                    result.projectedExpenses
                ).toBe(
                    0
                );

            }
        );


        it(
            "should not modify expense history",
            () => {

                const original = [

                    {
                        date:
                            "2026-08-01",

                        expenses:
                            50000
                    }

                ];


                const copy =
                    JSON.parse(
                        JSON.stringify(
                            original
                        )
                    );


                simulateExpenseChange(
                    original,
                    50
                );


                expect(
                    original
                ).toEqual(
                    copy
                );

            }
        );

    }
);


// ============================================================
// ANALYZE EXPENSE SCENARIO
// ============================================================

describe(
    "analyzeExpenseScenario()",
    () => {

        it(
            "should analyze an expense increase",
            () => {

                const result =
                    analyzeExpenseScenario(
                        EXPENSE_HISTORY,
                        20
                    );


                expect(
                    result.type
                ).toBe(
                    "expense"
                );


                expect(
                    result.changePercentage
                ).toBe(
                    20
                );


                expect(
                    result.direction
                ).toBe(
                    "increase"
                );


                expect(
                    result.baseline
                ).toBe(
                    150000
                );


                expect(
                    result.scenario
                ).toBe(
                    180000
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    30000
                );


                expect(
                    result.impact
                ).toContain(
                    "₦30,000"
                );

            }
        );


        it(
            "should analyze an expense reduction",
            () => {

                const result =
                    analyzeExpenseScenario(
                        EXPENSE_HISTORY,
                        -20
                    );


                expect(
                    result.direction
                ).toBe(
                    "decrease"
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    -30000
                );


                expect(
                    result.impact
                ).toContain(
                    "₦30,000"
                );

            }
        );


        it(
            "should handle zero expense history",
            () => {

                const result =
                    analyzeExpenseScenario(
                        [],
                        20
                    );


                expect(
                    result.baseline
                ).toBe(
                    0
                );


                expect(
                    result.scenario
                ).toBe(
                    0
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    0
                );


                expect(
                    result.impact
                ).toContain(
                    "not enough expense history"
                );

            }
        );


        it(
            "should analyze zero expense change",
            () => {

                const result =
                    analyzeExpenseScenario(
                        EXPENSE_HISTORY,
                        0
                    );


                expect(
                    result.direction
                ).toBe(
                    "no change"
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    0
                );


                expect(
                    result.impact
                ).toContain(
                    "no material expense change"
                );

            }
        );

    }
);


// ============================================================
// CASH IMPACT
// ============================================================

describe(
    "analyzeCashImpact()",
    () => {

        it(
            "should calculate cash impact from revenue decline",
            () => {

                const revenueScenario = {

                    difference: {

                        next7Days:
                            -140000,

                        next30Days:
                            -600000

                    }

                };


                const result =
                    analyzeCashImpact(
                        BASE_CASH,
                        revenueScenario
                    );


                expect(
                    result.baseline.next7Days
                ).toBe(
                    500000
                );


                expect(
                    result.baseline.next30Days
                ).toBe(
                    1500000
                );


                expect(
                    result.scenario.next7Days
                ).toBe(
                    360000
                );


                expect(
                    result.scenario.next30Days
                ).toBe(
                    900000
                );


                expect(
                    result.difference.next7Days
                ).toBe(
                    -140000
                );


                expect(
                    result.difference.next30Days
                ).toBe(
                    -600000
                );

            }
        );


        it(
            "should calculate cash improvement from revenue increase",
            () => {

                const revenueScenario = {

                    difference: {

                        next7Days:
                            140000,

                        next30Days:
                            600000

                    }

                };


                const result =
                    analyzeCashImpact(
                        BASE_CASH,
                        revenueScenario
                    );


                expect(
                    result.scenario.next7Days
                ).toBe(
                    640000
                );


                expect(
                    result.scenario.next30Days
                ).toBe(
                    2100000
                );

            }
        );


        it(
            "should safely handle missing cash data",
            () => {

                const result =
                    analyzeCashImpact(
                        {},
                        {}
                    );


                expect(
                    result.baseline.next7Days
                ).toBe(
                    0
                );


                expect(
                    result.baseline.next30Days
                ).toBe(
                    0
                );


                expect(
                    result.scenario.next7Days
                ).toBe(
                    0
                );


                expect(
                    result.scenario.next30Days
                ).toBe(
                    0
                );

            }
        );

    }
);


// ============================================================
// CASH OUTLOOK
// ============================================================

describe(
    "determineCashOutlook()",
    () => {

        it(
            "should return Healthy for positive cash",
            () => {

                expect(
                    determineCashOutlook(
                        500000,
                        1500000
                    )
                ).toBe(
                    "Healthy"
                );

            }
        );


        it(
            "should return Critical when seven-day cash is negative",
            () => {

                expect(
                    determineCashOutlook(
                        -100000,
                        500000
                    )
                ).toBe(
                    "Critical"
                );

            }
        );


        it(
            "should return Critical when thirty-day cash is negative",
            () => {

                expect(
                    determineCashOutlook(
                        500000,
                        -100000
                    )
                ).toBe(
                    "Critical"
                );

            }
        );


        it(
            "should return Pressure when seven-day cash is zero",
            () => {

                expect(
                    determineCashOutlook(
                        0,
                        500000
                    )
                ).toBe(
                    "Pressure"
                );

            }
        );


        it(
            "should return Pressure when thirty-day cash is zero",
            () => {

                expect(
                    determineCashOutlook(
                        500000,
                        0
                    )
                ).toBe(
                    "Pressure"
                );

            }
        );


        it(
            "should return Pressure when both periods are zero",
            () => {

                expect(
                    determineCashOutlook(
                        0,
                        0
                    )
                ).toBe(
                    "Pressure"
                );

            }
        );

    }
);


// ============================================================
// REVENUE SCENARIO STATUS
// ============================================================

describe(
    "determineRevenueScenarioStatus()",
    () => {

        it(
            "should retain Healthy status for small revenue decline",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -5,
                        "Healthy"
                    )
                ).toBe(
                    "Healthy"
                );

            }
        );


        it(
            "should upgrade healthy status to Monitor for 10 percent decline",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -10,
                        "Healthy"
                    )
                ).toBe(
                    "Monitor"
                );

            }
        );


        it(
            "should upgrade healthy status to Monitor for moderate decline",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -20,
                        "Healthy"
                    )
                ).toBe(
                    "Monitor"
                );

            }
        );


        it(
            "should upgrade healthy status to High for 30 percent decline",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -30,
                        "Healthy"
                    )
                ).toBe(
                    "High"
                );

            }
        );


        it(
            "should upgrade healthy status to High for severe decline",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -50,
                        "Healthy"
                    )
                ).toBe(
                    "High"
                );

            }
        );


        it(
            "should preserve Critical cash conditions",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -20,
                        "Critical"
                    )
                ).toBe(
                    "Critical"
                );

            }
        );


        it(
            "should preserve Pressure cash conditions",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -20,
                        "Pressure"
                    )
                ).toBe(
                    "Pressure"
                );

            }
        );


        it(
            "should not downgrade Critical cash conditions",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -50,
                        "Critical"
                    )
                ).toBe(
                    "Critical"
                );

            }
        );


        it(
            "should not change status for positive revenue scenarios",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        20,
                        "Healthy"
                    )
                ).toBe(
                    "Healthy"
                );

            }
        );

    }
);


// ============================================================
// BUILD REVENUE SCENARIO
// ============================================================

describe(
    "buildRevenueScenario()",
    () => {

        it(
            "should build a complete 20 percent revenue decline scenario",
            () => {

                const forecast = {

                    revenue:
                        BASE_REVENUE,

                    cash:
                        BASE_CASH

                };


                const result =
                    buildRevenueScenario(
                        forecast,
                        -20
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.scenarioType
                ).toBe(
                    "Revenue Change"
                );


                expect(
                    result.status
                ).toBe(
                    "Monitor"
                );


                expect(
                    result.changePercentage
                ).toBe(
                    -20
                );


                expect(
                    result.direction
                ).toBe(
                    "decrease"
                );


                expect(
                    result.baseline.tomorrow
                ).toBe(
                    100000
                );


                expect(
                    result.projected.tomorrow
                ).toBe(
                    80000
                );


                expect(
                    result.revenueImpact.tomorrow
                ).toBe(
                    -20000
                );


                expect(
                    result.cashImpact.scenario.next7Days
                ).toBe(
                    360000
                );


                expect(
                    result.decision
                ).toBeDefined();


                expect(
                    result.decision.priority
                ).toBe(
                    "High"
                );

            }
        );


        it(
            "should build a 10 percent revenue increase scenario",
            () => {

                const forecast = {

                    revenue:
                        BASE_REVENUE,

                    cash:
                        BASE_CASH

                };


                const result =
                    buildRevenueScenario(
                        forecast,
                        10
                    );


                expect(
                    result.scenarioType
                ).toBe(
                    "Revenue Change"
                );


                expect(
                    result.status
                ).toBe(
                    "Healthy"
                );


                expect(
                    result.direction
                ).toBe(
                    "increase"
                );


                expect(
                    result.projected.tomorrow
                ).toBe(
                    110000
                );


                expect(
                    result.revenueImpact.tomorrow
                ).toBe(
                    10000
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "Medium"
                );

            }
        );


        it(
            "should build a zero-change revenue scenario",
            () => {

                const result =
                    buildRevenueScenario(
                        {
                            revenue:
                                BASE_REVENUE,

                            cash:
                                BASE_CASH
                        },
                        0
                    );


                expect(
                    result.status
                ).toBe(
                    "Healthy"
                );


                expect(
                    result.direction
                ).toBe(
                    "no change"
                );


                expect(
                    result.projected.tomorrow
                ).toBe(
                    100000
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "Low"
                );

            }
        );


        it(
            "should identify severe revenue decline",
            () => {

                const result =
                    buildRevenueScenario(
                        {
                            revenue:
                                BASE_REVENUE,

                            cash:
                                BASE_CASH
                        },
                        -30
                    );


                expect(
                    result.status
                ).toBe(
                    "High"
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "High"
                );


                expect(
                    result.revenueImpact.tomorrow
                ).toBe(
                    -30000
                );

            }
        );


        it(
            "should identify critical cash consequences",
            () => {

                const forecast = {

                    revenue: {

                        tomorrow:
                            100000,

                        next7Days:
                            700000,

                        next30Days:
                            3000000

                    },

                    cash: {

                        next7Days:
                            100000,

                        next30Days:
                            200000

                    }

                };


                const result =
                    buildRevenueScenario(
                        forecast,
                        -100
                    );


                expect(
                    result.status
                ).toBe(
                    "Critical"
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "Critical"
                );


                expect(
                    result.cashImpact.scenario.next7Days
                ).toBe(
                    -600000
                );


                expect(
                    result.cashImpact.scenario.next30Days
                ).toBe(
                    -2800000
                );

            }
        );


        it(
            "should safely handle missing forecast data",
            () => {

                const result =
                    buildRevenueScenario(
                        {},
                        -20
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.scenarioType
                ).toBe(
                    "Revenue Change"
                );


                expect(
                    result.projected.tomorrow
                ).toBe(
                    0
                );


                expect(
                    result.cashImpact.scenario.next7Days
                ).toBe(
                    0
                );

            }
        );

    }
);


// ============================================================
// EXPENSE SCENARIO DECISION
// ============================================================

describe(
    "buildExpenseScenario()",
    () => {

        it(
            "should identify expense increase as pressure",
            () => {

                const result =
                    buildExpenseScenario(
                        {
                            expenseHistory:
                                EXPENSE_HISTORY
                        },
                        EXPENSE_HISTORY,
                        20
                    );


                expect(
                    result.scenarioType
                ).toBe(
                    "Expense Change"
                );


                expect(
                    result.status
                ).toBe(
                    "Pressure"
                );


                expect(
                    result.changePercentage
                ).toBe(
                    20
                );


                expect(
                    result.direction
                ).toBe(
                    "increase"
                );


                expect(
                    result.baseline
                ).toBe(
                    150000
                );


                expect(
                    result.projected
                ).toBe(
                    180000
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    30000
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "High"
                );

            }
        );


        it(
            "should identify expense reduction as healthy",
            () => {

                const result =
                    buildExpenseScenario(
                        {
                            expenseHistory:
                                EXPENSE_HISTORY
                        },
                        EXPENSE_HISTORY,
                        -20
                    );


                expect(
                    result.status
                ).toBe(
                    "Healthy"
                );


                expect(
                    result.direction
                ).toBe(
                    "decrease"
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    -30000
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "Medium"
                );

            }
        );


        it(
            "should identify zero expense change",
            () => {

                const result =
                    buildExpenseScenario(
                        {
                            expenseHistory:
                                EXPENSE_HISTORY
                        },
                        EXPENSE_HISTORY,
                        0
                    );


                expect(
                    result.status
                ).toBe(
                    "Monitor"
                );


                expect(
                    result.direction
                ).toBe(
                    "no change"
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    0
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "Low"
                );

            }
        );


        it(
            "should handle missing expense history",
            () => {

                const result =
                    buildExpenseScenario(
                        {},
                        [],
                        20
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.status
                ).toBe(
                    "Monitor"
                );


                expect(
                    result.baseline
                ).toBe(
                    0
                );


                expect(
                    result.projected
                ).toBe(
                    0
                );


                expect(
                    result.additionalExpenses
                ).toBe(
                    0
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "Medium"
                );

            }
        );

    }
);


// ============================================================
// MAIN BUILD SCENARIO
// ============================================================

describe(
    "buildScenario()",
    () => {

        it(
            "should build a revenue scenario by default",
            () => {

                const result =
                    buildScenario(
                        FORECAST,
                        {
                            percentage:
                                -20
                        }
                    );


                expect(
                    result.scenarioType
                ).toBe(
                    "Revenue Change"
                );


                expect(
                    result.changePercentage
                ).toBe(
                    -20
                );

            }
        );


        it(
            "should build a revenue scenario explicitly",
            () => {

                const result =
                    buildScenario(
                        FORECAST,
                        {
                            type:
                                "revenue",

                            percentage:
                                -20
                        }
                    );


                expect(
                    result.scenarioType
                ).toBe(
                    "Revenue Change"
                );


                expect(
                    result.projected.tomorrow
                ).toBe(
                    80000
                );

            }
        );


        it(
            "should build an expense scenario",
            () => {

                const result =
                    buildScenario(
                        FORECAST,
                        {
                            type:
                                "expense",

                            percentage:
                                20
                        }
                    );


                expect(
                    result.scenarioType
                ).toBe(
                    "Expense Change"
                );


                expect(
                    result.status
                ).toBe(
                    "Pressure"
                );


                expect(
                    result.projected
                ).toBe(
                    180000
                );

            }
        );


        it(
            "should safely handle an unsupported scenario type",
            () => {

                const result =
                    buildScenario(
                        FORECAST,
                        {
                            type:
                                "inventory",

                            percentage:
                                20
                        }
                    );


                expect(
                    result.scenarioType
                ).toBe(
                    "Unknown"
                );


                expect(
                    result.status
                ).toBe(
                    "Info"
                );


                expect(
                    result.decision.priority
                ).toBe(
                    "Low"
                );


                expect(
                    result.impact
                ).toContain(
                    "not supported"
                );

            }
        );


        it(
            "should safely handle an empty forecast",
            () => {

                const result =
                    buildScenario(
                        {},
                        {
                            type:
                                "revenue",

                            percentage:
                                -20
                        }
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.scenarioType
                ).toBe(
                    "Revenue Change"
                );


                expect(
                    result.projected.tomorrow
                ).toBe(
                    0
                );

            }
        );


        it(
            "should not modify the original forecast",
            () => {

                const original = {

                    revenue: {

                        tomorrow:
                            100000,

                        next7Days:
                            700000,

                        next30Days:
                            3000000

                    },

                    cash: {

                        next7Days:
                            500000,

                        next30Days:
                            1500000

                    },

                    expenseHistory: [

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
                        }

                    ]

                };


                const before =
                    JSON.parse(
                        JSON.stringify(
                            original
                        )
                    );


                buildScenario(
                    original,
                    {
                        type:
                            "revenue",

                        percentage:
                            -30
                    }
                );


                expect(
                    original
                ).toEqual(
                    before
                );

            }
        );

    }
);


// ============================================================
// SCENARIO CONSISTENCY
// ============================================================

describe(
    "Scenario Engine - Consistency",
    () => {

        it(
            "should maintain the same percentage change across forecast periods",
            () => {

                const result =
                    simulateRevenueChange(
                        BASE_REVENUE,
                        -20
                    );


                expect(
                    result.tomorrow /
                    BASE_REVENUE.tomorrow
                ).toBe(
                    0.8
                );


                expect(
                    result.next7Days /
                    BASE_REVENUE.next7Days
                ).toBe(
                    0.8
                );


                expect(
                    result.next30Days /
                    BASE_REVENUE.next30Days
                ).toBe(
                    0.8
                );

            }
        );


        it(
            "should maintain logical revenue differences",
            () => {

                const result =
                    analyzeRevenueScenario(
                        BASE_REVENUE,
                        -20
                    );


                expect(
                    result.difference.tomorrow
                ).toBe(
                    result.scenario.tomorrow -
                    result.baseline.tomorrow
                );


                expect(
                    result.difference.next7Days
                ).toBe(
                    result.scenario.next7Days -
                    result.baseline.next7Days
                );


                expect(
                    result.difference.next30Days
                ).toBe(
                    result.scenario.next30Days -
                    result.baseline.next30Days
                );

            }
        );


        it(
            "should maintain logical expense differences",
            () => {

                const result =
                    simulateExpenseChange(
                        EXPENSE_HISTORY,
                        20
                    );


                expect(
                    result.additionalExpenses
                ).toBe(
                    result.projectedExpenses -
                    result.currentExpenses
                );

            }
        );


        it(
            "should maintain logical cash impact",
            () => {

                const revenueScenario =
                    analyzeRevenueScenario(
                        BASE_REVENUE,
                        -20
                    );


                const cashImpact =
                    analyzeCashImpact(
                        BASE_CASH,
                        revenueScenario
                    );


                expect(
                    cashImpact.scenario.next7Days
                ).toBe(
                    cashImpact.baseline.next7Days +
                    cashImpact.difference.next7Days
                );


                expect(
                    cashImpact.scenario.next30Days
                ).toBe(
                    cashImpact.baseline.next30Days +
                    cashImpact.difference.next30Days
                );

            }
        );

    }
);


// ============================================================
// END
// ============================================================

console.log(
    "✅ Scenario Engine test suite loaded."
);