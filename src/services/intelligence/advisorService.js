// ============================================================
// AI CFO ADVISOR SERVICE V1
// ============================================================
//
// PLATFORM-LEVEL ADVISOR ORCHESTRATOR
//
// Responsibilities:
//
// 1. Receive a business question.
// 2. Determine the user's advisor intent.
// 3. Pass structured CFO intelligence to Advisor Core.
// 4. Identify the relevant risks and decisions.
// 5. Handle supported scenario questions.
// 6. Delegate scenario calculations to scenarioEngine.
// 7. Return a clean, platform-independent advisor response.
//
// IMPORTANT:
//
// This service does NOT calculate:
//
// - Revenue
// - Cash
// - Profit
// - Inventory
// - Risks
// - Decisions
//
// Those responsibilities belong to the existing intelligence
// engines.
//
// Advisor Core interprets the intelligence.
//
// Scenario Engine performs deterministic scenario calculations.
//
// ============================================================

const {
    getAdvisorIntent
} = require("./advisorIntentService");

const {
    getAdvisorAssessment
} = require("./advisorCore");

const {
    buildScenario
} = require("./scenarioEngine");


// ============================================================
// SAFE TEXT
// ============================================================

function safeText(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";
    }

    return String(
        value
    ).trim();
}


// ============================================================
// NORMALIZE INTELLIGENCE
// ============================================================
//
// Keeps the service safe when one of the intelligence
// sections is missing.
//
// ============================================================

function normalizeIntelligence(
    intelligence
) {

    const data =
        intelligence &&
        typeof intelligence === "object"
            ? intelligence
            : {};


    return {

        revenue:
            data.revenue || {},

        cash:
            data.cash || {},

        inventory:
            data.inventory || {},

        inventoryDemand:
            data.inventoryDemand || {},

        profit:
            data.profit || {},

        expenseHistory:
            Array.isArray(
                data.expenseHistory
            )
                ? data.expenseHistory
                : [],

        risks:
            Array.isArray(
                data.risks
            )
                ? data.risks
                : [],

        decisions:
            Array.isArray(
                data.decisions
            )
                ? data.decisions
                : [],

        executiveSummary:
            data.executiveSummary || {}

    };
}


// ============================================================
// FIND RELEVANT RISKS
// ============================================================
//
// Advisor Service does not create risks.
//
// It only selects risks that are relevant to the question.
//
// ============================================================

function findRelevantRisks(
    risks,
    question
) {

    if (
        !Array.isArray(
            risks
        )
    ) {

        return [];
    }


    const text =
        safeText(
            question
        ).toLowerCase();


    if (
        !text
    ) {

        return risks.slice(
            0,
            5
        );
    }


    const words =
        text
            .split(
                /\s+/
            )
            .filter(
                word =>
                    word.length >= 4
            );


    const matched =
        risks.filter(
            risk => {

                if (
                    !risk ||
                    typeof risk !== "object"
                ) {

                    return false;
                }


                const riskText =
                    (
                        safeText(
                            risk.category
                        ) +
                        " " +
                        safeText(
                            risk.title
                        ) +
                        " " +
                        safeText(
                            risk.message
                        )
                    ).toLowerCase();


                return words.some(
                    word =>
                        riskText.includes(
                            word
                        )
                );

            }
        );


    return matched.length > 0
        ? matched.slice(
            0,
            5
        )
        : risks.slice(
            0,
            5
        );
}


// ============================================================
// FIND RELEVANT DECISIONS
// ============================================================

