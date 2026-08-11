// ============================================================
// INTELLIGENCE DECISION ENGINE V2
// ============================================================
//
// BUSINESS DECISION INTELLIGENCE
//
// Responsibilities:
//
// 1. Read risks produced by the Risk Engine.
// 2. Convert risks into actionable management decisions.
// 3. Score decisions by:
//      - severity
//      - business impact
//      - urgency
//      - actionability
// 4. Rank all decisions.
// 5. Identify the single highest-priority decision.
// 6. Produce an executive summary.
// 7. Preserve compatibility with the existing AI CFO.
//
// IMPORTANT:
//
// This engine does NOT:
// - calculate revenue
// - calculate profit
// - calculate cash
// - calculate inventory
// - calculate forecasts
// - modify database records
//
// It interprets intelligence already produced by:
//
//     Forecast Engine
//          ↓
//      Risk Engine
//          ↓
//     Decision Engine
//
// ============================================================


// ============================================================
// NUMBER SAFETY
// ============================================================

function toNumber(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// SEVERITY PRIORITY
// ============================================================
//
// Lower number = higher priority.
//
// Critical
// Warning
// Info
//
// ============================================================

function getSeverityPriority(
    severity
) {

    switch (severity) {

        case "Critical":
            return 1;

        case "Warning":
            return 2;

        case "Info":
            return 3;

        default:
            return 4;
    }
}


// ============================================================
// DECISION PRIORITY
// ============================================================
//
// Critical
//     → Immediate
//
// Warning
//     → High
//
// Info
//     → Medium
//
// Unknown
//     → Low
//
// ============================================================

function getDecisionPriority(
    severity
) {

    switch (severity) {

        case "Critical":
            return "Immediate";

        case "Warning":
            return "High";

        case "Info":
            return "Medium";

        default:
            return "Low";
    }
}


// ============================================================
// BUSINESS IMPACT SCORE
// ============================================================
//
// Higher number = greater business impact.
//
// Liquidity and profitability receive the highest weight
// because they directly affect the business's ability to
// survive and remain financially healthy.
//
// ============================================================

function getBusinessImpactScore(
    category
) {

    switch (category) {

        case "Liquidity":
            return 100;

        case "Profitability":
            return 95;

        case "Revenue":
            return 90;

        case "Inventory Demand":
            return 85;

        case "Inventory":
            return 80;

        case "Data Quality":
            return 40;

        case "Business Outlook":
            return 10;

        default:
            return 50;
    }
}


// ============================================================
// ACTIONABILITY SCORE
// ============================================================
//
// Higher number = easier to convert into an immediate
// management action.
//
// ============================================================

function getActionabilityScore(
    category,
    title
) {

    if (
        category ===
        "Liquidity"
    ) {

        return 100;
    }


    if (
        category ===
        "Profitability"
    ) {

        return 95;
    }


    if (
        category ===
        "Inventory Demand"
    ) {

        return 90;
    }


    if (
        category ===
        "Inventory"
    ) {

        return 85;
    }


    if (
        category ===
        "Revenue"
    ) {

        return 80;
    }


    if (
        category ===
        "Data Quality"
    ) {

        return 45;
    }


    if (
        title &&
        title.includes(
            "Monitoring"
        )
    ) {

        return 30;
    }


    return 50;
}


// ============================================================
// URGENCY SCORE
// ============================================================
//
// Higher number = more urgent.
//
// ============================================================

function getUrgencyScore(
    severity,
    priority
) {

    if (
        severity ===
        "Critical"
    ) {

        return 100;
    }


    if (
        priority ===
        "Immediate"
    ) {

        return 100;
    }


    if (
        severity ===
        "Warning"
    ) {

        return 70;
    }


    if (
        priority ===
        "High"
    ) {

        return 70;
    }


    if (
        severity ===
        "Info"
    ) {

        return 40;
    }


    return 20;
}


// ============================================================
// DECISION SCORE
// ============================================================
//
// The final score combines:
//
//     Severity
//     Business Impact
//     Urgency
//     Actionability
//
// Maximum:
//
//     100
//
// This allows two Critical decisions to be ranked instead
// of simply treating them as equal.
//
// ============================================================

function calculateDecisionScore(
    severity,
    category,
    priority,
    title
) {

    const severityScore =
        (
            5 -
            getSeverityPriority(
                severity
            )
        ) * 20;


    const impactScore =
        getBusinessImpactScore(
            category
        );


    const urgencyScore =
        getUrgencyScore(
            severity,
            priority
        );


    const actionabilityScore =
        getActionabilityScore(
            category,
            title
        );


    const score =
        (
            severityScore * 0.40
        ) +
        (
            impactScore * 0.25
        ) +
        (
            urgencyScore * 0.20
        ) +
        (
            actionabilityScore * 0.15
        );


    return Math.round(
        score
    );
}


// ============================================================
// CREATE DECISION
// ============================================================

function createDecision(
    risk
) {

    if (
        !risk ||
        !risk.category
    ) {

        return null;
    }


    const severity =
        risk.severity ||
        "Info";


    const category =
        risk.category;


    const title =
        risk.title ||
        "Business Decision";


    const priority =
        getDecisionPriority(
            severity
        );


    let action =
        "Monitor the situation and continue recording accurate business data.";


    let reason =
        risk.message ||
        "The forecast engine identified a business condition that should be monitored.";


    // ========================================================
    // LIQUIDITY
    // ========================================================

    if (
        category ===
        "Liquidity"
    ) {

        if (
            title ===
            "Cash Flow Risk"
        ) {

            action =
                "Prioritize cash collections, reduce non-essential spending and review all immediate payment obligations.";

        }

        else if (
            title ===
            "Projected Cash Shortage"
        ) {

            action =
                "Accelerate customer collections, delay non-essential purchases and prepare a short-term cash preservation plan.";

        }

        else if (
            title ===
            "Future Cash Pressure"
        ) {

            action =
                "Review upcoming expenses and purchases now to protect cash reserves over the next 30 days.";

        }

        else if (
            title ===
            "Declining Cash Flow"
        ) {

            action =
                "Investigate the causes of negative cash flow and reduce avoidable outflows while improving collections.";

        }

    }


    // ========================================================
    // REVENUE
    // ========================================================

    else if (
        category ===
        "Revenue"
    ) {

        if (
            title ===
            "Sales Trend"
        ) {

            action =
                "Review recent sales performance, identify the products or customers driving the decline and take targeted sales recovery action.";

        }

        else if (
            title ===
            "Limited Revenue History"
        ) {

            action =
                "Continue recording sales consistently so the forecasting engine can build a stronger revenue history.";

        }

    }


    // ========================================================
    // PROFITABILITY
    // ========================================================

    else if (
        category ===
        "Profitability"
    ) {

        if (
            title ===
            "Projected Loss"
        ) {

            action =
                "Review pricing, product costs and operating expenses immediately to identify the main causes of the projected loss.";

        }

        else if (
            title ===
            "Break-even Forecast"
        ) {

            action =
                "Protect the current margin by controlling unnecessary expenses and reviewing opportunities to improve revenue or pricing.";

        }

        else if (
            title ===
            "Low Gross Margin"
        ) {

            action =
                "Review product costs and selling prices to determine whether margins can be improved.";

        }

        else if (
            title ===
            "Low Net Profit Margin"
        ) {

            action =
                "Review operating expenses and product costs to identify opportunities to increase net profitability.";

        }

    }


    // ========================================================
    // INVENTORY
    // ========================================================

    else if (
        category ===
        "Inventory"
    ) {

        if (
            title ===
            "Inventory Risk"
        ) {

            action =
                "Restock critical products immediately and identify which stockouts could cause lost sales.";

        }

        else if (
            title ===
            "Inventory Pressure"
        ) {

            action =
                "Review low-stock products and prepare replenishment orders before inventory becomes critical.";

        }

        else if (
            title ===
            "Inventory Monitoring"
        ) {

            action =
                "Monitor low-stock products and plan replenishment before stock levels become critical.";

        }

    }


    // ========================================================
    // INVENTORY DEMAND
    // ========================================================

    else if (
        category ===
        "Inventory Demand"
    ) {

        if (
            title.startsWith(
                "Urgent Product Reorder"
            )
        ) {

            action =
                "Restock this product immediately based on its projected demand and remaining inventory.";

        }

        else if (
            title.startsWith(
                "Immediate Product Reorder"
            )
        ) {

            action =
                "Place a replenishment order immediately to reduce the risk of lost sales.";

        }

        else if (
            title.startsWith(
                "Upcoming Product Stockout"
            )
        ) {

            action =
                "Plan a replenishment order soon and monitor the product's sales velocity closely.";

        }

    }


    // ========================================================
    // DATA QUALITY
    // ========================================================

    else if (
        category ===
        "Data Quality"
    ) {

        if (
            title ===
            "Revenue Forecast Confidence"
        ) {

            action =
                "Record more sales consistently before relying heavily on the revenue forecast for major decisions.";

        }

        else if (
            title ===
            "Inventory Demand Confidence"
        ) {

            action =
                "Continue recording product-level sales quantities so demand predictions become more reliable.";

        }

        else if (
            title ===
            "Limited Revenue History"
        ) {

            action =
                "Continue collecting sales data to improve forecast reliability.";

        }

    }


    // ========================================================
    // DECISION SCORE
    // ========================================================

    const score =
        calculateDecisionScore(
            severity,
            category,
            priority,
            title
        );


    // ========================================================
    // RETURN
    // ========================================================

    return {

        severity,

        priority,

        category,

        title,

        decision:
            action,

        reason,

        sourceRisk:
            risk.message,

        score,

        businessImpact:
            getBusinessImpactScore(
                category
            ),

        urgency:
            getUrgencyScore(
                severity,
                priority
            ),

        actionability:
            getActionabilityScore(
                category,
                title
            )

    };
}


// ============================================================
// SORT DECISIONS
// ============================================================
//
// Highest score first.
//
// If two decisions have the same score:
//
//     1. Severity wins.
//     2. Business impact wins.
//     3. Original order is preserved.
//
// ============================================================

function sortDecisions(
    decisions
) {

    return decisions.sort(
        (
            a,
            b
        ) => {

            if (
                b.score !==
                a.score
            ) {

                return (
                    b.score -
                    a.score
                );
            }


            const severityDifference =
                getSeverityPriority(
                    a.severity
                ) -
                getSeverityPriority(
                    b.severity
                );


            if (
                severityDifference !== 0
            ) {

                return severityDifference;
            }


            return (
                getBusinessImpactScore(
                    b.category
                ) -
                getBusinessImpactScore(
                    a.category
                )
            );

        }
    );
}


// ============================================================
// BUILD DECISIONS FROM RISKS
// ============================================================

function buildDecisions(
    risks
) {

    if (
        !Array.isArray(
            risks
        )
    ) {

        return [];
    }


    const decisions =
        risks

            // ==================================================
            // BUSINESS OUTLOOK IS INFORMATIONAL ONLY
            // ==================================================
            //
            // It belongs in reports, but should never become
            // an actionable management decision.
            //

            .filter(
                risk =>
                    !(
                        risk &&
                        risk.category ===
                        "Business Outlook"
                    )
            )

            .map(
                createDecision
            )

            .filter(
                decision =>
                    decision !== null
            );


    return sortDecisions(
        decisions
    );
}


// ============================================================
// GET TOP DECISION
// ============================================================
//
// The top decision is the single action the AI CFO believes
// deserves the owner's attention first.
//
// ============================================================

function getTopDecision(
    decisions
) {

    if (
        !Array.isArray(
            decisions
        ) ||
        decisions.length === 0
    ) {

        return null;
    }


    return decisions[0];
}


// ============================================================
// BUILD EXECUTIVE SUMMARY
// ============================================================

function buildExecutiveSummary(
    decisions
) {

    if (
        !Array.isArray(
            decisions
        ) ||
        decisions.length === 0
    ) {

        return {

            status:
                "Healthy",

            headline:
                "No immediate business decisions are required.",

            message:
                "Current forecasts do not indicate significant conditions requiring immediate management action.",

            topPriority:
                "Maintain Current Operations"

        };
    }


    const critical =
        decisions.filter(
            decision =>
                decision.severity ===
                "Critical"
        );


    const warnings =
        decisions.filter(
            decision =>
                decision.severity ===
                "Warning"
        );


    const topDecision =
        decisions[0];


    if (
        critical.length > 0
    ) {

        return {

            status:
                "Critical",

            headline:
                `${critical.length} immediate business decision(s) require attention.`,

            message:
                `The highest-priority action is: ${topDecision.title}. ${topDecision.decision}`,

            topPriority:
                topDecision.title

        };
    }


    if (
        warnings.length > 0
    ) {

        return {

            status:
                "Needs Attention",

            headline:
                `${warnings.length} high-priority business decision(s) require attention.`,

            message:
                `The highest-priority action is: ${topDecision.title}. ${topDecision.decision}`,

            topPriority:
                topDecision.title

        };
    }


    return {

        status:
            "Monitor",

        headline:
            `${decisions.length} business area(s) should be monitored.`,

        message:
            `The most important current action is: ${topDecision.title}. ${topDecision.decision}`,

        topPriority:
            topDecision.title

    };
}


// ============================================================
// GET DECISION GROUPS
// ============================================================

function getDecisionGroups(
    decisions
) {

    const list =
        Array.isArray(
            decisions
        )
            ? decisions
            : [];


    const immediateDecisions =
        list.filter(
            decision =>
                decision.priority ===
                "Immediate"
        );


    const highPriorityDecisions =
        list.filter(
            decision =>
                decision.priority ===
                "High"
        );


    const monitoringDecisions =
        list.filter(
            decision =>
                decision.priority ===
                "Medium" ||
                decision.priority ===
                "Low"
        );


    return {

        immediateDecisions,

        highPriorityDecisions,

        monitoringDecisions

    };
}


// ============================================================
// MAIN DECISION ENGINE
// ============================================================

function getDecisionForecast(
    forecast
) {

    const data =
        forecast || {};


    const risks =
        Array.isArray(
            data.risks
        )
            ? data.risks
            : [];


    // ========================================================
    // BUILD DECISIONS
    // ========================================================

    const decisions =
        buildDecisions(
            risks
        );


    // ========================================================
    // TOP DECISION
    // ========================================================

    const topDecision =
        getTopDecision(
            decisions
        );


    // ========================================================
    // EXECUTIVE SUMMARY
    // ========================================================

    const executiveSummary =
        buildExecutiveSummary(
            decisions
        );


    // ========================================================
    // DECISION GROUPS
    // ========================================================

    const groups =
        getDecisionGroups(
            decisions
        );


    // ========================================================
    // COUNTS
    // ========================================================

    const criticalDecisions =
        decisions.filter(
            decision =>
                decision.severity ===
                "Critical"
        ).length;


    const highPriorityDecisions =
        decisions.filter(
            decision =>
                decision.severity ===
                "Warning"
        ).length;


    const mediumPriorityDecisions =
        decisions.filter(
            decision =>
                decision.severity ===
                "Info"
        ).length;


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "🧠 DECISION ENGINE V2"
    );


    console.log(
        "Total Decisions:",
        decisions.length
    );


    console.log(
        "Immediate Decisions:",
        criticalDecisions
    );


    console.log(
        "High Priority Decisions:",
        highPriorityDecisions
    );


    console.log(
        "Medium Priority Decisions:",
        mediumPriorityDecisions
    );


    console.log(
        "Top Decision:",
        topDecision
            ? topDecision.title
            : "None"
    );


    console.log(
        "Top Decision Score:",
        topDecision
            ? topDecision.score
            : 0
    );


    // ========================================================
    // RETURN
    // ========================================================

    return {

        executiveSummary,

        topDecision,

        totalDecisions:
            decisions.length,

        criticalDecisions,

        highPriorityDecisions,

        mediumPriorityDecisions,

        immediateDecisions:
            groups.immediateDecisions,

        highPriorityDecisionList:
            groups.highPriorityDecisions,

        monitoringDecisions:
            groups.monitoringDecisions,

        decisions

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getDecisionForecast,

    buildDecisions,

    buildExecutiveSummary,

    createDecision,

    getDecisionPriority,

    getSeverityPriority,

    getBusinessImpactScore,

    getActionabilityScore,

    getUrgencyScore,

    calculateDecisionScore,

    getTopDecision,

    getDecisionGroups,

    sortDecisions

};