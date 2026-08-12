const {
    describe,
    it,
    expect
} = await import("vitest");

const {
    getAdvisorAssessment,
    determineBusinessStatus,
    determineOverallPriority,
    getTopDecision,
    buildKeyIssues,
    buildRecommendedActions,
    buildOpportunities,
    calculateConfidence
} = await import(
    "../src/services/intelligence/advisorCore"
);


// ============================================================
// ADVISOR CORE TEST SUITE
// ============================================================

describe(
    "Advisor Core",
    () => {

        // ========================================================
        // BUSINESS STATUS
        // ========================================================

        describe(
            "Business Status",
            () => {

                it(
                    "should return Critical for critical risks",
                    () => {

                        const result =
                            determineBusinessStatus(
                                [
                                    {
                                        severity: "Critical"
                                    }
                                ],
                                []
                            );

                        expect(
                            result
                        ).toBe("Critical");

                    }
                );


                it(
                    "should return Critical for immediate decisions",
                    () => {

                        const result =
                            determineBusinessStatus(
                                [],
                                [
                                    {
                                        priority: "Immediate"
                                    }
                                ]
                            );

                        expect(
                            result
                        ).toBe("Critical");

                    }
                );


                it(
                    "should return Needs Attention for warning risks",
                    () => {

                        const result =
                            determineBusinessStatus(
                                [
                                    {
                                        severity: "Warning"
                                    }
                                ],
                                []
                            );

                        expect(
                            result
                        ).toBe("Needs Attention");

                    }
                );


                it(
                    "should return Needs Attention for high decisions",
                    () => {

                        const result =
                            determineBusinessStatus(
                                [],
                                [
                                    {
                                        priority: "High"
                                    }
                                ]
                            );

                        expect(
                            result
                        ).toBe("Needs Attention");

                    }
                );


                it(
                    "should return Healthy when there are no serious issues",
                    () => {

                        const result =
                            determineBusinessStatus(
                                [
                                    {
                                        severity: "Info"
                                    }
                                ],
                                []
                            );

                        expect(
                            result
                        ).toBe("Healthy");

                    }
                );

            }
        );


        // ========================================================
        // OVERALL PRIORITY
        // ========================================================

        describe(
            "Overall Priority",
            () => {

                it(
                    "should prioritize Immediate decisions",
                    () => {

                        const result =
                            determineOverallPriority(
                                [
                                    {
                                        priority: "Immediate"
                                    },
                                    {
                                        priority: "Medium"
                                    }
                                ],
                                []
                            );

                        expect(
                            result
                        ).toBe("Immediate");

                    }
                );


                it(
                    "should prioritize Critical risks",
                    () => {

                        const result =
                            determineOverallPriority(
                                [],
                                [
                                    {
                                        severity: "Critical"
                                    }
                                ]
                            );

                        expect(
                            result
                        ).toBe("Immediate");

                    }
                );


                it(
                    "should return High when the highest issue is High",
                    () => {

                        const result =
                            determineOverallPriority(
                                [
                                    {
                                        priority: "High"
                                    }
                                ],
                                []
                            );

                        expect(
                            result
                        ).toBe("High");

                    }
                );


                it(
                    "should return Low when there are no risks or decisions",
                    () => {

                        const result =
                            determineOverallPriority(
                                [],
                                []
                            );

                        expect(
                            result
                        ).toBe("Low");

                    }
                );

            }
        );


        // ========================================================
        // TOP DECISION
        // ========================================================

        describe(
            "Top Decision",
            () => {

                it(
                    "should return the highest-priority decision",
                    () => {

                        const result =
                            getTopDecision(
                                [
                                    {
                                        priority: "Medium",
                                        title: "Medium Issue"
                                    },
                                    {
                                        priority: "Immediate",
                                        title: "Critical Cash Issue"
                                    },
                                    {
                                        priority: "High",
                                        title: "High Issue"
                                    }
                                ]
                            );

                        expect(
                            result.title
                        ).toBe(
                            "Critical Cash Issue"
                        );

                        expect(
                            result.priority
                        ).toBe(
                            "Immediate"
                        );

                    }
                );


                it(
                    "should return null when there are no decisions",
                    () => {

                        const result =
                            getTopDecision(
                                []
                            );

                        expect(
                            result
                        ).toBeNull();

                    }
                );

            }
        );


        // ========================================================
        // KEY ISSUES
        // ========================================================

        describe(
            "Key Issues",
            () => {

                it(
                    "should convert risks into key issues",
                    () => {

                        const result =
                            buildKeyIssues(
                                [
                                    {
                                        severity: "Critical",
                                        category: "Liquidity",
                                        title: "Cash Flow Risk",
                                        message: "Cash is negative."
                                    }
                                ]
                            );

                        expect(
                            result
                        ).toHaveLength(1);

                        expect(
                            result[0].severity
                        ).toBe(
                            "Critical"
                        );

                        expect(
                            result[0].category
                        ).toBe(
                            "Liquidity"
                        );

                        expect(
                            result[0].title
                        ).toBe(
                            "Cash Flow Risk"
                        );

                        expect(
                            result[0].message
                        ).toBe(
                            "Cash is negative."
                        );

                    }
                );


                it(
                    "should safely handle invalid risk input",
                    () => {

                        expect(
                            buildKeyIssues(
                                null
                            )
                        ).toEqual([]);

                    }
                );

            }
        );


        // ========================================================
        // RECOMMENDED ACTIONS
        // ========================================================

        describe(
            "Recommended Actions",
            () => {

                it(
                    "should convert decisions into recommended actions",
                    () => {

                        const result =
                            buildRecommendedActions(
                                [
                                    {
                                        priority: "High",
                                        category: "Liquidity",
                                        title: "Cash Flow Risk",
                                        decision: "Reduce unnecessary expenses.",
                                        reason: "Cash is declining."
                                    }
                                ]
                            );

                        expect(
                            result
                        ).toHaveLength(1);

                        expect(
                            result[0].priority
                        ).toBe(
                            "High"
                        );

                        expect(
                            result[0].category
                        ).toBe(
                            "Liquidity"
                        );

                        expect(
                            result[0].title
                        ).toBe(
                            "Cash Flow Risk"
                        );

                        expect(
                            result[0].action
                        ).toBe(
                            "Reduce unnecessary expenses."
                        );

                        expect(
                            result[0].reason
                        ).toBe(
                            "Cash is declining."
                        );

                    }
                );


                it(
                    "should sort actions by priority",
                    () => {

                        const result =
                            buildRecommendedActions(
                                [
                                    {
                                        priority: "Medium",
                                        title: "Medium Action",
                                        decision: "Medium action."
                                    },
                                    {
                                        priority: "Immediate",
                                        title: "Immediate Action",
                                        decision: "Immediate action."
                                    },
                                    {
                                        priority: "High",
                                        title: "High Action",
                                        decision: "High action."
                                    }
                                ]
                            );

                        expect(
                            result[0].priority
                        ).toBe(
                            "Immediate"
                        );

                        expect(
                            result[1].priority
                        ).toBe(
                            "High"
                        );

                        expect(
                            result[2].priority
                        ).toBe(
                            "Medium"
                        );

                    }
                );

            }
        );


        // ========================================================
        // OPPORTUNITIES
        // ========================================================

        describe(
            "Opportunities",
            () => {

                it(
                    "should identify growing revenue",
                    () => {

                        const result =
                            buildOpportunities(
                                {
                                    revenue: {
                                        trend: "Growing"
                                    },
                                    inventoryDemand: {
                                        products: []
                                    }
                                }
                            );

                        expect(
                            result
                        ).toHaveLength(1);

                        expect(
                            result[0].category
                        ).toBe(
                            "Revenue"
                        );

                        expect(
                            result[0].title
                        ).toBe(
                            "Growing Revenue"
                        );

                    }
                );


                it(
                    "should identify growing product demand",
                    () => {

                        const result =
                            buildOpportunities(
                                {
                                    revenue: {
                                        trend: "Stable"
                                    },
                                    inventoryDemand: {

                                        products: [

                                            {
                                                productName:
                                                    "Product A",

                                                demandTrend:
                                                    "Growing"
                                            },

                                            {
                                                productName:
                                                    "Product B",

                                                demandTrend:
                                                    "Growing"
                                            }

                                        ]

                                    }
                                }
                            );

                        expect(
                            result
                        ).toHaveLength(1);

                        expect(
                            result[0].category
                        ).toBe(
                            "Inventory"
                        );

                        expect(
                            result[0].title
                        ).toBe(
                            "Growing Product Demand"
                        );

                        expect(
                            result[0].opportunity
                        ).toContain(
                            "2 product(s)"
                        );

                    }
                );


                it(
                    "should return no opportunities for neutral data",
                    () => {

                        const result =
                            buildOpportunities(
                                {
                                    revenue: {
                                        trend: "Stable"
                                    },
                                    inventoryDemand: {
                                        products: []
                                    }
                                }
                            );

                        expect(
                            result
                        ).toEqual([]);

                    }
                );

            }
        );


        // ========================================================
        // CONFIDENCE
        // ========================================================

        describe(
            "Confidence",
            () => {

                it(
                    "should use revenue forecast confidence",
                    () => {

                        const result =
                            calculateConfidence(
                                {
                                    revenue: {
                                        confidence: 80
                                    }
                                }
                            );

                        expect(
                            result
                        ).toBe(80);

                    }
                );


                it(
                    "should clamp confidence above 100",
                    () => {

                        const result =
                            calculateConfidence(
                                {
                                    revenue: {
                                        confidence: 150
                                    }
                                }
                            );

                        expect(
                            result
                        ).toBe(100);

                    }
                );


                it(
                    "should clamp confidence below 0",
                    () => {

                        const result =
                            calculateConfidence(
                                {
                                    revenue: {
                                        confidence: -20
                                    }
                                }
                            );

                        expect(
                            result
                        ).toBe(0);

                    }
                );


                it(
                    "should return zero when confidence is unavailable",
                    () => {

                        const result =
                            calculateConfidence(
                                {}
                            );

                        expect(
                            result
                        ).toBe(0);

                    }
                );

            }
        );


        // ========================================================
        // COMPLETE ADVISOR ASSESSMENT
        // ========================================================

        describe(
            "Complete Advisor Assessment",
            () => {

                it(
                    "should generate a complete critical assessment",
                    () => {

                        const forecast = {

                            revenue: {

                                confidence: 80,

                                trend:
                                    "Declining"

                            },

                            inventoryDemand: {

                                products: []

                            },

                            risks: [

                                {
                                    severity:
                                        "Critical",

                                    category:
                                        "Liquidity",

                                    title:
                                        "Cash Flow Risk",

                                    message:
                                        "Cash is currently negative."
                                }

                            ],

                            decisions: [

                                {
                                    priority:
                                        "Immediate",

                                    category:
                                        "Liquidity",

                                    title:
                                        "Cash Flow Risk",

                                    decision:
                                        "Reduce expenses immediately.",

                                    reason:
                                        "Cash is negative."
                                }

                            ]

                        };


                        const result =
                            getAdvisorAssessment(
                                forecast
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.businessStatus
                        ).toBe(
                            "Critical"
                        );


                        expect(
                            result.overallPriority
                        ).toBe(
                            "Immediate"
                        );


                        expect(
                            result.headline
                        ).toContain(
                            "Cash Flow Risk"
                        );


                        expect(
                            result.assessment
                        ).toContain(
                            "critical issues"
                        );


                        expect(
                            result.keyIssues
                        ).toHaveLength(
                            1
                        );


                        expect(
                            result.recommendedActions
                        ).toHaveLength(
                            1
                        );


                        expect(
                            result.confidence
                        ).toBe(
                            80
                        );


                        expect(
                            result.sourceData.risks
                        ).toEqual(
                            forecast.risks
                        );


                        expect(
                            result.sourceData.decisions
                        ).toEqual(
                            forecast.decisions
                        );

                    }
                );


                it(
                    "should generate a healthy assessment",
                    () => {

                        const forecast = {

                            revenue: {

                                confidence:
                                    90,

                                trend:
                                    "Growing"

                            },

                            inventoryDemand: {

                                products: [

                                    {
                                        productName:
                                            "Product A",

                                        demandTrend:
                                            "Growing"
                                    }

                                ]

                            },

                            risks: [],

                            decisions: []

                        };


                        const result =
                            getAdvisorAssessment(
                                forecast
                            );


                        expect(
                            result.businessStatus
                        ).toBe(
                            "Healthy"
                        );


                        expect(
                            result.overallPriority
                        ).toBe(
                            "Low"
                        );


                        expect(
                            result.opportunities
                        ).toHaveLength(
                            2
                        );


                        expect(
                            result.confidence
                        ).toBe(
                            90
                        );

                    }
                );


                it(
                    "should safely handle missing forecast data",
                    () => {

                        const result =
                            getAdvisorAssessment(
                                null
                            );


                        expect(
                            result
                        ).toBeDefined();


                        expect(
                            result.businessStatus
                        ).toBe(
                            "Healthy"
                        );


                        expect(
                            result.overallPriority
                        ).toBe(
                            "Low"
                        );


                        expect(
                            result.keyIssues
                        ).toEqual([]);


                        expect(
                            result.recommendedActions
                        ).toEqual([]);


                        expect(
                            result.opportunities
                        ).toEqual([]);


                        expect(
                            result.confidence
                        ).toBe(0);

                    }
                );

            }
        );

    }
);