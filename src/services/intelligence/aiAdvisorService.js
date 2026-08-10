// ============================================================
// AI CFO ADVISOR SERVICE V2
// ============================================================
//
// PLATFORM-LEVEL AI ADVISOR
//
// Responsibilities:
//
// 1. Receive structured CFO intelligence.
// 2. Understand the user's business question.
// 3. Identify relevant risks.
// 4. Identify relevant decisions.
// 5. Identify relevant forecasts.
// 6. Detect scenario questions.
// 7. Extract scenario direction and percentage.
// 8. Run deterministic scenario analysis.
// 9. Prepare structured context for an AI model.
// 10. Return a platform-independent advisor response.
//
// IMPORTANT:
//
// This service does NOT calculate:
// - Revenue
// - Cash
// - Profit
// - Inventory
// - Risks
// - Decisions
//
// Those responsibilities belong to the existing
// forecasting and intelligence engines.
//
// Scenario calculations are delegated to scenarioEngine.
//
// ============================================================

const {
    getAdvisorIntent
} = require("./advisorIntentService");

const {
    buildScenario
} = require("./scenarioEngine");

// ============================================================
// SAFE TEXT
// ============================================================

function safeText(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value).trim();
}

// ============================================================
// NORMALIZE FORECAST
// ============================================================

function normalizeForecast(forecast) {

    const data =
        forecast || {};

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
            Array.isArray(data.expenseHistory)
                ? data.expenseHistory
                : [],

        risks:
            Array.isArray(data.risks)
                ? data.risks
                : [],

        decisions:
            Array.isArray(data.decisions)
                ? data.decisions
                : [],

        executiveSummary:
            data.executiveSummary || {}

    };
}

// ============================================================
// FIND RELEVANT RISKS
// ============================================================

function findRelevantRisks(
    risks,
    question
) {

    if (!Array.isArray(risks)) {
        return [];
    }

    const text =
        safeText(
            question
        ).toLowerCase();

    if (!text) {
        return risks.slice(0, 5);
    }

    const keywords = [

        "cash",
        "liquidity",
        "money",
        "revenue",
        "sales",
        "profit",
        "margin",
        "expense",
        "expenses",
        "inventory",
        "stock",
        "restock",
        "product",
        "risk"

    ];

    const matched =
        risks.filter(
            risk => {

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

                return keywords.some(
                    keyword =>
                        text.includes(keyword) &&
                        riskText.includes(keyword)
                );
            }
        );

    return matched.length > 0
        ? matched.slice(0, 5)
        : risks.slice(0, 5);
}

// ============================================================
// FIND RELEVANT DECISIONS
// ============================================================

function findRelevantDecisions(
    decisions,
    question
) {

    if (!Array.isArray(decisions)) {
        return [];
    }

    const text =
        safeText(
            question
        ).toLowerCase();

    if (!text) {
        return decisions.slice(0, 5);
    }

    const matched =
        decisions.filter(
            decision => {

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

                const words =
                    text.split(
                        /\s+/
                    );

                return words.some(
                    word => {

                        if (
                            word.length < 4
                        ) {
                            return false;
                        }

                        return decisionText.includes(
                            word
                        );
                    }
                );
            }
        );

    return matched.length > 0
        ? matched.slice(0, 5)
        : decisions.slice(0, 5);
}

// ============================================================
// EXTRACT SCENARIO DIRECTION
// ============================================================
//
// Examples:
//
// "sales fall 20%"
// "sales drop 15%"
// "revenue decreases by 10%"
// "revenue increase 25%"
// "expenses increase 20%"
// "expenses decrease by 15%"
//
// Returns:
//
// {
//     direction: "decrease",
//     percentage: 20
// }
//
// ============================================================

