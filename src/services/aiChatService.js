const aiIntelligence =
    require("./aiIntelligenceService");

const conversation =
    require("./aiConversationService");


// ==========================
// DETECT TOPIC
// ==========================
function detectTopic(text) {

    const question =
        text
            .toLowerCase()
            .trim();

    // ==========================
    // CASH
    // ==========================
    if (
        question.includes("cash") ||
        question.includes("cash flow") ||
        question.includes("money")
    ) {

        return "cash";

    }


    // ==========================
    // PROFIT
    // ==========================
    if (
        question.includes("profit") ||
        question.includes("profitable") ||
        question.includes("margin")
    ) {

        return "profit";

    }


    // ==========================
    // REVENUE
    // ==========================
    if (
        question.includes("sales") ||
        question.includes("revenue") ||
        question.includes("selling")
    ) {

        return "revenue";

    }


    // ==========================
    // RISK
    // ==========================
    if (
        question.includes("risk") ||
        question.includes("danger") ||
        question.includes("problem")
    ) {

        return "risk";

    }


    // ==========================
    // PRIORITY
    // ==========================
    if (
        question.includes("focus") ||
        question.includes("priority") ||
        question.includes("should i")
    ) {

        return "priority";

    }


    return null;

}


// ==========================
// FOLLOW-UP DETECTION
// ==========================
function isFollowUp(text) {

    const question =
        text
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


    return followUps.includes(question);

}


// ==========================
// CHECK ACTIVE CONVERSATION
// ==========================
function hasActiveConversation(
    telegramId
) {

    return Boolean(
        conversation.getCurrentTopic(
            telegramId
        )
    );

}


// ==========================
// CASH RESPONSE
// ==========================
function buildCashResponse(
    intelligence
) {

    return `💵 CASH FLOW

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 RECOMMENDED ACTION

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;

}


// ==========================
// PROFIT RESPONSE
// ==========================
function buildProfitResponse(
    intelligence
) {

    return `🏆 PROFIT

Projected Profit

₦${Math.round(
        intelligence.forecast.projectedProfit
    ).toLocaleString()}

━━━━━━━━━━━━━━━━━━

🧠 AI CFO ANALYSIS

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 RECOMMENDATION

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;

}


// ==========================
// REVENUE RESPONSE
// ==========================
function buildRevenueResponse(
    intelligence
) {

    return `📈 REVENUE

Projected Revenue

₦${Math.round(
        intelligence.forecast.projectedRevenue
    ).toLocaleString()}

━━━━━━━━━━━━━━━━━━

🧠 AI CFO ANALYSIS

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 RECOMMENDATION

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;

}


// ==========================
// RISK RESPONSE
// ==========================
function buildRiskResponse(
    intelligence
) {

    return `⚠️ BUSINESS RISK

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 RECOMMENDED ACTION

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;

}


// ==========================
// PRIORITY RESPONSE
// ==========================
function buildPriorityResponse(
    intelligence
) {

    return `🎯 TODAY'S PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🧠 WHY THIS MATTERS

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

✅ RECOMMENDED ACTION

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;

}


// ==========================
// FOLLOW-UP RESPONSE
// ==========================
function buildFollowUpResponse(
    topic,
    intelligence
) {

    switch (topic) {

        // ==========================
        // CASH FOLLOW-UP
        // ==========================

        case "cash":

            return `💵 CASH FLOW — EXPLANATION

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 WHAT YOU SHOULD DO

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;


        // ==========================
        // PROFIT FOLLOW-UP
        // ==========================

        case "profit":

            return `🏆 PROFIT — EXPLANATION

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 WHAT YOU SHOULD DO

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;


        // ==========================
        // REVENUE FOLLOW-UP
        // ==========================

        case "revenue":

            return `📈 REVENUE — EXPLANATION

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 WHAT YOU SHOULD DO

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;


        // ==========================
        // RISK FOLLOW-UP
        // ==========================

        case "risk":

            return `⚠️ BUSINESS RISK — EXPLANATION

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

🎯 RECOMMENDED ACTION

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;


        // ==========================
        // PRIORITY FOLLOW-UP
        // ==========================

        case "priority":

            return `🎯 TODAY'S PRIORITY — EXPLANATION

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

✅ NEXT ACTION

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

🚦 URGENCY

${intelligence.urgency}`;


        // ==========================
        // NO TOPIC
        // ==========================

        default:

            return `🤖 AI CFO

I need a little more context.

You can ask me about:

• Cash flow
• Profit
• Revenue
• Business risk
• Today's priority`;

    }

}


