// ============================================================
// SCENARIO ENGINE TESTS V1
// ============================================================
//
// PURPOSE:
//
// Validate the deterministic Scenario Engine independently.
//
// These tests verify:
//
// 1. Revenue increases
// 2. Revenue decreases
// 3. Expense increases
// 4. Expense decreases
// 5. Cash impact
// 6. Cash outlook
// 7. Scenario status
// 8. Scenario decisions
// 9. Empty data
// 10. Unsupported scenario types
// 11. Floating-point protection
// 12. Large values
//
// No database.
// No AI.
// No external services.
//
// ============================================================

import {
    describe,
    it,
    expect
} from "vitest";

import {
    buildScenario,
    buildRevenueScenario,
    buildExpenseScenario,
    analyzeRevenueScenario,
    analyzeExpenseScenario,
    simulateRevenueChange,
    simulateExpenseChange,
    analyzeCashImpact,
    determineCashOutlook,
    determineRevenueScenarioStatus
} from "../src/services/intelligence/scenarioEngine";

// ============================================================
// TEST DATA
// ============================================================

const revenueForecast = {

    revenue: {

        tomorrow:
            100000,

        next7Days:
            700000,

        next30Days:
            3000000

    },

    cash: {

        currentCash:
            500000,

        next7Days:
            700000,

        next30Days:
            3000000

    }

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
            75000
    },

    {
        date:
            "2026-08-03",

        expenses:
            25000
    }

];

// Total = ₦150,000


// ============================================================
// SIMULATE REVENUE CHANGE
// ============================================================

describe(
    "simulateRevenueChange",
    () => {

        it(
            "should increase revenue correctly",
            () => {

                const result =
                    simulateRevenueChange(
                        revenueForecast.revenue,
                        20
                    );

                expect(
                    result.tomorrow
                ).toBe(120000);

                expect(
                    result.next7Days
                ).toBe(840000);

                expect(
                    result.next30Days
                ).toBe(3600000);

            }
        );


        it(
            "should decrease revenue correctly",
            () => {

                const result =
                    simulateRevenueChange(
                        revenueForecast.revenue,
                        -20
                    );

                expect(
                    result.tomorrow
                ).toBe(80000);

                expect(
                    result.next7Days
                ).toBe(560000);

                expect(
                    result.next30Days
                ).toBe(2400000);

            }
        );


        it(
            "should handle zero percentage change",
            () => {

                const result =
                    simulateRevenueChange(
                        revenueForecast.revenue,
                        0
                    );

                expect(
                    result.tomorrow
                ).toBe(100000);

                expect(
                    result.next7Days
                ).toBe(700000);

                expect(
                    result.next30Days
                ).toBe(3000000);

            }
        );


        it(
            "should safely handle missing revenue data",
            () => {

                const result =
                    simulateRevenueChange(
                        {},
                        20
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
            "should handle large revenue values",
            () => {

                const result =
                    simulateRevenueChange(
                        {
                            tomorrow:
                                1000000000,

                            next7Days:
                                7000000000,

                            next30Days:
                                30000000000
                        },
                        10
                    );

                expect(
                    result.tomorrow
                ).toBe(1100000000);

                expect(
                    result.next7Days
                ).toBe(7700000000);

                expect(
                    result.next30Days
                ).toBe(33000000000);

            }
        );

    }
);


// ============================================================
// SIMULATE EXPENSE CHANGE
// ============================================================

describe(
    "simulateExpenseChange",
    () => {

        it(
            "should calculate total expenses correctly",
            () => {

                const result =
                    simulateExpenseChange(
                        expenseHistory,
                        0
                    );

                expect(
                    result.currentExpenses
                ).toBe(150000);

                expect(
                    result.projectedExpenses
                ).toBe(150000);

                expect(
                    result.additionalExpenses
                ).toBe(0);

                expect(
                    result.direction
                ).toBe(
                    "no change"
                );

            }
        );


        it(
            "should increase expenses correctly",
            () => {

                const result =
                    simulateExpenseChange(
                        expenseHistory,
                        20
                    );

                expect(
                    result.currentExpenses
                ).toBe(150000);

                expect(
                    result.projectedExpenses
                ).toBe(180000);

                expect(
                    result.additionalExpenses
                ).toBe(30000);

                expect(
                    result.direction
                ).toBe(
                    "increase"
                );

            }
        );


        it(
            "should decrease expenses correctly",
            () => {

                const result =
                    simulateExpenseChange(
                        expenseHistory,
                        -20
                    );

                expect(
                    result.currentExpenses
                ).toBe(150000);

                expect(
                    result.projectedExpenses
                ).toBe(120000);

                expect(
                    result.additionalExpenses
                ).toBe(-30000);

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

                const result =
                    simulateExpenseChange(
                        [
                            {
                                amount:
                                    10000
                            },
                            {
                                amount:
                                    20000
                            }
                        ],
                        10
                    );

                expect(
                    result.currentExpenses
                ).toBe(30000);

                expect(
                    result.projectedExpenses
                ).toBe(33000);

                expect(
                    result.additionalExpenses
                ).toBe(3000);

            }
        );


        it(
            "should ignore negative expense values",
            () => {

                const result =
                    simulateExpenseChange(
                        [
                            {
                                expenses:
                                    -50000
                            },
                            {
                                expenses:
                                    100000
                            }
                        ],
                        10
                    );

                expect(
                    result.currentExpenses
                ).toBe(100000);

                expect(
                    result.projectedExpenses
                ).toBe(110000);

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
                ).toBe(0);

                expect(
                    result.projectedExpenses
                ).toBe(0);

                expect(
                    result.additionalExpenses
                ).toBe(0);

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
                ).toBe(0);

                expect(
                    result.projectedExpenses
                ).toBe(0);

            }
        );

    }
);


