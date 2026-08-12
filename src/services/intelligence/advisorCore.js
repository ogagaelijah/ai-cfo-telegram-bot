// ============================================================
// ADVISOR CORE V1
// ============================================================
//
// CFO EXECUTIVE ADVISOR
//
// Responsibilities:
//
// 1. Receive structured CFO intelligence.
// 2. Interpret risks and decisions.
// 3. Determine overall business status.
// 4. Determine the highest-priority issue.
// 5. Produce an executive assessment.
// 6. Identify key issues.
// 7. Identify opportunities.
// 8. Convert decisions into recommended actions.
// 9. Preserve the underlying intelligence.
//
// IMPORTANT:
//
// Advisor Core does NOT calculate:
//
// - Revenue
// - Cash
// - Profit
// - Inventory
// - Risks
// - Decisions
//
// Those responsibilities belong to the existing engines.
//
// Advisor Core interprets their output.
//
// ============================================================


// ============================================================
// PRIORITY ORDER
// ============================================================

function getPriorityScore(
    priority
) {

    switch (priority) {

        case "Immediate":
            return 1;

        case "High":
            return 2;

        case "Medium":
            return 3;

        case "Low":
            return 4;

        default:
            return 99;
    }
}


// ============================================================
// BUSINESS STATUS
// ============================================================

function determineBusinessStatus(
    risks,
    decisions
) {

    const riskList =
        Array.isArray(risks)
            ? risks
            : [];


    const decisionList =
        Array.isArray(decisions)
            ? decisions
            : [];


    const hasCriticalRisk =
        riskList.some(
            risk =>
                risk &&
                risk.severity === "Critical"
        );


    const hasImmediateDecision =
        decisionList.some(
            decision =>
                decision &&
                decision.priority === "Immediate"
        );


    const hasHighRisk =
        riskList.some(
            risk =>
                risk &&
                risk.severity === "Warning"
        );


    const hasHighDecision =
        decisionList.some(
            decision =>
                decision &&
                decision.priority === "High"
        );


    if (
        hasCriticalRisk ||
        hasImmediateDecision
    ) {

        return "Critical";
    }


    if (
        hasHighRisk ||
        hasHighDecision
    ) {

        return "Needs Attention";
    }


    return "Healthy";
}


// ============================================================
// OVERALL PRIORITY
// ============================================================

function determineOverallPriority(
    decisions,
    risks
) {

    const decisionList =
        Array.isArray(decisions)
            ? decisions
            : [];


    const riskList =
        Array.isArray(risks)
            ? risks
            : [];


    const decisionPriorities =
        decisionList
            .map(
                decision =>
                    getPriorityScore(
                        decision?.priority
                    )
            );


    const riskPriorities =
        riskList
            .map(
                risk => {

                    switch (
                        risk?.severity
                    ) {

                        case "Critical":
                            return 1;

                        case "Warning":
                            return 2;

                        case "Info":
                            return 3;

                        default:
                            return 99;
                    }

                }
            );


    const priorities =
        [
            ...decisionPriorities,
            ...riskPriorities
        ];


    if (
        priorities.length === 0
    ) {

        return "Low";
    }


    const highestPriority =
        Math.min(
            ...priorities
        );


    switch (
        highestPriority
    ) {

        case 1:
            return "Immediate";

        case 2:
            return "High";

        case 3:
            return "Medium";

        default:
            return "Low";
    }
}


// ============================================================
// FIND TOP DECISION
// ============================================================

function getTopDecision(
    decisions
) {

    if (
        !Array.isArray(decisions) ||
        decisions.length === 0
    ) {

        return null;
    }


    const validDecisions =
        decisions.filter(
            decision =>
                decision &&
                typeof decision === "object"
        );


    if (
        validDecisions.length === 0
    ) {

        return null;
    }


    return (
        [...validDecisions]
            .sort(
                (
                    a,
                    b
                ) =>
                    getPriorityScore(
                        a.priority
                    ) -
                    getPriorityScore(
                        b.priority
                    )
            )[0]
    );
}


// ============================================================
// KEY ISSUES
// ============================================================

function buildKeyIssues(
    risks
) {

    if (
        !Array.isArray(risks)
    ) {

        return [];
    }


    return risks
        .filter(
            risk =>
                risk &&
                typeof risk === "object"
        )
        .map(
            risk => ({

                severity:
                    risk.severity ||
                    "Info",

                category:
                    risk.category ||
                    "General",

                title:
                    risk.title ||
                    "Business Risk",

                message:
                    risk.message ||
                    ""

            })
        );
}


// ============================================================
// RECOMMENDED ACTIONS
// ============================================================

function buildRecommendedActions(
    decisions
) {

    if (
        !Array.isArray(decisions)
    ) {

        return [];
    }


    return (
        decisions
            .filter(
                decision =>
                    decision &&
                    typeof decision === "object"
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    getPriorityScore(
                        a.priority
                    ) -
                    getPriorityScore(
                        b.priority
                    )
            )
            .map(
                decision => ({

                    priority:
                        decision.priority ||
                        "Low",

                    category:
                        decision.category ||
                        "General",

                    title:
                        decision.title ||
                        "Recommended Action",

                    action:
                        decision.decision ||
                        "",

                    reason:
                        decision.reason ||
                        decision.sourceRisk ||
                        ""

                })
            )
    );
}


