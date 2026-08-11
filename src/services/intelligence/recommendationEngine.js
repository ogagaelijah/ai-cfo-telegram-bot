// ============================================================
// RECOMMENDATION ENGINE V1
// ============================================================
//
// PLATFORM-LEVEL RECOMMENDATION ENGINE
//
// Responsibilities:
//
// 1. Receive structured business decisions.
// 2. Convert decisions into actionable recommendations.
// 3. Preserve priority and business category.
// 4. Preserve the source decision.
// 5. Sort recommendations by urgency.
// 6. Safely handle invalid input.
//
// IMPORTANT:
//
// This engine does NOT calculate:
//
// - Revenue
// - Cash
// - Profit
// - Inventory
// - Risks
// - Decisions
//
// Those responsibilities belong to the existing
// Forecast Engine and Decision Engine.
//
// ============================================================


// ============================================================
// RECOMMENDATION PRIORITY
// ============================================================

function getRecommendationPriority(
    priority
) {

    switch (
        priority
    ) {

        case "Immediate":
            return "Immediate";


        case "High":
            return "High";


        case "Medium":
            return "Medium";


        case "Low":
            return "Low";


        default:
            return "Low";
    }
}


// ============================================================
// CREATE RECOMMENDATION
// ============================================================

function createRecommendation(
    decision
) {

    // --------------------------------------------------------
    // INPUT SAFETY
    // --------------------------------------------------------

    if (
        !decision ||
        typeof decision !== "object"
    ) {

        return null;
    }


    // --------------------------------------------------------
    // REQUIRED FIELDS
    // --------------------------------------------------------

    if (
        !decision.category ||
        !decision.title ||
        !decision.decision
    ) {

        return null;
    }


    // --------------------------------------------------------
    // NORMALIZE PRIORITY
    // --------------------------------------------------------

    const priority =
        getRecommendationPriority(
            decision.priority
        );


    // --------------------------------------------------------
    // BUILD RECOMMENDATION
    // --------------------------------------------------------

    return {

        priority,

        category:
            decision.category,

        title:
            decision.title,

        recommendation:
            decision.decision,

        reason:
            decision.reason ||
            decision.sourceRisk ||
            "",

        sourceDecision:
            decision

    };
}


// ============================================================
// BUILD RECOMMENDATIONS
// ============================================================

function buildRecommendations(
    decisions
) {

    // --------------------------------------------------------
    // INPUT SAFETY
    // --------------------------------------------------------

    if (
        !Array.isArray(
            decisions
        )
    ) {

        return [];
    }


    // --------------------------------------------------------
    // CREATE VALID RECOMMENDATIONS
    // --------------------------------------------------------

    const recommendations =
        decisions
            .map(
                decision =>
                    createRecommendation(
                        decision
                    )
            )
            .filter(
                recommendation =>
                    recommendation !== null
            );


    // --------------------------------------------------------
    // PRIORITY ORDER
    // --------------------------------------------------------

    const priorityOrder = {

        Immediate: 1,

        High: 2,

        Medium: 3,

        Low: 4

    };


    recommendations.sort(
        (
            a,
            b
        ) =>
            (
                priorityOrder[
                    a.priority
                ] || 99
            ) -
            (
                priorityOrder[
                    b.priority
                ] || 99
            )
    );


    return recommendations;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    buildRecommendations,

    createRecommendation,

    getRecommendationPriority

};