// ==========================
// PROCESS QUESTION
// ==========================
function processQuestion(
    telegramId,
    question
) {

    // ==================================================
    // STEP 1 — DETECT NEW TOPIC
    // ==================================================

    const detectedTopic =
        detectTopic(question);


    // ==================================================
    // STEP 2 — CHECK FOLLOW-UP
    // ==================================================

    if (
        isFollowUp(question)
    ) {

        const currentTopic =
            conversation.getCurrentTopic(
                telegramId
            );


        // ------------------------------------------
        // FOLLOW-UP WITHOUT PREVIOUS TOPIC
        // ------------------------------------------

        if (!currentTopic) {

            const answer =
                `🤖 AI CFO

I need to know what you are referring to.

You can ask about:

• Cash flow
• Profit
• Revenue
• Business risk
• Today's priority`;


            conversation.saveConversation(
                telegramId,
                question,
                answer
            );


            return answer;

        }


        // ------------------------------------------
        // USE EXISTING TOPIC
        // ------------------------------------------

        const intelligence =
            aiIntelligence.buildIntelligence(
                telegramId,
                currentTopic
            );


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


    // ==================================================
    // STEP 3 — SAVE NEW TOPIC
    // ==================================================

    if (
        detectedTopic
    ) {

        conversation.setTopic(
            telegramId,
            detectedTopic
        );

    }


    // ==================================================
    // STEP 4 — DETERMINE ACTIVE TOPIC
    // ==================================================

    const activeTopic =
        detectedTopic ||
        conversation.getCurrentTopic(
            telegramId
        );


    // ==================================================
    // STEP 5 — NO TOPIC
    // ==================================================

    if (!activeTopic) {

        const answer =
            `🤖 AI CFO

I can currently help you understand:

• Cash flow
• Profit
• Revenue
• Business risk
• Business priorities

Try asking:

"How is my cash flow?"

or:

"How is my profit?"`;


        conversation.saveConversation(
            telegramId,
            question,
            answer
        );


        return answer;

    }


    // ==================================================
    // STEP 6 — BUILD TOPIC-SPECIFIC INTELLIGENCE
    // ==================================================

    const intelligence =
        aiIntelligence.buildIntelligence(
            telegramId,
            activeTopic
        );


    // ==================================================
    // STEP 7 — BUILD RESPONSE
    // ==================================================

    let answer;


    switch (activeTopic) {

        // ==========================
        // CASH
        // ==========================

        case "cash":

            answer =
                buildCashResponse(
                    intelligence
                );

            break;


        // ==========================
        // PROFIT
        // ==========================

        case "profit":

            answer =
                buildProfitResponse(
                    intelligence
                );

            break;


        // ==========================
        // REVENUE
        // ==========================

        case "revenue":

            answer =
                buildRevenueResponse(
                    intelligence
                );

            break;


        // ==========================
        // RISK
        // ==========================

        case "risk":

            answer =
                buildRiskResponse(
                    intelligence
                );

            break;


        // ==========================
        // PRIORITY
        // ==========================

        case "priority":

            answer =
                buildPriorityResponse(
                    intelligence
                );

            break;


        // ==========================
        // FALLBACK
        // ==========================

        default:

            answer =
                `🤖 AI CFO

I need a little more context.

You can ask me about:

• Cash flow
• Profit
• Revenue
• Business risk
• Today's priority`;

    }


    // ==================================================
    // STEP 8 — SAVE CONVERSATION
    // ==================================================

    conversation.saveConversation(
        telegramId,
        question,
        answer
    );


    return answer;

}


// ==========================
// EXPORT
// ==========================
module.exports = {

    processQuestion,

    hasActiveConversation,

    isFollowUp

};