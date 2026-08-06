const analytics = require("./financialAnalyticsService");
const insights = require("./businessInsightsService");
const alerts = require("./businessAlertService");

// ==========================
// DAILY AI CFO BRIEFING
// ==========================
function getDailyBriefing(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    const health =
        analytics.getBusinessHealth(telegramId);

    const ai =
        insights.getBusinessInsights(telegramId);

    const businessAlerts =
        alerts.getBusinessAlerts(telegramId);

    return {

        date:
            new Date().toLocaleDateString(),

        summary: {

            sales:
                snapshot.sales,

            income:
                snapshot.income,

            expenses:
                snapshot.expenses,

            netProfit:
                snapshot.netProfit,

            cashPosition:
                snapshot.cashPosition,

            healthScore:
                health.score

        },

        alerts:
            businessAlerts,

        strengths:
            ai.strengths,

        risks:
            ai.risks,

        opportunities:
            ai.opportunities,

        priorityAction:
            ai.priorityAction,

        confidence:
            ai.confidence

    };

}

module.exports = {

    getDailyBriefing

};