// ============================================================
// ANALYZE REVENUE SCENARIO
// ============================================================

describe(
    "analyzeRevenueScenario",
    () => {

        it(
            "should analyze a revenue increase",
            () => {

                const result =
                    analyzeRevenueScenario(
                        revenueForecast.revenue,
                        20
                    );

                expect(
                    result.type
                ).toBe(
                    "revenue"
                );

                expect(
                    result.changePercentage
                ).toBe(20);

                expect(
                    result.direction
                ).toBe(
                    "increase"
                );

                expect(
                    result.baseline.tomorrow
                ).toBe(100000);

                expect(
                    result.scenario.tomorrow
                ).toBe(120000);

                expect(
                    result.difference.tomorrow
                ).toBe(20000);

                expect(
                    result.impact
                ).toContain(
                    "increase"
                );

            }
        );


        it(
            "should analyze a revenue decrease",
            () => {

                const result =
                    analyzeRevenueScenario(
                        revenueForecast.revenue,
                        -20
                    );

                expect(
                    result.type
                ).toBe(
                    "revenue"
                );

                expect(
                    result.changePercentage
                ).toBe(-20);

                expect(
                    result.direction
                ).toBe(
                    "decrease"
                );

                expect(
                    result.baseline.tomorrow
                ).toBe(100000);

                expect(
                    result.scenario.tomorrow
                ).toBe(80000);

                expect(
                    result.difference.tomorrow
                ).toBe(-20000);

                expect(
                    result.impact
                ).toContain(
                    "decrease"
                );

            }
        );


        it(
            "should handle zero revenue change",
            () => {

                const result =
                    analyzeRevenueScenario(
                        revenueForecast.revenue,
                        0
                    );

                expect(
                    result.direction
                ).toBe(
                    "no change"
                );

                expect(
                    result.difference.tomorrow
                ).toBe(0);

                expect(
                    result.impact
                ).toContain(
                    "no material"
                );

            }
        );

    }
);


// ============================================================
// ANALYZE EXPENSE SCENARIO
// ============================================================

describe(
    "analyzeExpenseScenario",
    () => {

        it(
            "should analyze an expense increase",
            () => {

                const result =
                    analyzeExpenseScenario(
                        expenseHistory,
                        20
                    );

                expect(
                    result.type
                ).toBe(
                    "expense"
                );

                expect(
                    result.changePercentage
                ).toBe(20);

                expect(
                    result.direction
                ).toBe(
                    "increase"
                );

                expect(
                    result.baseline
                ).toBe(150000);

                expect(
                    result.scenario
                ).toBe(180000);

                expect(
                    result.additionalExpenses
                ).toBe(30000);

                expect(
                    result.impact
                ).toContain(
                    "increase"
                );

            }
        );


        it(
            "should analyze an expense decrease",
            () => {

                const result =
                    analyzeExpenseScenario(
                        expenseHistory,
                        -20
                    );

                expect(
                    result.type
                ).toBe(
                    "expense"
                );

                expect(
                    result.changePercentage
                ).toBe(-20);

                expect(
                    result.direction
                ).toBe(
                    "decrease"
                );

                expect(
                    result.baseline
                ).toBe(150000);

                expect(
                    result.scenario
                ).toBe(120000);

                expect(
                    result.additionalExpenses
                ).toBe(-30000);

                expect(
                    result.impact
                ).toContain(
                    "decrease"
                );

            }
        );


        it(
            "should handle missing expense history",
            () => {

                const result =
                    analyzeExpenseScenario(
                        [],
                        20
                    );

                expect(
                    result.type
                ).toBe(
                    "expense"
                );

                expect(
                    result.baseline
                ).toBe(0);

                expect(
                    result.scenario
                ).toBe(0);

                expect(
                    result.additionalExpenses
                ).toBe(0);

                expect(
                    result.impact
                ).toContain(
                    "not enough expense history"
                );

            }
        );

    }
);


