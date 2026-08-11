const {
    describe,
    it,
    expect
} = await import("vitest");

// ============================================================
// DECISION ENGINE
// ============================================================

const {
    getDecisionForecast,
    buildDecisions,
    buildExecutiveSummary,
    createDecision,
    getDecisionPriority
} = await import(
    "../src/services/intelligence/decisionEngine"
);


// ============================================================
// TEST DATA
// ============================================================

const criticalLiquidityRisk = {

    severity:
        "Critical",

    category:
        "Liquidity",

    title:
        "Cash Flow Risk",

    message:
        "Current cash flow is negative."

};


const warningRevenueRisk = {

    severity:
        "Warning",

    category:
        "Revenue",

    title:
        "Sales Trend",

    message:
        "Sales are declining."

};


const infoRevenueRisk = {

    severity:
        "Info",

    category:
        "Data Quality",

    title:
        "Revenue Forecast Confidence",

    message:
        "Revenue forecast confidence is limited."

};


const businessOutlook = {

    severity:
        "Info",

    category:
        "Business Outlook",

    title:
        "Business Outlook",

    message:
        "No significant risks detected."

};


// ============================================================
// TEST SUITE
// ============================================================

describe(
    "Decision Engine",
    () => {


        // ====================================================
        // TEST 1
        // ====================================================

        it(
            "should create an Immediate decision from a Critical risk",
            () => {

                const decision =
                    createDecision(
                        criticalLiquidityRisk
                    );


                expect(
                    decision
                ).toBeDefined();


                expect(
                    decision.severity
                ).toBe(
                    "Critical"
                );


                expect(
                    decision.priority
                ).toBe(
                    "Immediate"
                );


                expect(
                    decision.category
                ).toBe(
                    "Liquidity"
                );


                expect(
                    decision.title
                ).toBe(
                    "Cash Flow Risk"
                );


                expect(
                    decision.decision
                ).toBeTruthy();


                expect(
                    decision.reason
                ).toBe(
                    "Current cash flow is negative."
                );


                expect(
                    decision.sourceRisk
                ).toBe(
                    "Current cash flow is negative."
                );

            }
        );


        // ====================================================
        // TEST 2
        // ====================================================

        it(
            "should create a High decision from a Warning risk",
            () => {

                const decision =
                    createDecision(
                        warningRevenueRisk
                    );


                expect(
                    decision.priority
                ).toBe(
                    "High"
                );


                expect(
                    decision.severity
                ).toBe(
                    "Warning"
                );


                expect(
                    decision.category
                ).toBe(
                    "Revenue"
                );

            }
        );


        // ====================================================
        // TEST 3
        // ====================================================

        it(
            "should create a Medium decision from an Info risk",
            () => {

                const decision =
                    createDecision(
                        infoRevenueRisk
                    );


                expect(
                    decision.priority
                ).toBe(
                    "Medium"
                );


                expect(
                    decision.severity
                ).toBe(
                    "Info"
                );

            }
        );


        // ====================================================
        // TEST 4
        // ====================================================

        it(
            "should return Low priority for unknown severity",
            () => {

                expect(
                    getDecisionPriority(
                        "Unknown"
                    )
                ).toBe(
                    "Low"
                );

            }
        );


        // ====================================================
        // TEST 5
        // ====================================================

        it(
            "should sort Critical decisions before Warning and Info",
            () => {

                const risks = [

                    infoRevenueRisk,

                    warningRevenueRisk,

                    criticalLiquidityRisk

                ];


                const decisions =
                    buildDecisions(
                        risks
                    );


                expect(
                    decisions.length
                ).toBe(
                    3
                );


                expect(
                    decisions[0].severity
                ).toBe(
                    "Critical"
                );


                expect(
                    decisions[1].severity
                ).toBe(
                    "Warning"
                );


                expect(
                    decisions[2].severity
                ).toBe(
                    "Info"
                );

            }
        );


        // ====================================================
        // TEST 6
        // ====================================================

        it(
            "should ignore Business Outlook risks",
            () => {

                const decisions =
                    buildDecisions(
                        [
                            businessOutlook
                        ]
                    );


                expect(
                    decisions
                ).toEqual(
                    []
                );

            }
        );


        // ====================================================
        // TEST 7
        // ====================================================

        it(
            "should handle an empty risk array",
            () => {

                const decisions =
                    buildDecisions(
                        []
                    );


                expect(
                    decisions
                ).toEqual(
                    []
                );

            }
        );


        // ====================================================
        // TEST 8
        // ====================================================

        it(
            "should safely handle invalid risk input",
            () => {

                expect(
                    buildDecisions(
                        null
                    )
                ).toEqual(
                    []
                );


                expect(
                    buildDecisions(
                        undefined
                    )
                ).toEqual(
                    []
                );


                expect(
                    buildDecisions(
                        {}
                    )
                ).toEqual(
                    []
                );

            }
        );


        // ====================================================
        // TEST 9
        // ====================================================

        it(
            "should return null for an invalid risk",
            () => {

                expect(
                    createDecision(
                        null
                    )
                ).toBeNull();


                expect(
                    createDecision(
                        {}
                    )
                ).toBeNull();

            }
        );


        // ====================================================
        // TEST 10
        // ====================================================

        it(
            "should generate a Healthy executive summary when there are no decisions",
            () => {

                const summary =
                    buildExecutiveSummary(
                        []
                    );


                expect(
                    summary.status
                ).toBe(
                    "Healthy"
                );


                expect(
                    summary.headline
                ).toBe(
                    "No immediate business decisions are required."
                );


                expect(
                    summary.message
                ).toBeTruthy();

            }
        );


        // ====================================================
        // TEST 11
        // ====================================================

        it(
            "should generate a Critical executive summary",
            () => {

                const decisions =
                    buildDecisions(
                        [
                            criticalLiquidityRisk
                        ]
                    );


                const summary =
                    buildExecutiveSummary(
                        decisions
                    );


                expect(
                    summary.status
                ).toBe(
                    "Critical"
                );


                expect(
                    summary.headline
                ).toContain(
                    "1 immediate business decision"
                );

            }
        );


        // ====================================================
        // TEST 12
        // ====================================================

        it(
            "should generate a Needs Attention summary for warnings",
            () => {

                const decisions =
                    buildDecisions(
                        [
                            warningRevenueRisk
                        ]
                    );


                const summary =
                    buildExecutiveSummary(
                        decisions
                    );


                expect(
                    summary.status
                ).toBe(
                    "Needs Attention"
                );


                expect(
                    summary.headline
                ).toContain(
                    "1 high-priority business decision"
                );

            }
        );


        // ====================================================
        // TEST 13
        // ====================================================

        it(
            "should generate a Monitor summary for Info decisions",
            () => {

                const decisions =
                    buildDecisions(
                        [
                            infoRevenueRisk
                        ]
                    );


                const summary =
                    buildExecutiveSummary(
                        decisions
                    );


                expect(
                    summary.status
                ).toBe(
                    "Monitor"
                );


                expect(
                    summary.headline
                ).toContain(
                    "1 business area"
                );

            }
        );


        // ====================================================
        // TEST 14
        // ====================================================

        it(
            "should build the complete decision forecast",
            () => {

                const forecast = {

                    risks: [

                        criticalLiquidityRisk,

                        warningRevenueRisk,

                        infoRevenueRisk,

                        businessOutlook

                    ]

                };


                const result =
                    getDecisionForecast(
                        forecast
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.totalDecisions
                ).toBe(
                    3
                );


                expect(
                    result.criticalDecisions
                ).toBe(
                    1
                );


                expect(
                    result.highPriorityDecisions
                ).toBe(
                    1
                );


                expect(
                    result.mediumPriorityDecisions
                ).toBe(
                    1
                );


                expect(
                    result.decisions.length
                ).toBe(
                    3
                );


                expect(
                    result.executiveSummary.status
                ).toBe(
                    "Critical"
                );

            }
        );


        // ====================================================
        // TEST 15
        // ====================================================

        it(
            "should safely handle missing forecast data",
            () => {

                const result =
                    getDecisionForecast(
                        null
                    );


                expect(
                    result
                ).toBeDefined();


                expect(
                    result.totalDecisions
                ).toBe(
                    0
                );


                expect(
                    result.criticalDecisions
                ).toBe(
                    0
                );


                expect(
                    result.highPriorityDecisions
                ).toBe(
                    0
                );


                expect(
                    result.mediumPriorityDecisions
                ).toBe(
                    0
                );


                expect(
                    result.decisions
                ).toEqual(
                    []
                );


                expect(
                    result.executiveSummary.status
                ).toBe(
                    "Healthy"
                );

            }
        );


        // ====================================================
        // TEST 16
        // ====================================================

        it(
            "should preserve the source risk message",
            () => {

                const decision =
                    createDecision(
                        criticalLiquidityRisk
                    );


                expect(
                    decision.sourceRisk
                ).toBe(
                    criticalLiquidityRisk.message
                );

            }
        );


        // ====================================================
        // TEST 17
        // ====================================================

        it(
            "should create a specific inventory demand decision",
            () => {

                const risk = {

                    severity:
                        "Critical",

                    category:
                        "Inventory Demand",

                    title:
                        "Urgent Product Reorder: Rice",

                    message:
                        "Rice is projected to run out soon."

                };


                const decision =
                    createDecision(
                        risk
                    );


                expect(
                    decision.priority
                ).toBe(
                    "Immediate"
                );


                expect(
                    decision.decision
                ).toBe(
                    "Restock this product immediately based on its projected demand and remaining inventory."
                );

            }
        );


        // ====================================================
        // TEST 18
        // ====================================================

        it(
            "should create a data quality decision",
            () => {

                const risk = {

                    severity:
                        "Info",

                    category:
                        "Data Quality",

                    title:
                        "Inventory Demand Confidence",

                    message:
                        "Demand history is limited."

                };


                const decision =
                    createDecision(
                        risk
                    );


                expect(
                    decision.priority
                ).toBe(
                    "Medium"
                );


                expect(
                    decision.decision
                ).toBe(
                    "Continue recording product-level sales quantities so demand predictions become more reliable."
                );

            }
        );

    }
);