function findRelevantDecisions(
    decisions,
    question
) {

    if (
        !Array.isArray(
            decisions
        )
    ) {

        return [];
    }


    const text =
        safeText(
            question
        ).toLowerCase();


    if (
        !text
    ) {

        return decisions.slice(
            0,
            5
        );
    }


    const words =
        text
            .split(
                /\s+/
            )
            .filter(
                word =>
                    word.length >= 4
            );


    const matched =
        decisions.filter(
            decision => {

                if (
                    !decision ||
                    typeof decision !== "object"
                ) {

                    return false;
                }


                const decisionText =
                    (
                        safeText(
                            decision.category
                        ) +
                        " " +
                        safeText(
                            decision.title
                        ) +
                        " " +
                        safeText(
                            decision.decision
                        ) +
                        " " +
                        safeText(
                            decision.reason
                        )
                    ).toLowerCase();


                return words.some(
                    word =>
                        decisionText.includes(
                            word
                        )
                );

            }
        );


    return matched.length > 0
        ? matched.slice(
            0,
            5
        )
        : decisions.slice(
            0,
            5
        );
}


// ============================================================
// EXTRACT SCENARIO CHANGE
// ============================================================
//
// Examples:
//
// "sales fall 20%"
// "revenue drops 15%"
// "expenses increase by 10%"
//
// Returns:
//
// {
//     direction: "decrease",
//     percentage: 20
// }
//
// ============================================================

function extractScenarioChange(
    question
) {

    const text =
        safeText(
            question
        ).toLowerCase();


    if (
        !text
    ) {

        return null;
    }


    const percentageMatch =
        text.match(
            /(-?\d+(?:\.\d+)?)\s*%/
        );


    if (
        !percentageMatch
    ) {

        return null;
    }


    const percentage =
        Math.abs(
            Number(
                percentageMatch[1]
            )
        );


    if (
        !Number.isFinite(
            percentage
        )
    ) {

        return null;
    }


    const decreaseWords = [

        "fall",
        "falls",
        "fell",
        "drop",
        "drops",
        "dropped",
        "decrease",
        "decreases",
        "decreased",
        "decline",
        "declines",
        "declined",
        "lower",
        "lowers",
        "lowered",
        "reduce",
        "reduces",
        "reduced",
        "down"

    ];


    const increaseWords = [

        "increase",
        "increases",
        "increased",
        "grow",
        "grows",
        "grew",
        "growth",
        "rise",
        "rises",
        "rose",
        "higher",
        "raise",
        "raises",
        "raised",
        "up"

    ];


    const hasDecrease =
        decreaseWords.some(
            word =>
                text.includes(
                    word
                )
        );


    const hasIncrease =
        increaseWords.some(
            word =>
                text.includes(
                    word
                )
        );


    if (
        hasDecrease &&
        !hasIncrease
    ) {

        return {

            direction:
                "decrease",

            percentage

        };
    }


    if (
        hasIncrease &&
        !hasDecrease
    ) {

        return {

            direction:
                "increase",

            percentage

        };
    }


    return null;
}


// ============================================================
// DETERMINE SCENARIO TYPE
// ============================================================

function determineScenarioType(
    question
) {

    const text =
        safeText(
            question
        ).toLowerCase();


    if (
        !text
    ) {

        return null;
    }


    const expenseWords = [

        "expense",
        "expenses",
        "cost",
        "costs",
        "spending",
        "operating cost",
        "operating costs"

    ];


    const revenueWords = [

        "sales",
        "sale",
        "revenue",
        "turnover",
        "income"

    ];


    const hasExpense =
        expenseWords.some(
            word =>
                text.includes(
                    word
                )
        );


    const hasRevenue =
        revenueWords.some(
            word =>
                text.includes(
                    word
                )
        );


    if (
        hasExpense
    ) {

        return "expense";
    }


    if (
        hasRevenue
    ) {

        return "revenue";
    }


    return null;
}


// ============================================================
// BUILD SCENARIO OPTIONS
// ============================================================

function buildScenarioOptions(
    question
) {

    const scenarioType =
        determineScenarioType(
            question
        );


    const change =
        extractScenarioChange(
            question
        );


    if (
        !scenarioType ||
        !change
    ) {

        return null;
    }


    const signedPercentage =
        change.direction ===
        "decrease"
            ? -change.percentage
            : change.percentage;


    return {

        type:
            scenarioType,

        percentage:
            signedPercentage

    };
}