// ============================================================
// CASH IMPACT
// ============================================================

describe(
    "analyzeCashImpact",
    () => {

        it(
            "should calculate positive cash impact",
            () => {

                const revenueScenario =
                    analyzeRevenueScenario(
                        revenueForecast.revenue,
                        20
                    );

                const result =
                    analyzeCashImpact(
                        revenueForecast.cash,
                        revenueScenario
                    );

                expect(
                    result.baseline.next7Days
                ).toBe(700000);

                expect(
                    result.baseline.next30Days
                ).toBe(3000000);

                expect(
                    result.scenario.next7Days
                ).toBe(840000);

                expect(
                    result.scenario.next30Days
                ).toBe(3600000);

                expect(
                    result.difference.next7Days
                ).toBe(140000);

                expect(
                    result.difference.next30Days
                ).toBe(600000);

            }
        );


        it(
            "should calculate negative cash impact",
            () => {

                const revenueScenario =
                    analyzeRevenueScenario(
                        revenueForecast.revenue,
                        -20
                    );

                const result =
                    analyzeCashImpact(
                        revenueForecast.cash,
                        revenueScenario
                    );

                expect(
                    result.scenario.next7Days
                ).toBe(560000);

                expect(
                    result.scenario.next30Days
                ).toBe(2400000);

                expect(
                    result.difference.next7Days
                ).toBe(-140000);

                expect(
                    result.difference.next30Days
                ).toBe(-600000);

            }
        );


        it(
            "should safely handle missing cash data",
            () => {

                const revenueScenario =
                    analyzeRevenueScenario(
                        revenueForecast.revenue,
                        -20
                    );

                const result =
                    analyzeCashImpact(
                        {},
                        revenueScenario
                    );

                expect(
                    result.baseline.next7Days
                ).toBe(0);

                expect(
                    result.baseline.next30Days
                ).toBe(0);

                expect(
                    result.scenario.next7Days
                ).toBe(-140000);

                expect(
                    result.scenario.next30Days
                ).toBe(-600000);

            }
        );

    }
);


// ============================================================
// CASH OUTLOOK
// ============================================================

describe(
    "determineCashOutlook",
    () => {

        it(
            "should return Healthy for positive cash",
            () => {

                expect(
                    determineCashOutlook(
                        500000,
                        1000000
                    )
                ).toBe(
                    "Healthy"
                );

            }
        );


        it(
            "should return Pressure when cash reaches zero",
            () => {

                expect(
                    determineCashOutlook(
                        0,
                        100000
                    )
                ).toBe(
                    "Pressure"
                );

                expect(
                    determineCashOutlook(
                        100000,
                        0
                    )
                ).toBe(
                    "Pressure"
                );

            }
        );


        it(
            "should return Critical for negative cash",
            () => {

                expect(
                    determineCashOutlook(
                        -1,
                        100000
                    )
                ).toBe(
                    "Critical"
                );

                expect(
                    determineCashOutlook(
                        100000,
                        -1
                    )
                ).toBe(
                    "Critical"
                );

            }
        );

    }
);


// ============================================================
// REVENUE SCENARIO STATUS
// ============================================================