// ============================================================
// OPPORTUNITIES
// ============================================================
//
// Opportunities are deliberately conservative in V1.
//
// Advisor Core should not invent opportunities.
//
// It only identifies opportunities explicitly represented
// by positive business signals.
//
// ============================================================

function buildOpportunities(
    forecast
) {

    const opportunities = [];


    const revenue =
        forecast?.revenue ||
        {};


    const inventoryDemand =
        forecast?.inventoryDemand ||
        {};


    if (
        revenue.trend === "Growing"
    ) {

        opportunities.push({

            category:
                "Revenue",

            title:
                "Growing Revenue",

            opportunity:
                "Revenue is trending upward. Consider increasing stock availability and preparing for higher demand."

        });

    }


    const products =
        Array.isArray(
            inventoryDemand.products
        )
            ? inventoryDemand.products
            : [];


    const growingProducts =
        products.filter(
            product =>
                product &&
                product.demandTrend ===
                    "Growing"
        );


    if (
        growingProducts.length > 0
    ) {

        opportunities.push({

            category:
                "Inventory",

            title:
                "Growing Product Demand",

            opportunity:
                `${growingProducts.length} product(s) are showing growing demand. Consider prioritizing stock availability for these products.`

        });

    }


    return opportunities;
}


// ============================================================
// EXECUTIVE HEADLINE
// ============================================================

function buildHeadline(
    status,
    topDecision
) {

    if (
        status === "Critical"
    ) {

        return (
            topDecision?.title
                ? `Immediate attention is required for ${topDecision.title}.`
                : "Immediate attention is required for the business."
        );
    }


    if (
        status === "Needs Attention"
    ) {

        return (
            topDecision?.title
                ? `${topDecision.title} requires management attention.`
                : "Several areas of the business require management attention."
        );
    }


    return (
        "Business performance is currently healthy. Continue monitoring key financial indicators."
    );
}


// ============================================================
// EXECUTIVE ASSESSMENT
// ============================================================

function buildAssessment(
    status,
    priority,
    keyIssues,
    opportunities
) {

    if (
        status === "Critical"
    ) {

        return (
            `The business currently has critical issues requiring immediate management action. The highest priority is ${priority.toLowerCase()}.`
        );
    }


    if (
        status === "Needs Attention"
    ) {

        return (
            `The business is operational but requires attention in ${keyIssues.length} identified area(s). Management should address the highest-priority issues before they become more serious.`
        );
    }


    if (
        opportunities.length > 0
    ) {

        return (
            "The business currently appears healthy, with positive signals that may support further growth."
        );
    }


    return (
        "The business currently appears healthy based on the available financial intelligence."
    );
}


// ============================================================
// CONFIDENCE
// ============================================================
//
// Advisor confidence is based on the underlying forecast
// confidence where available.
//
// ============================================================

function calculateConfidence(
    forecast
) {

    const revenueConfidence =
        Number(
            forecast?.revenue?.confidence
        );


    if (
        Number.isFinite(
            revenueConfidence
        )
    ) {

        return Math.max(
            0,
            Math.min(
                100,
                Math.round(
                    revenueConfidence
                )
            )
        );
    }


    return 0;
}


// ============================================================
// MAIN ADVISOR CORE
// ============================================================

function getAdvisorAssessment(
    forecast
) {

    const intelligence =
        forecast &&
        typeof forecast === "object"
            ? forecast
            : {};


    const risks =
        Array.isArray(
            intelligence.risks
        )
            ? intelligence.risks
            : [];


    const decisions =
        Array.isArray(
            intelligence.decisions
        )
            ? intelligence.decisions
            : [];


    const status =
        determineBusinessStatus(
            risks,
            decisions
        );


    const priority =
        determineOverallPriority(
            decisions,
            risks
        );


    const topDecision =
        getTopDecision(
            decisions
        );


    const keyIssues =
        buildKeyIssues(
            risks
        );


    const recommendedActions =
        buildRecommendedActions(
            decisions
        );


    const opportunities =
        buildOpportunities(
            intelligence
        );


    const headline =
        buildHeadline(
            status,
            topDecision
        );


    const assessment =
        buildAssessment(
            status,
            priority,
            keyIssues,
            opportunities
        );


    const confidence =
        calculateConfidence(
            intelligence
        );


    return {

        businessStatus:
            status,

        overallPriority:
            priority,

        headline,

        assessment,

        keyIssues,

        opportunities,

        recommendedActions,

        confidence,

        sourceData: {

            risks,

            decisions

        }

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getAdvisorAssessment,

    determineBusinessStatus,

    determineOverallPriority,

    getTopDecision,

    buildKeyIssues,

    buildRecommendedActions,

    buildOpportunities,

    calculateConfidence

};