const {
    describe,
    it,
    expect
} = await import("vitest");

// ============================================================
// RECOMMENDATION ENGINE
// ============================================================

const {
    buildRecommendations,
    createRecommendation,
    getRecommendationPriority
} = await import(
    "../src/services/intelligence/recommendationEngine"
);


// ============================================================
// TEST DATA
// ============================================================

const criticalDecision = {

    severity:
        "Critical",

    priority:
        "Immediate",

    category:
        "Liquidity",

    title:
        "Cash Flow Risk",

    decision:
        "Reduce unnecessary spending immediately.",

    reason:
        "Current cash flow is negative.",

    sourceRisk:
        "Current cash flow is negative."

};


const highDecision = {

    severity:
        "Warning",

    priority:
        "High",

    category:
        "Revenue",

    title:
        "Sales Trend",

    decision:
        "Review declining sales performance.",

    reason:
        "Sales are declining.",

    sourceRisk:
        "Sales are declining."

};


const mediumDecision = {

    severity:
        "Info",

    priority:
        "Medium",

    category:
        "Data Quality",

    title:
        "Revenue Forecast Confidence",

    decision:
        "Continue recording sales data.",

    reason:
        "Revenue forecast confidence is limited.",

    sourceRisk:
        "Revenue forecast confidence is limited."

};


const inventoryDecision = {

    severity:
        "Critical",

    priority:
        "Immediate",

    category:
        "Inventory Demand",

    title:
        "Urgent Product Reorder: Rice",

    decision:
        "Restock this product immediately based on its projected demand and remaining inventory.",

    reason:
        "Rice is projected to run out soon.",

    sourceRisk:
        "Rice is projected to run out soon."

};


// ============================================================
// TEST SUITE
// ============================================================

describe(
    "Recommendation Engine",
    () => {


        // ====================================================
        // TEST 1
        // ====================================================

        it(
            "should create an Immediate recommendation from a Critical decision",
            () => {

                const recommendation =
                    createRecommendation(
                        criticalDecision
                    );


                expect(
                    recommendation
                ).toBeDefined();


                expect(
                    recommendation.priority
                ).toBe(
                    "Immediate"
                );


                expect(
                    recommendation.category
                ).toBe(
                    "Liquidity"
                );


                expect(
                    recommendation.title
                ).toBe(
                    "Cash Flow Risk"
                );


                expect(
                    recommendation.recommendation
                ).toBeTruthy();


                expect(
                    recommendation.reason
                ).toBe(
                    "Current cash flow is negative."
                );

            }
        );


        // ====================================================
        // TEST 2
        // ====================================================

        it(
            "should create a High recommendation from a High-priority decision",
            () => {

                const recommendation =
                    createRecommendation(
                        highDecision
                    );


                expect(
                    recommendation
                ).toBeDefined();


                expect(
                    recommendation.priority
                ).toBe(
                    "High"
                );


                expect(
                    recommendation.category
                ).toBe(
                    "Revenue"
                );


                expect(
                    recommendation.title
                ).toBe(
                    "Sales Trend"
                );


                expect(
                    recommendation.recommendation
                ).toBeTruthy();

            }
        );


        // ====================================================
        // TEST 3
        // ====================================================

        it(
            "should create a Medium recommendation from a Medium-priority decision",
            () => {

                const recommendation =
                    createRecommendation(
                        mediumDecision
                    );


                expect(
                    recommendation
                ).toBeDefined();


                expect(
                    recommendation.priority
                ).toBe(
                    "Medium"
                );


                expect(
                    recommendation.category
                ).toBe(
                    "Data Quality"
                );


                expect(
                    recommendation.recommendation
                ).toBeTruthy();

            }
        );


        // ====================================================
        // TEST 4
        // ====================================================

        it(
            "should create a specific inventory recommendation",
            () => {

                const recommendation =
                    createRecommendation(
                        inventoryDecision
                    );


                expect(
                    recommendation
                ).toBeDefined();


                expect(
                    recommendation.priority
                ).toBe(
                    "Immediate"
                );


                expect(
                    recommendation.category
                ).toBe(
                    "Inventory Demand"
                );


                expect(
                    recommendation.title
                ).toBe(
                    "Urgent Product Reorder: Rice"
                );


                expect(
                    recommendation.recommendation
                ).toContain(
                    "Restock"
                );

            }
        );


        // ====================================================
        // TEST 5
        // ====================================================

        it(
            "should return Low priority for an unknown priority",
            () => {

                expect(
                    getRecommendationPriority(
                        "Unknown"
                    )
                ).toBe(
                    "Low"
                );

            }
        );


        // ====================================================
        // TEST 6
        // ====================================================

        it(
            "should safely handle null decision input",
            () => {

                expect(
                    createRecommendation(
                        null
                    )
                ).toBeNull();

            }
        );


        // ====================================================
        // TEST 7
        // ====================================================

        it(
            "should safely handle empty decision input",
            () => {

                expect(
                    createRecommendation(
                        {}
                    )
                ).toBeNull();

            }
        );


        // ====================================================
        // TEST 8
        // ====================================================

        it(
            "should safely handle an empty decision array",
            () => {

                const recommendations =
                    buildRecommendations(
                        []
                    );


                expect(
                    recommendations
                ).toEqual(
                    []
                );

            }
        );


        // ====================================================
        // TEST 9
        // ====================================================

        it(
            "should safely handle invalid recommendation input",
            () => {

                expect(
                    buildRecommendations(
                        null
                    )
                ).toEqual(
                    []
                );


                expect(
                    buildRecommendations(
                        undefined
                    )
                ).toEqual(
                    []
                );


                expect(
                    buildRecommendations(
                        {}
                    )
                ).toEqual(
                    []
                );

            }
        );


        // ====================================================
        // TEST 10
        // ====================================================

        it(
            "should sort Immediate recommendations before High and Medium",
            () => {

                const recommendations =
                    buildRecommendations(
                        [
                            mediumDecision,
                            highDecision,
                            criticalDecision
                        ]
                    );


                expect(
                    recommendations.length
                ).toBe(
                    3
                );


                expect(
                    recommendations[0].priority
                ).toBe(
                    "Immediate"
                );


                expect(
                    recommendations[1].priority
                ).toBe(
                    "High"
                );


                expect(
                    recommendations[2].priority
                ).toBe(
                    "Medium"
                );

            }
        );


        // ====================================================
        // TEST 11
        // ====================================================

        it(
            "should preserve the source decision",
            () => {

                const recommendation =
                    createRecommendation(
                        criticalDecision
                    );


                expect(
                    recommendation.sourceDecision
                ).toEqual(
                    criticalDecision
                );

            }
        );


        // ====================================================
        // TEST 12
        // ====================================================

        it(
            "should generate recommendations for all valid decisions",
            () => {

                const recommendations =
                    buildRecommendations(
                        [
                            criticalDecision,
                            highDecision,
                            mediumDecision
                        ]
                    );


                expect(
                    recommendations.length
                ).toBe(
                    3
                );


                expect(
                    recommendations.every(
                        recommendation =>
                            recommendation
                            .recommendation
                    )
                ).toBe(
                    true
                );

            }
        );

    }
);