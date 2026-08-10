const businessForecast =
    require("./businessForecastService");

const intelligenceDecisionEngine =
    require("./intelligence/decisionEngine");

// ============================================================
// LEGACY COMPATIBILITY DECISION ENGINE
// ============================================================
//
// The original AI CFO project used:
//
//     src/services/decisionEngine.js
//
// The new architecture uses:
//
//     Forecast Engine
//          ↓
//     Risk Engine
//          ↓
//     Intelligence Decision Engine
//
// This file exists only to maintain compatibility with older
// services that still call:
//
//     generateDecision(telegramId, topic)
//
// This file does NOT calculate business intelligence.
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
// FIND DECISION BY TOPIC
// ============================================================
//
// Supported topics:
//
//     cash
//     profit
//     revenue
//     risk
//     priority
//
// No topic:
//
//     highest-priority business decision
//
// ============================================================

function findDecisionByTopic(
    decisions,
    topic
) {

    if (
        !Array.isArray(decisions) ||
        decisions.length === 0
    ) {

        return null;
    }


    // ========================================================
    // GENERAL CFO DECISION
    // ========================================================
    //
    // The Intelligence Decision Engine sorts decisions by:
//
//     Critical
//     Warning
//     Info
//
// Therefore decisions[0] is the highest-priority decision.

    if (
        !topic
    ) {

        return (
            decisions[0] ||
            null
        );
    }


    // ========================================================
    // CASH
    // ========================================================

    if (
        topic === "cash"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.category ===
                    "Liquidity"
            ) ||
            null
        );
    }


    // ========================================================
    // PROFIT
    // ========================================================

    if (
        topic === "profit"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.category ===
                    "Profitability"
            ) ||
            null
        );
    }


    // ========================================================
    // REVENUE
    // ========================================================

    if (
        topic === "revenue"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.category ===
                    "Revenue"
            ) ||
            null
        );
    }


    // ========================================================
    // RISK
    // ========================================================

    if (
        topic === "risk"
    ) {

        return (
            decisions.find(
                decision =>
                    decision.severity ===
                    "Critical"
            ) ||

            decisions.find(
                decision =>
                    decision.severity ===
                    "Warning"
            ) ||

            decisions.find(
                decision =>
                    decision.severity ===
                    "Info"
            ) ||

            null
        );
    }


    // ========================================================
    // PRIORITY
    // ========================================================

    if (
        topic === "priority"
    ) {

        return (
            decisions[0] ||
            null
        );
    }


    // ========================================================
    // UNKNOWN TOPIC
    // ========================================================

    return (
        decisions[0] ||
        null
    );
}


// ============================================================
// BUILD LEGACY RESPONSE
// ============================================================
//
// Older services expect:
//
//     urgency
//     priority
//     explanation
//     recommendation
//     projectedRevenue
//     projectedProfit
//     confidence
//
// The new Intelligence Decision Engine provides:
//
//     severity
//     priority
//     category
//     title
//     decision
//     reason
//     sourceRisk
//
// ============================================================

function buildLegacyDecision(
    forecast,
    decision
) {

    const data =
        forecast || {};


    const revenue =
        data.revenue || {};


    const profit =
        data.profit || {};


    const selectedDecision =
        decision || null;


    // ========================================================
    // FORECAST VALUES
    // ========================================================

    const projectedRevenue =
        toNumber(
            revenue.tomorrow
        );


    const projectedProfit =
        toNumber(
            profit.tomorrowProfit
        );


    const confidence =
        toNumber(
            revenue.confidence
        );


    // ========================================================
    // NO DECISION
    // ========================================================

    if (
        !selectedDecision
    ) {

        return {

            urgency:
                "Low",

            priority:
                "Maintain Current Operations",

            explanation:
                data
                    ?.executiveSummary
                    ?.message ||
                "No immediate business decision has been identified from the current financial intelligence.",

            recommendation:
                "Continue recording accurate financial data and monitor business performance regularly.",

            projectedRevenue,

            projectedProfit,

            confidence

        };
    }


    // ========================================================
    // URGENCY
    // ========================================================

    let urgency =
        "Low";


    if (
        selectedDecision.priority ===
        "Immediate"
    ) {

        urgency =
            "High";

    }

    else if (
        selectedDecision.priority ===
        "High"
    ) {

        urgency =
            "High";

    }

    else if (
        selectedDecision.priority ===
        "Medium"
    ) {

        urgency =
            "Medium";
    }


    // ========================================================
    // RETURN COMPATIBILITY FORMAT
    // ========================================================

    return {

        urgency,

        priority:
            selectedDecision.title ||
            selectedDecision.category ||
            "Maintain Current Operations",

        explanation:
            selectedDecision.reason ||
            selectedDecision.sourceRisk ||
            "The forecast engine identified a business condition that should be monitored.",

        recommendation:
            selectedDecision.decision ||
            "Continue monitoring business performance.",

        projectedRevenue,

        projectedProfit,

        confidence

    };
}


// ============================================================
// GENERATE DECISION
// ============================================================
//
// LEGACY PUBLIC INTERFACE:
//
//     generateDecision(
//         telegramId,
//         topic
//     )
//
// Internally:
//
//     Business Forecast
//             ↓
//     Intelligence Decision Engine
//
// ============================================================

function generateDecision(
    telegramId,
    topic = null
) {

    // ========================================================
    // GET COMPLETE BUSINESS FORECAST
    // ========================================================

    const forecast =
        businessForecast
            .getBusinessForecast(
                telegramId
            );


    // ========================================================
    // RUN INTELLIGENCE DECISION ENGINE
    // ========================================================

    const decisionForecast =
        intelligenceDecisionEngine
            .getDecisionForecast(
                forecast
            );


    // ========================================================
    // SELECT DECISION
    // ========================================================

    const selectedDecision =
        findDecisionByTopic(
            decisionForecast?.decisions,
            topic
        );


    // ========================================================
    // BUILD LEGACY RESPONSE
    // ========================================================

    return buildLegacyDecision(
        forecast,
        selectedDecision
    );
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    generateDecision

};