// ============================================================
// BUILD SCENARIO
// ============================================================
//
// Scenario calculations are delegated to scenarioEngine.
//
// Advisor Service does not calculate scenario numbers itself.
//
// ============================================================

function buildAdvisorScenario(
    intelligence,
    question,
    intent
) {

    if (
        intent?.intent !==
        "scenario"
    ) {

        return null;
    }


    const options =
        buildScenarioOptions(
            question
        );


    if (
        !options
    ) {

        return null;
    }


    return buildScenario(
        {
            revenue:
                intelligence.revenue,

            cash:
                intelligence.cash,

            profit:
                intelligence.profit,

            inventory:
                intelligence.inventory,

            inventoryDemand:
                intelligence.inventoryDemand,

            expenseHistory:
                intelligence.expenseHistory,

            risks:
                intelligence.risks,

            decisions:
                intelligence.decisions,

            executiveSummary:
                intelligence.executiveSummary

        },
        options
    );
}


// ============================================================
// BUILD ADVISOR CONTEXT
// ============================================================
//
// This is the central intelligence package passed through
// the Advisor Service.
//
// ============================================================

function buildAdvisorContext(
    question,
    intelligence
) {

    const data =
        normalizeIntelligence(
            intelligence
        );


    const normalizedQuestion =
        safeText(
            question
        );


    const intent =
        getAdvisorIntent(
            normalizedQuestion
        );


    const relevantRisks =
        findRelevantRisks(
            data.risks,
            normalizedQuestion
        );


    const relevantDecisions =
        findRelevantDecisions(
            data.decisions,
            normalizedQuestion
        );


    const scenarioOptions =
        buildScenarioOptions(
            normalizedQuestion
        );


    const scenario =
        buildAdvisorScenario(
            data,
            normalizedQuestion,
            intent
        );


    const coreIntelligence = {

        ...data,

        risks:
            relevantRisks,

        decisions:
            relevantDecisions

    };


    const advisorAssessment =
        getAdvisorAssessment(
            coreIntelligence
        );


    return {

        question:
            normalizedQuestion,

        intent,

        scenarioOptions,

        scenario,

        intelligence:
            data,

        advisorAssessment,

        relevantRisks,

        relevantDecisions

    };
}


// ============================================================
// BUILD SCENARIO RESPONSE
// ============================================================