function extractScenarioChange(question) {

    const text =
        safeText(
            question
        ).toLowerCase();

    if (!text) {
        return null;
    }

    const percentageMatch =
        text.match(
            /(-?\d+(?:\.\d+)?)\s*%/
        );

    if (!percentageMatch) {
        return null;
    }

    const percentage =
        Math.abs(
            Number(
                percentageMatch[1]
            )
        );

    if (!Number.isFinite(percentage)) {
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
        "down",
        "negative"

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
        "up",
        "positive"

    ];

    const hasDecrease =
        decreaseWords.some(
            word =>
                text.includes(word)
        );

    const hasIncrease =
        increaseWords.some(
            word =>
                text.includes(word)
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

function determineScenarioType(question) {

    const text =
        safeText(
            question
        ).toLowerCase();

    if (!text) {
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
                text.includes(word)
        );

    const hasRevenue =
        revenueWords.some(
            word =>
                text.includes(word)
        );

    if (hasExpense) {
        return "expense";
    }

    if (hasRevenue) {
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
// BUILD ADVISOR CONTEXT
// ============================================================

function buildAdvisorContext(
    forecast,
    question
) {

    const data =
        normalizeForecast(
            forecast
        );

    const intent =
        getAdvisorIntent(
            question
        );

    const scenarioOptions =
        buildScenarioOptions(
            question
        );

    let scenario =
        null;

    if (
        intent?.intent === "scenario" &&
        scenarioOptions
    ) {

        scenario =
            buildScenario(
                {
                    revenue:
                        data.revenue,

                    cash:
                        data.cash,

                    profit:
                        data.profit,

                    inventory:
                        data.inventory,

                    inventoryDemand:
                        data.inventoryDemand,

                    expenseHistory:
                        data.expenseHistory,

                    risks:
                        data.risks,

                    decisions:
                        data.decisions,

                    executiveSummary:
                        data.executiveSummary
                },
                scenarioOptions
            );
    }

    const relevantRisks =
        findRelevantRisks(
            data.risks,
            question
        );

    const relevantDecisions =
        findRelevantDecisions(
            data.decisions,
            question
        );

    return {

        question:
            safeText(
                question
            ),

        intent,

        scenarioOptions,

        scenario,

        executiveSummary:
            data.executiveSummary,

        revenue:
            data.revenue,

        cash:
            data.cash,

        inventory:
            data.inventory,

        inventoryDemand:
            data.inventoryDemand,

        profit:
            data.profit,

        expenseHistory:
            data.expenseHistory,

        relevantRisks,

        relevantDecisions

    };
}

// ============================================================
// ADVISOR MONEY FORMAT
// ============================================================

function formatMoneyForAdvisor(
    value
) {

    const number =
        Number(value) || 0;

    return `₦${Math.round(
        number
    ).toLocaleString()}`;
}

// ============================================================
// REVENUE ANSWER
// ============================================================

function buildRevenueAnswer(
    revenue
) {

    const tomorrow =
        Number(
            revenue.tomorrow
        ) || 0;

    const trend =
        safeText(
            revenue.trend
        ) ||
        "Unknown";

    const confidence =
        Number(
            revenue.confidence
        ) || 0;

    if (
        trend ===
        "Declining"
    ) {

        return `Revenue is currently trending downward. The next forecast day is approximately ${formatMoneyForAdvisor(
            tomorrow
        )}, with forecast confidence at ${confidence}%.`;
    }

    if (
        trend ===
        "Growing"
    ) {

        return `Revenue is currently trending upward. The next forecast day is approximately ${formatMoneyForAdvisor(
            tomorrow
        )}, with forecast confidence at ${confidence}%.`;
    }

    if (
        trend ===
        "Insufficient Data"
    ) {

        return `Revenue forecasting is currently based on limited sales history. The next forecast day is approximately ${formatMoneyForAdvisor(
            tomorrow
        )}.`;
    }

    return `The next forecast day is approximately ${formatMoneyForAdvisor(
        tomorrow
    )}. Current revenue trend is ${trend.toLowerCase()}.`;
}

// ============================================================
// PROFIT ANSWER
// ============================================================

function buildProfitAnswer(
    profit
) {

    const tomorrowProfit =
        Number(
            profit.tomorrowProfit
        ) || 0;

    const margin =
        Number(
            profit.tomorrowProfitMargin
        ) || 0;

    const status =
        safeText(
            profit.status
        ) ||
        "Unknown";

    if (
        tomorrowProfit < 0 ||
        status ===
        "Loss"
    ) {

        return `The business is currently forecast to lose approximately ${formatMoneyForAdvisor(
            Math.abs(
                tomorrowProfit
            )
        )} on the next forecast day. Net profit margin is approximately ${margin.toFixed(
            1
        )}%.`;
    }

    if (
        status ===
        "Break-even"
    ) {

        return "The business is currently forecast to break even. There is limited protection against unexpected costs or weaker sales.";
    }

    return `The next forecast day is expected to generate approximately ${formatMoneyForAdvisor(
        tomorrowProfit
    )} in profit, with a net profit margin of approximately ${margin.toFixed(
        1
    )}%.`;
}

// ============================================================
// CASH ANSWER
// ============================================================

function buildCashAnswer(
    cash
) {

    const currentCash =
        Number(
            cash?.currentCash
        ) || 0;

    const next7Days =
        Number(
            cash?.next7Days
        ) || 0;

    const next30Days =
        Number(
            cash?.next30Days
        ) || 0;

    const trend =
        safeText(
            cash?.cashTrend
        ) ||
        "Unknown";

    if (
        next7Days < 0
    ) {

        return `Cash is projected to become negative within seven days. Current cash is approximately ${formatMoneyForAdvisor(
            currentCash
        )}.`;
    }

    if (
        next30Days < 0
    ) {

        return `Cash is currently positive over the next seven days but is projected to become negative within thirty days. Current cash is approximately ${formatMoneyForAdvisor(
            currentCash
        )}.`;
    }

    return `Current cash is approximately ${formatMoneyForAdvisor(
        currentCash
    )}. Projected cash over the next seven days is approximately ${formatMoneyForAdvisor(
        next7Days
    )}, and approximately ${formatMoneyForAdvisor(
        next30Days
    )} over the next thirty days. Cash trend is ${trend.toLowerCase()}.`;
}

// ============================================================
// INVENTORY ANSWER
// ============================================================

function buildInventoryAnswer(
    inventoryDemand,
    inventory
) {

    const products =
        Array.isArray(
            inventoryDemand?.products
        )
            ? inventoryDemand.products
            : [];

    const urgent =
        products.filter(
            product =>
                product?.reorderRecommendation ===
                "Urgent"
        );

    const immediate =
        products.filter(
            product =>
                product?.reorderRecommendation ===
                "Reorder Immediately"
        );

    const soon =
        products.filter(
            product =>
                product?.reorderRecommendation ===
                "Reorder Soon"
        );

    if (
        urgent.length > 0
    ) {

        return `Immediate restocking is recommended for ${urgent
            .map(
                product =>
                    product.productName
            )
            .join(
                ", "
            )}.`;
    }

    if (
        immediate.length > 0
    ) {

        return `The following products require immediate restocking: ${immediate
            .map(
                product =>
                    product.productName
            )
            .join(
                ", "
            )}.`;
    }

    if (
        soon.length > 0
    ) {

        return `The following products should be restocked soon: ${soon
            .map(
                product =>
                    product.productName
            )
            .join(
                ", "
            )}.`;
    }

    if (
        inventory?.restockUrgency ===
        "Critical"
    ) {

        return "Inventory is currently at critical restocking levels. Review stockouts immediately.";
    }

    if (
        inventory?.restockUrgency ===
        "High"
    ) {

        return "Several products are approaching low-stock levels. Prepare replenishment orders soon.";
    }

    return "Current inventory levels do not indicate an immediate restocking requirement.";
}

// ============================================================
// BUILD SCENARIO ANSWER
// ============================================================

function buildScenarioAnswer(
    scenario
) {

    if (!scenario) {

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

        const absolutePercentage =
            Math.abs(
                percentage
            );

        const directionText =
            direction === "decrease"
                ? "decrease"
                : "increase";

        const answer =
            `If revenue were to ${directionText} by ${absolutePercentage}%, the next forecast day would change from approximately ${formatMoneyForAdvisor(
                baseline
            )} to ${formatMoneyForAdvisor(
                projected
            )}. Projected cash over the next seven days would be approximately ${formatMoneyForAdvisor(
                cash7
            )}. ${scenario.impact}`;

        return {

            status:
                scenario.status ||
                "Monitor",

            answer,

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

        const answer =
            direction === "decrease"
                ? `If expenses were to decrease by ${Math.abs(
                    percentage
                )}%, total expenses represented by the available history would change from approximately ${formatMoneyForAdvisor(
                    baseline
                )} to ${formatMoneyForAdvisor(
                    projected
                )}. That would save approximately ${formatMoneyForAdvisor(
                    Math.abs(
                        additionalExpenses
                    )
                )} in expenses.`
                : `If expenses were to increase by ${Math.abs(
                    percentage
                )}%, total expenses represented by the available history would change from approximately ${formatMoneyForAdvisor(
                    baseline
                )} to ${formatMoneyForAdvisor(
                    projected
                )}. That would add approximately ${formatMoneyForAdvisor(
                    Math.abs(
                        additionalExpenses
                    )
                )} in expenses.`;

        return {

            status:
                scenario.status ||
                "Monitor",

            answer,

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
// BUILD FALLBACK RESPONSE
// ============================================================

function buildFallbackResponse(
    context
) {

    const summary =
        context.executiveSummary ||
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

        return buildScenarioAnswer(
            context.scenario
        );
    }

    // ========================================================
    // NO INTELLIGENCE AVAILABLE
    // ========================================================

    if (
        decisions.length === 0 &&
        risks.length === 0
    ) {

        return {

            status:
                summary.status ||
                "Healthy",

            answer:
                "There are currently no significant business conditions requiring attention.",

            decisions: [],

            risks: []

        };
    }

    // ========================================================
    // OVERVIEW
    // ========================================================

    if (
        intent ===
        "overview"
    ) {

        return {

            status:
                summary.status ||
                "Monitor",

            answer:
                summary.headline ||
                "Here is the current business outlook.",

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
                summary.status ||
                "Monitor",

            answer:
                risks.length > 0
                    ? `There are ${risks.length} business risk(s) that currently require attention.`
                    : "No significant risks are currently identified.",

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
            decisions[0];

        return {

            status:
                summary.status ||
                "Monitor",

            answer:
                topDecision
                    ? `${topDecision.title}: ${topDecision.decision}`
                    : "There are currently no urgent management decisions.",

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

        const cash =
            context.cash ||
            {};

        const cashRisk =
            risks.find(
                risk =>
                    risk.category ===
                    "Liquidity"
            );

        return {

            status:
                summary.status ||
                "Monitor",

            answer:
                cashRisk
                    ? cashRisk.message
                    : buildCashAnswer(
                        cash
                    ),

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
            context.revenue ||
            {};

        return {

            status:
                summary.status ||
                "Monitor",

            answer:
                buildRevenueAnswer(
                    revenue
                ),

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
            context.profit ||
            {};

        return {

            status:
                summary.status ||
                "Monitor",

            answer:
                buildProfitAnswer(
                    profit
                ),

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

        return {

            status:
                summary.status ||
                "Monitor",

            answer:
                buildInventoryAnswer(
                    context.inventoryDemand,
                    context.inventory
                ),

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
                "You can ask me about your business overview, sales, cash flow, profit, inventory, risks, decisions or future scenarios.",

            decisions: [],

            risks: []

        };
    }

    // ========================================================
    // UNKNOWN
    // ========================================================

    const topDecision =
        decisions[0];

    return {

        status:
            summary.status ||
            "Monitor",

        answer:
            topDecision
                ? `${topDecision.title}: ${topDecision.decision}`
                : (
                    risks[0]?.message ||
                    "The business has conditions that should be monitored."
                ),

        decisions,

        risks

    };
}

// ============================================================
// AI RESPONSE PLACEHOLDER
// ============================================================
//
// The deterministic fallback remains the source of truth
// until the AI model is connected.
//
// This function intentionally does not call an external
// provider yet.
//
// ============================================================

async function generateAIResponse(
    context
) {

    return buildFallbackResponse(
        context
    );
}

// ============================================================
// MAIN ADVISOR
// ============================================================

async function getAdvisorResponse(
    question,
    forecast
) {

    const context =
        buildAdvisorContext(
            forecast,
            question
        );

    const response =
        await generateAIResponse(
            context
        );

    return {

        question:
            context.question,

        context,

        response

    };
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getAdvisorResponse,

    buildAdvisorContext,

    buildFallbackResponse,

    findRelevantRisks,

    findRelevantDecisions,

    formatMoneyForAdvisor,

    buildRevenueAnswer,

    buildProfitAnswer,

    buildCashAnswer,

    buildInventoryAnswer,

    buildScenarioAnswer,

    extractScenarioChange,

    determineScenarioType,

    buildScenarioOptions,

    generateAIResponse

};