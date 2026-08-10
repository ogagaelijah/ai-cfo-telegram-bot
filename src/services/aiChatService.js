const aiIntelligence =
    require("./aiIntelligenceService");

const conversation =
    require("./aiConversationService");

const advisorIntent =
    require("./intelligence/advisorIntentService");

// ============================================================
// MAP ADVISOR INTENT TO INTELLIGENCE TOPIC
// ============================================================

function mapIntentToTopic(intent) {

    switch (intent) {

        case advisorIntent.INTENTS.CASH:
            return "cash";

        case advisorIntent.INTENTS.REVENUE:
            return "revenue";

        case advisorIntent.INTENTS.PROFIT:
            return "profit";

        case advisorIntent.INTENTS.INVENTORY:
            return "inventory";

        case advisorIntent.INTENTS.RISKS:
            return "risk";

        case advisorIntent.INTENTS.DECISIONS:
            return "priority";

        case advisorIntent.INTENTS.OVERVIEW:
            return "overview";

        case advisorIntent.INTENTS.SCENARIO:
            return "scenario";

        case advisorIntent.INTENTS.HELP:
            return "help";

        default:
            return null;
    }
}

// ============================================================
// DETECT TOPIC
// ============================================================

function detectTopic(text) {

    const result =
        advisorIntent.getAdvisorIntent(
            text
        );

    return mapIntentToTopic(
        result.intent
    );
}

// ============================================================
// FOLLOW-UP DETECTION
// ============================================================

function isFollowUp(text) {

    const question =
        String(text || "")
            .toLowerCase()
            .trim()
            .replace(/\s+/g, " ");

    const followUps = [

        "why",
        "why?",

        "how",
        "how?",

        "explain",
        "explain more",

        "tell me more",

        "what do you mean",
        "what do you mean?",

        "what about it",
        "what about it?",

        "how can i fix it",
        "how can i fix this",

        "how do i fix it",
        "how do i fix this",

        "what should i do",
        "what should i do?",

        "what can i do",
        "what can i do?",

        "can you explain",
        "can you explain more"
    ];

    return followUps.includes(
        question
    );
}

// ============================================================
// ACTIVE CONVERSATION
// ============================================================

function hasActiveConversation(
    telegramId
) {

    return Boolean(
        conversation.getCurrentTopic(
            telegramId
        )
    );
}

// ============================================================
// FORECAST HELPERS
// ============================================================

function getProjectedRevenue(
    intelligence
) {

    const forecast =
        intelligence?.forecast || {};

    const values = [

        forecast.projectedRevenue,

        forecast.tomorrowRevenue,

        forecast.tomorrow,

        forecast.averageDailySales
    ];

    for (
        const value of values
    ) {

        const number =
            Number(value);

        if (
            Number.isFinite(number) &&
            number > 0
        ) {

            return number;
        }
    }

    return 0;
}

function getProjectedProfit(
    intelligence
) {

    const forecast =
        intelligence?.forecast || {};

    const values = [

        forecast.projectedProfit,

        forecast.tomorrowNetProfit,

        forecast.tomorrowProfit
    ];

    for (
        const value of values
    ) {

        const number =
            Number(value);

        if (
            Number.isFinite(number)
        ) {

            return number;
        }
    }

    return 0;
}

// ============================================================
// RESPONSE BUILDER
// ============================================================