function buildScenarioResponse(
    scenario
) {

    if (
        !scenario
    ) {

        return {

            status:
                "Info",

            answer:
                "I recognized this as a scenario question, but I could not determine the scenario type or percentage change.",

            scenario:
                null,

            decisions: [],

            risks: []

        };
    }


    const scenarioType =
        safeText(
            scenario.scenarioType
        );


    // ========================================================
    // REVENUE SCENARIO
    // ========================================================

    if (
        scenarioType ===
        "Revenue Change"
    ) {

        const percentage =
            Number(
                scenario.changePercentage
            ) || 0;


        const direction =
            safeText(
                scenario.direction
            ) ||
            (
                percentage < 0
                    ? "decrease"
                    : "increase"
            );


        const baseline =
            Number(
                scenario.baseline?.tomorrow
            ) || 0;


        const projected =
            Number(
                scenario.projected?.tomorrow
            ) || 0;


        const cash7 =
            Number(
                scenario.cashImpact?.scenario?.next7Days
            ) || 0;


        const directionText =
            direction ===
            "decrease"
                ? "decrease"
                : "increase";


        return {

            status:
                scenario.status ||
                "Monitor",

            answer:
                `If revenue were to ${directionText} by ${Math.abs(
                    percentage
                )}%, the next forecast day would change from approximately ₦${Math.round(
                    baseline
                ).toLocaleString()} to ₦${Math.round(
                    projected
                ).toLocaleString()}. Projected cash over the next seven days would be approximately ₦${Math.round(
                    cash7
                ).toLocaleString()}. ${safeText(
                    scenario.impact
                )}`,

            scenario,

            decisions:
                scenario.decision
                    ? [scenario.decision]
                    : [],

            risks: []

        };
    }


    // ========================================================
    // EXPENSE SCENARIO
    // ========================================================

    if (
        scenarioType ===
        "Expense Change"
    ) {

        const percentage =
            Number(
                scenario.changePercentage
            ) || 0;


        const baseline =
            Number(
                scenario.baseline
            ) || 0;


        const projected =
            Number(
                scenario.projected
            ) || 0;


        const additionalExpenses =
            Number(
                scenario.additionalExpenses
            ) || 0;


        const direction =
            safeText(
                scenario.direction
            ) ||
            (
                percentage < 0
                    ? "decrease"
                    : "increase"
            );


        if (
            baseline <= 0
        ) {

            return {

                status:
                    scenario.status ||
                    "Monitor",

                answer:
                    "There is not enough expense history to calculate the financial impact of this scenario.",

                scenario,

                decisions:
                    scenario.decision
                        ? [scenario.decision]
                        : [],

                risks: []

            };
        }


        const action =
            direction ===
            "decrease"
                ? "decrease"
                : "increase";


        const effect =
            direction ===
            "decrease"
                ? "save"
                : "add";


        return {

            status:
                scenario.status ||
                "Monitor",

            answer:
                `If expenses were to ${action} by ${Math.abs(
                    percentage
                )}%, total expenses represented by the available history would change from approximately ₦${Math.round(
                    baseline
                ).toLocaleString()} to ₦${Math.round(
                    projected
                ).toLocaleString()}. That would ${effect} approximately ₦${Math.round(
                    Math.abs(
                        additionalExpenses
                    )
                ).toLocaleString()} in expenses.`,

            scenario,

            decisions:
                scenario.decision
                    ? [scenario.decision]
                    : [],

            risks: []

        };
    }


    return {

        status:
            "Info",

        answer:
            "This scenario type is not supported yet.",

        scenario,

        decisions: [],

        risks: []

    };
}


// ============================================================
// BUILD RESPONSE
// ============================================================
//
// Advisor Core provides the executive interpretation.
//
// Advisor Service adds question-specific routing.
//
// ============================================================