describe(
    "determineRevenueScenarioStatus",
    () => {

        it(
            "should retain Healthy for a small decline",
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
            "should return Monitor for a moderate decline",
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
            "should return High for a severe decline",
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
            "should preserve Critical cash outlook",
            () => {

                expect(
                    determineRevenueScenarioStatus(
                        -5,
                        "Critical"
                    )
                ).toBe(
                    "Critical"
                );

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

    }
);


// ============================================================
// BUILD REVENUE SCENARIO
// ============================================================

describe(
    "buildRevenueScenario",
    () => {

        it(
            "should build a complete revenue increase scenario",
            () => {

                const result =
                    buildRevenueScenario(
                        revenueForecast,
                        20
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
                    result.changePercentage
                ).toBe(20);

                expect(
                    result.direction
                ).toBe(
                    "increase"
                );

                expect(
                    result.baseline.tomorrow
                ).toBe(100000);

                expect(
                    result.projected.tomorrow
                ).toBe(120000);

                expect(
                    result.cashImpact.scenario.next7Days
                ).toBe(840000);

                expect(
                    result.decision
                ).toBeDefined();

                expect(
                    result.decision.priority
                ).toBe(
                    "Medium"
                );

            }
        );


        it(
            "should build a moderate revenue decline scenario",
            () => {

                const result =
                    buildRevenueScenario(
                        revenueForecast,
                        -20
                    );

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
                    result.direction
                ).toBe(
                    "decrease"
                );

                expect(
                    result.projected.tomorrow
                ).toBe(80000);

                expect(
                    result.decision.priority
                ).toBe(
                    "High"
                );

            }
        );


        it(
            "should build a severe revenue decline scenario",
            () => {

                const result =
                    buildRevenueScenario(
                        revenueForecast,
                        -40
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

            }
        );


        it(
            "should build a critical revenue decline when cash becomes negative",
            () => {

                const forecast = {

                    revenue: {

                        tomorrow:
                            100000,

                        next7Days:
                            100000,

                        next30Days:
                            200000

                    },

                    cash: {

                        currentCash:
                            50000,

                        next7Days:
                            100000,

                        next30Days:
                            200000

                    }

                };

                const result =
                    buildRevenueScenario(
                        forecast,
                        -200
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

            }
        );

    }
);


// ============================================================
// BUILD EXPENSE SCENARIO
// ============================================================

describe(
    "buildExpenseScenario",
    () => {

        it(
            "should build an expense increase scenario",
            () => {

                const result =
                    buildExpenseScenario(
                        {},
                        expenseHistory,
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
                ).toBe(20);

                expect(
                    result.direction
                ).toBe(
                    "increase"
                );

                expect(
                    result.baseline
                ).toBe(150000);

                expect(
                    result.projected
                ).toBe(180000);

                expect(
                    result.additionalExpenses
                ).toBe(30000);

                expect(
                    result.decision.priority
                ).toBe(
                    "High"
                );

            }
        );


        it(
            "should build an expense reduction scenario",
            () => {

                const result =
                    buildExpenseScenario(
                        {},
                        expenseHistory,
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
                ).toBe(-30000);

                expect(
                    result.decision.priority
                ).toBe(
                    "Medium"
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
                    result.baseline
                ).toBe(0);

                expect(
                    result.projected
                ).toBe(0);

                expect(
                    result.additionalExpenses
                ).toBe(0);

                expect(
                    result.decision
                ).toBeDefined();

            }
        );

    }
);


// ============================================================
// MAIN BUILD SCENARIO
// ============================================================

describe(
    "buildScenario",
    () => {

        it(
            "should build a revenue scenario",
            () => {

                const result =
                    buildScenario(
                        revenueForecast,
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
                    result.changePercentage
                ).toBe(-20);

                expect(
                    result.projected.tomorrow
                ).toBe(80000);

            }
        );


        it(
            "should build an expense scenario",
            () => {

                const forecast = {

                    expenseHistory:
                        expenseHistory

                };

                const result =
                    buildScenario(
                        forecast,
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
                    result.changePercentage
                ).toBe(20);

                expect(
                    result.projected
                ).toBe(180000);

            }
        );


        it(
            "should default to revenue scenarios",
            () => {

                const result =
                    buildScenario(
                        revenueForecast,
                        {
                            percentage:
                                -10
                        }
                    );

                expect(
                    result.scenarioType
                ).toBe(
                    "Revenue Change"
                );

                expect(
                    result.changePercentage
                ).toBe(-10);

            }
        );


        it(
            "should handle unsupported scenario types safely",
            () => {

                const result =
                    buildScenario(
                        revenueForecast,
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
                    result.decision
                ).toBeDefined();

                expect(
                    result.decision.priority
                ).toBe(
                    "Low"
                );

            }
        );


        it(
            "should not mutate the original forecast",
            () => {

                const original =
                    JSON.parse(
                        JSON.stringify(
                            revenueForecast
                        )
                    );

                buildScenario(
                    revenueForecast,
                    {
                        type:
                            "revenue",

                        percentage:
                            -30
                    }
                );

                expect(
                    revenueForecast
                ).toEqual(
                    original
                );

            }
        );

    }
);


// ============================================================
// FLOATING-POINT PROTECTION
// ============================================================

describe(
    "Floating Point Protection",
    () => {

        it(
            "should round scenario calculations to two decimal places",
            () => {

                const result =
                    simulateRevenueChange(
                        {
                            tomorrow:
                                100000.01,

                            next7Days:
                                700000.07,

                            next30Days:
                                3000000.03
                        },
                        10
                    );

                expect(
                    result.tomorrow
                ).toBe(
                    110000.01
                );

                expect(
                    Number.isInteger(
                        result.tomorrow
                    )
                ).toBe(
                    false
                );

                expect(
                    result.tomorrow
                        .toString()
                ).not.toContain(
                    "0000001"
                );

            }
        );

    }
);