function buildResponse(
    topic,
    intelligence
) {

    const headers = {

        cash:
            "💵 CASH FLOW",

        profit:
            "🏆 PROFIT",

        revenue:
            "📈 REVENUE",

        inventory:
            "📦 INVENTORY",

        risk:
            "⚠️ BUSINESS RISK",

        priority:
            "🎯 TODAY'S PRIORITY",

        overview:
            "🤖 AI CFO — BUSINESS OVERVIEW",

        scenario:
            "🔮 BUSINESS SCENARIO"
    };

    const header =
        headers[topic] ||
        "🤖 AI CFO";

    let output =
        `${header}\n\n`;

    // ========================================================
    // REVENUE
    // ========================================================

    if (
        topic === "revenue"
    ) {

        output +=
            `Projected Revenue\n\n` +
            `₦${Math.round(
                getProjectedRevenue(
                    intelligence
                )
            ).toLocaleString()}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // ========================================================
    // PROFIT
    // ========================================================

    if (
        topic === "profit"
    ) {

        output +=
            `Projected Profit\n\n` +
            `₦${Math.round(
                getProjectedProfit(
                    intelligence
                )
            ).toLocaleString()}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // ========================================================
    // PRIORITY
    // ========================================================

    if (
        topic === "priority"
    ) {

        output +=
            `${intelligence.priority}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // ========================================================
    // SCENARIO
    // ========================================================

    if (
        topic === "scenario"
    ) {

        output +=
            `Scenario\n\n` +
            `${intelligence.scenarioQuestion || ""}\n\n` +
            `━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // ========================================================
    // AI ANALYSIS
    // ========================================================

    output +=
        `🧠 AI CFO ANALYSIS\n\n` +
        `${intelligence.explanation}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n\n`;

    // ========================================================
    // RECOMMENDATION
    // ========================================================

    output +=
        `🎯 RECOMMENDED ACTION\n\n` +
        `${intelligence.recommendation}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n\n`;

    // ========================================================
    // PRIORITY
    // ========================================================

    output +=
        `⚠️ PRIORITY\n\n` +
        `${intelligence.priority}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n\n`;

    // ========================================================
    // URGENCY
    // ========================================================

    output +=
        `🚦 URGENCY\n\n` +
        `${intelligence.urgency}`;

    return output;
}

// ============================================================
// HELP RESPONSE
// ============================================================

function buildHelpResponse() {

    return `🤖 AI CFO

I can currently help you understand:

• Business overview
• Cash flow
• Revenue
• Profit
• Inventory
• Business risks
• Business priorities
• Business scenarios

Try asking:

"How is my business doing?"

"How are my sales?"

"What is happening with my cash?"

"Am I making money?"

"What should I restock?"

"What should I worry about?"

"What should I do today?"

"What happens if sales fall 20%?"`;
}

// ============================================================
// FOLLOW-UP RESPONSE
// ============================================================

function buildFollowUpResponse(
    topic,
    intelligence
) {

    if (
        !topic ||
        topic === "help"
    ) {

        return buildHelpResponse();
    }

    return buildResponse(
        topic,
        intelligence
    );
}

// ============================================================
// PROCESS QUESTION
// ============================================================

async function processQuestion(
    telegramId,
    question
) {

    // ========================================================
    // STEP 1 — DETERMINE ADVISOR INTENT
    // ========================================================

    const intentResult =
        advisorIntent.getAdvisorIntent(
            question
        );

    // ========================================================
    // STEP 2 — MAP INTENT TO TOPIC
    // ========================================================

    const detectedTopic =
        mapIntentToTopic(
            intentResult.intent
        );

    // ========================================================
    // STEP 3 — FOLLOW-UP
    // ========================================================

    if (
        isFollowUp(
            question
        )
    ) {

        const currentTopic =
            conversation.getCurrentTopic(
                telegramId
            );

        // ----------------------------------------------------
        // No active conversation
        // ----------------------------------------------------

        if (
            !currentTopic
        ) {

            const answer =
                `🤖 AI CFO

I need to know what you are referring to.

You can ask about:

• Cash flow
• Profit
• Revenue
• Inventory
• Business risk
• Today's priority`;

            conversation.saveConversation(
                telegramId,
                question,
                answer
            );

            return answer;
        }

        // ----------------------------------------------------
        // Build intelligence for active topic
        // ----------------------------------------------------

        const intelligence =
            await aiIntelligence.buildIntelligence(
                telegramId,
                currentTopic
            );

        // ----------------------------------------------------
        // Build follow-up response
        // ----------------------------------------------------

        const answer =
            buildFollowUpResponse(
                currentTopic,
                intelligence
            );

        conversation.saveConversation(
            telegramId,
            question,
            answer
        );

        return answer;
    }

    // ========================================================
    // STEP 4 — SAVE NEW TOPIC
    // ========================================================

    if (
        detectedTopic
    ) {

        conversation.setTopic(
            telegramId,
            detectedTopic
        );
    }

    // ========================================================
    // STEP 5 — ACTIVE TOPIC
    // ========================================================

    const activeTopic =
        detectedTopic ||
        conversation.getCurrentTopic(
            telegramId
        );

    // ========================================================
    // STEP 6 — UNKNOWN / HELP
    // ========================================================

    if (
        !activeTopic ||
        activeTopic === "help"
    ) {

        const answer =
            buildHelpResponse();

        conversation.saveConversation(
            telegramId,
            question,
            answer
        );

        return answer;
    }

    // ========================================================
    // STEP 7 — BUILD INTELLIGENCE
    // ========================================================

    const intelligence =
        await aiIntelligence.buildIntelligence(
            telegramId,
            activeTopic
        );

    // ========================================================
    // STEP 8 — SCENARIO QUESTION
    // ========================================================

    if (
        activeTopic === "scenario"
    ) {

        intelligence.scenarioQuestion =
            question;
    }

    // ========================================================
    // STEP 9 — BUILD RESPONSE
    // ========================================================

    const answer =
        buildResponse(
            activeTopic,
            intelligence
        );

    // ========================================================
    // STEP 10 — SAVE CONVERSATION
    // ========================================================

    conversation.saveConversation(
        telegramId,
        question,
        answer
    );

    return answer;
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {

    processQuestion,

    hasActiveConversation,

    isFollowUp,

    detectTopic,

    mapIntentToTopic,

    buildResponse,

    buildHelpResponse
};