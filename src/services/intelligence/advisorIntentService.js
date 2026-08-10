// ============================================================
// ADVISOR INTENT SERVICE V1
// ============================================================
//
// PURPOSE:
//
// Determine what the business owner is asking the CFO.
//
// This is intentionally RULE-BASED for V1.
//
// No OpenAI.
// No Claude.
// No Gemini.
//
// A future AI provider can be added later without replacing
// this service.
//
// ============================================================


// ============================================================
// NORMALIZE QUESTION
// ============================================================

function normalizeQuestion(
    question
) {

    return String(
        question || ""
    )
        .toLowerCase()
        .trim();

}


// ============================================================
// INTENT DEFINITIONS
// ============================================================

const INTENTS = {

    OVERVIEW:
        "overview",

    CASH:
        "cash",

    REVENUE:
        "revenue",

    PROFIT:
        "profit",

    INVENTORY:
        "inventory",

    RISKS:
        "risks",

    DECISIONS:
        "decisions",

    SCENARIO:
        "scenario",

    HELP:
        "help",

    UNKNOWN:
        "unknown"

};


// ============================================================
// KEYWORD MATCHING
// ============================================================

function containsAny(
    question,
    keywords
) {

    return keywords.some(
        keyword =>
            question.includes(
                keyword
            )
    );

}


// ============================================================
// DETERMINE INTENT
// ============================================================

function getAdvisorIntent(
    question
) {

    const normalized =
        normalizeQuestion(
            question
        );


    // --------------------------------------------------------
    // EMPTY QUESTION
    // --------------------------------------------------------

    if (
        !normalized
    ) {

        return {

            intent:
                INTENTS.UNKNOWN,

            confidence:
                0,

            question:
                normalized

        };

    }


    // ========================================================
    // SCENARIO
    // ========================================================
    //
    // Scenario must be checked early because questions such as
    //
    // "What happens if sales fall?"
    //
    // could otherwise be classified as Revenue.

    if (
        containsAny(
            normalized,
            [
                "what happens if",
                "what if",
                "if sales",
                "if revenue",
                "if expenses",
                "if costs",
                "if price",
                "if prices",
                "increase sales",
                "decrease sales",
                "increase expenses",
                "decrease expenses",
                "increase price",
                "decrease price",
                "scenario"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.SCENARIO,

            confidence:
                0.95,

            question:
                normalized

        };

    }


    // ========================================================
    // CASH
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "cash",
                "cash flow",
                "liquidity",
                "cash position",
                "run out of cash",
                "cash shortage",
                "cash balance"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.CASH,

            confidence:
                0.95,

            question:
                normalized

        };

    }


    // ========================================================
    // INVENTORY
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "inventory",
                "stock",
                "stockout",
                "stock out",
                "restock",
                "reorder",
                "product stock",
                "products"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.INVENTORY,

            confidence:
                0.95,

            question:
                normalized

        };

    }


    // ========================================================
    // PROFIT
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "profit",
                "profitability",
                "margin",
                "gross margin",
                "net margin",
                "making money",
                "losing money",
                "loss",
                "break even",
                "break-even"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.PROFIT,

            confidence:
                0.95,

            question:
                normalized

        };

    }


    // ========================================================
    // REVENUE
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "revenue",
                "sales",
                "selling",
                "turnover",
                "sales trend",
                "sales performance"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.REVENUE,

            confidence:
                0.95,

            question:
                normalized

        };

    }


    // ========================================================
    // RISK
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "risk",
                "risks",
                "worry",
                "worried",
                "danger",
                "problem",
                "problems",
                "threat",
                "threats",
                "concern",
                "concerns"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.RISKS,

            confidence:
                0.90,

            question:
                normalized

        };

    }


    // ========================================================
    // DECISIONS
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "what should i do",
                "what should we do",
                "what do i do",
                "what do we do",
                "what should i prioritize",
                "priority",
                "priorities",
                "action",
                "actions",
                "next step",
                "next steps",
                "recommendation",
                "recommendations",
                "advice"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.DECISIONS,

            confidence:
                0.90,

            question:
                normalized

        };

    }


    // ========================================================
    // OVERVIEW
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "how is my business",
                "how is the business",
                "business summary",
                "business overview",
                "overall",
                "overall performance",
                "give me a summary",
                "summarize my business",
                "business doing",
                "business performance"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.OVERVIEW,

            confidence:
                0.90,

            question:
                normalized

        };

    }


    // ========================================================
    // HELP
    // ========================================================

    if (
        containsAny(
            normalized,
            [
                "help",
                "what can you do",
                "what can i ask",
                "commands",
                "how do i use"
            ]
        )
    ) {

        return {

            intent:
                INTENTS.HELP,

            confidence:
                0.90,

            question:
                normalized

        };

    }


    // ========================================================
    // UNKNOWN
    // ========================================================

    return {

        intent:
            INTENTS.UNKNOWN,

        confidence:
            0.20,

        question:
            normalized

    };

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    INTENTS,

    getAdvisorIntent

};