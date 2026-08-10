// ============================================================
// DECISION ENGINE V1
// ============================================================
//
// BUSINESS DECISION INTELLIGENCE
//
// Responsibilities:
//
// 1. Read forecast results.
// 2. Read identified business risks.
// 3. Convert risks into actionable decisions.
// 4. Prioritize decisions by urgency.
// 5. Explain WHY each decision matters.
// 6. Recommend a concrete business action.
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
// Decision priorities:
//
// 1 = Immediate
// 2 = High
// 3 = Medium
// 4 = Low
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
// SORT DECISIONS
// ============================================================

function sortDecisions(
    decisions
) {

    return decisions.sort(
        (
            a,
            b
        ) => {

            return (
                getSeverityPriority(
                    a.severity
                ) -
                getSeverityPriority(
                    b.severity
                )
            );

        }
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
        risk.severity || "Info";


    let action =
        "Monitor the situation and continue recording accurate business data.";


    let reason =
        risk.message ||
        "The forecast engine identified a business condition that should be monitored.";


    // ========================================================
    // LIQUIDITY
    // ========================================================

    if (
        risk.category ===
        "Liquidity"
    ) {

        if (
            risk.title ===
            "Cash Flow Risk"
        ) {

            action =
                "Prioritize cash collections, reduce non-essential spending and review all immediate payment obligations.";

        }

        else if (
            risk.title ===
            "Projected Cash Shortage"
        ) {

            action =
                "Accelerate customer collections, delay non-essential purchases and prepare a short-term cash preservation plan.";

        }

        else if (
            risk.title ===
            "Future Cash Pressure"
        ) {

            action =
                "Review upcoming expenses and purchases now to protect cash reserves over the next 30 days.";

        }

        else if (
            risk.title ===
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
        risk.category ===
        "Revenue"
    ) {

        if (
            risk.title ===
            "Sales Trend"
        ) {

            action =
                "Review recent sales performance, identify the products or customers driving the decline and take targeted sales recovery action.";

        }

        else if (
            risk.title ===
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
        risk.category ===
        "Profitability"
    ) {

        if (
            risk.title ===
            "Projected Loss"
        ) {

            action =
                "Review pricing, product costs and operating expenses immediately to identify the main causes of the projected loss.";

        }

        else if (
            risk.title ===
            "Break-even Forecast"
        ) {

            action =
                "Protect the current margin by controlling unnecessary expenses and reviewing opportunities to improve revenue or pricing.";

        }

        else if (
            risk.title ===
            "Low Gross Margin"
        ) {

            action =
                "Review product costs and selling prices to determine whether margins can be improved.";

        }

        else if (
            risk.title ===
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
        risk.category ===
        "Inventory"
    ) {

        if (
            risk.title ===
            "Inventory Risk"
        ) {

            action =
                "Restock critical products immediately and identify which stockouts could cause lost sales.";

        }

        else if (
            risk.title ===
            "Inventory Pressure"
        ) {

            action =
                "Review low-stock products and prepare replenishment orders before inventory becomes critical.";

        }

        else if (
            risk.title ===
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
        risk.category ===
        "Inventory Demand"
    ) {

        if (
            risk.title.startsWith(
                "Urgent Product Reorder"
            )
        ) {

            action =
                "Restock this product immediately based on its projected demand and remaining inventory.";

        }

        else if (
            risk.title.startsWith(
                "Immediate Product Reorder"
            )
        ) {

            action =
                "Place a replenishment order immediately to reduce the risk of lost sales.";

        }

        else if (
            risk.title.startsWith(
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
        risk.category ===
        "Data Quality"
    ) {

        if (
            risk.title ===
            "Revenue Forecast Confidence"
        ) {

            action =
                "Record more sales consistently before relying heavily on the revenue forecast for major decisions.";

        }

        else if (
            risk.title ===
            "Inventory Demand Confidence"
        ) {

            action =
                "Continue recording product-level sales quantities so demand predictions become more reliable.";

        }

        else if (
            risk.title ===
            "Limited Revenue History"
        ) {

            action =
                "Continue collecting sales data to improve forecast reliability.";

        }

    }


    // ========================================================
    // RETURN DECISION
    // ========================================================

    return {

        severity,

        priority:
            getDecisionPriority(
                severity
            ),

        category:
            risk.category,

        title:
            risk.title,

        decision:
            action,

        reason,

        sourceRisk:
            risk.message

    };
}


// ============================================================
// BUILD DECISIONS FROM RISKS
// ============================================================

function buildDecisions(
    risks
) {

    if (
        !Array.isArray(risks)
    ) {

        return [];
    }


    const decisions =
        risks
            // ==================================================
            // BUSINESS OUTLOOK IS INFORMATIONAL ONLY
            // ==================================================
            //
            // This is generated by the Risk Engine when there
            // are no significant risks.
            //
            // It should appear in reports, but it should NOT
            // become an actionable management decision.
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
// EXECUTIVE SUMMARY
// ============================================================

function buildExecutiveSummary(
    decisions
) {

    if (
        !Array.isArray(decisions) ||
        decisions.length === 0
    ) {

        return {
            status:
                "Healthy",

            headline:
                "No immediate business decisions are required.",

            message:
                "Current forecasts do not indicate significant conditions requiring immediate management action."
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


    if (
        critical.length > 0
    ) {

        return {

            status:
                "Critical",

            headline:
                `${critical.length} immediate business decision(s) require attention.`,

            message:
                "The business has forecast conditions that may materially affect cash flow, profitability, revenue or inventory. Critical actions should be addressed first."

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
                "The business is not currently showing critical conditions, but several areas should be addressed before they become more serious."

        };
    }


    return {

        status:
            "Monitor",

        headline:
            `${decisions.length} business area(s) should be monitored.`,

        message:
            "The forecast engine has identified conditions worth monitoring, but no critical intervention is currently indicated."

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
    // EXECUTIVE SUMMARY
    // ========================================================

    const executiveSummary =
        buildExecutiveSummary(
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
        "🧠 DECISION ENGINE"
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


    // ========================================================
    // RETURN
    // ========================================================

    return {

        executiveSummary,

        totalDecisions:
            decisions.length,

        criticalDecisions,

        highPriorityDecisions,

        mediumPriorityDecisions,

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

    getDecisionPriority

};