function buildAdvisorResponse(
    context
) {

    const intent =
        context.intent?.intent ||
        "unknown";


    // ========================================================
    // SCENARIO
    // ========================================================

    if (
        intent ===
        "scenario"
    ) {

        return buildScenarioResponse(
            context.scenario
        );
    }


    const assessment =
        context.advisorAssessment ||
        {};


    const decisions =
        Array.isArray(
            context.relevantDecisions
        )
            ? context.relevantDecisions
            : [];


    const risks =
        Array.isArray(
            context.relevantRisks
        )
            ? context.relevantRisks
            : [];


    // ========================================================
    // OVERVIEW
    // ========================================================

    if (
        intent ===
        "overview"
    ) {

        return {

            status:
                assessment.businessStatus ||
                "Healthy",

            answer:
                assessment.headline ||
                assessment.assessment ||
                "Here is the current business outlook.",

            assessment,

            decisions,

            risks

        };
    }


    // ========================================================
    // RISKS
    // ========================================================

    if (
        intent ===
        "risks"
    ) {

        return {

            status:
                assessment.businessStatus ||
                "Healthy",

            answer:
                risks.length > 0
                    ? `There are ${risks.length} business risk(s) currently requiring attention.`
                    : "No significant risks are currently identified.",

            assessment,

            decisions,

            risks

        };
    }


    // ========================================================
    // DECISIONS
    // ========================================================

    if (
        intent ===
        "decisions"
    ) {

        const topDecision =
            assessment.recommendedActions?.[0];


        return {

            status:
                assessment.businessStatus ||
                "Healthy",

            answer:
                topDecision
                    ? `${topDecision.title}: ${topDecision.action}`
                    : "There are currently no urgent management decisions.",

            assessment,

            decisions,

            risks

        };
    }


    // ========================================================
    // CASH
    // ========================================================

    if (
        intent ===
        "cash"
    ) {

        return {

            status:
                assessment.businessStatus ||
                "Healthy",

            answer:
                context.intelligence.cash?.cashTrend
                    ? `Current cash is approximately ₦${Math.round(
                        Number(
                            context.intelligence.cash.currentCash
                        ) || 0
                    ).toLocaleString()}. Cash trend is ${safeText(
                        context.intelligence.cash.cashTrend
                    ).toLowerCase()}.`
                    : "Current cash intelligence is available for review.",

            assessment,

            decisions,

            risks

        };
    }


    // ========================================================
    // REVENUE
    // ========================================================

    if (
        intent ===
        "revenue"
    ) {

        const revenue =
            context.intelligence.revenue ||
            {};


        const tomorrow =
            Number(
                revenue.tomorrow
            ) || 0;


        const trend =
            safeText(
                revenue.trend
            ) ||
            "Unknown";


        return {

            status:
                assessment.businessStatus ||
                "Healthy",

            answer:
                `The next forecast day is approximately ₦${Math.round(
                    tomorrow
                ).toLocaleString()}. Current revenue trend is ${trend.toLowerCase()}.`,

            assessment,

            decisions,

            risks

        };
    }


    // ========================================================
    // PROFIT
    // ========================================================

    if (
        intent ===
        "profit"
    ) {

        const profit =
            context.intelligence.profit ||
            {};


        const tomorrowProfit =
            Number(
                profit.tomorrowProfit
            ) || 0;


        const margin =
            Number(
                profit.tomorrowProfitMargin
            ) || 0;


        return {

            status:
                assessment.businessStatus ||
                "Healthy",

            answer:
                `The next forecast day is expected to generate approximately ₦${Math.round(
                    tomorrowProfit
                ).toLocaleString()} in profit, with a net profit margin of approximately ${margin.toFixed(
                    1
                )}%.`,

            assessment,

            decisions,

            risks

        };
    }


    // ========================================================
    // INVENTORY
    // ========================================================

    if (
        intent ===
        "inventory"
    ) {

        const inventory =
            context.intelligence.inventory ||
            {};


        return {

            status:
                assessment.businessStatus ||
                "Healthy",

            answer:
                inventory.restockUrgency
                    ? `Current inventory restocking urgency is ${safeText(
                        inventory.restockUrgency
                    ).toLowerCase()}.`
                    : "Current inventory does not indicate a known restocking urgency.",

            assessment,

            decisions,

            risks

        };
    }


    // ========================================================
    // HELP
    // ========================================================

    if (
        intent ===
        "help"
    ) {

        return {

            status:
                "Info",

            answer:
                "You can ask me about your business overview, sales, cash flow, profit, inventory, risks, decisions, or future scenarios.",

            assessment,

            decisions: [],

            risks: []

        };
    }


    // ========================================================
    // UNKNOWN
    // ========================================================

    return {

        status:
            assessment.businessStatus ||
            "Healthy",

        answer:
            assessment.headline ||
            assessment.assessment ||
            "I can help you understand your business performance, risks, decisions, and scenarios.",

        assessment,

        decisions,

        risks

    };
}


// ============================================================
// MAIN ADVISOR SERVICE
// ============================================================

async function getAdvisorResponse(
    question,
    intelligence
) {

    const context =
        buildAdvisorContext(
            question,
            intelligence
        );


    const response =
        buildAdvisorResponse(
            context
        );


    return {

        question:
            context.question,

        intent:
            context.intent,

        response,

        context

    };
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getAdvisorResponse,

    buildAdvisorContext,

    buildAdvisorResponse,

    buildAdvisorScenario,

    buildScenarioOptions,

    extractScenarioChange,

    determineScenarioType,

    findRelevantRisks,

    findRelevantDecisions,

    normalizeIntelligence,

    safeText

};