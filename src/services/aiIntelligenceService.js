const decisionEngine =
    require("./decisionEngine");

// ==========================
// AI CFO INTELLIGENCE
// ==========================
function buildIntelligence(
    telegramId,
    topic = null
) {

    const decision =
        decisionEngine.generateDecision(
            telegramId,
            topic
        );

    return {

        priority:
            decision.priority,

        urgency:
            decision.urgency,

        explanation:
            decision.explanation,

        recommendation:
            decision.recommendation,

        forecast: {

            projectedRevenue:
                decision.projectedRevenue,

            projectedProfit:
                decision.projectedProfit,

            confidence:
                decision.confidence

        }

    };

}

module.exports = {

    buildIntelligence

};