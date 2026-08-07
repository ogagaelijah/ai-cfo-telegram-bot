const analytics = require("./financialAnalyticsService");
const trends = require("./businessTrendsService");
const insights = require("./businessInsightsService");
const recommendations = require("./businessRecommendationService");

// ==========================
// BUILD ANALYTICS DASHBOARD
// ==========================
function buildAnalyticsDashboard(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    const cash =
        analytics.getCashMetrics(telegramId);

    const health =
        analytics.getBusinessHealth(telegramId);

    const trend =
        trends.getBusinessTrends(telegramId);

    const insight =
        insights.getBusinessInsights(telegramId);

    const recommendation =
        recommendations.getBusinessRecommendations(telegramId);

    // ==========================
    // SAFE VALUES
    // ==========================
    const revenueTrend =
        trend?.revenueTrend || "Stable";

    const profitTrend =
        trend?.profitTrend || "Stable";

    const cashTrend =
        trend?.cashTrend || "Stable";

    const customerTrend =
        trend?.customerTrend || "Stable";

    // ==========================
    // AI INSIGHT
    // ==========================
    let topInsight = "No major insights available.";

    if (Array.isArray(insight) && insight.length > 0) {
        topInsight = insight[0];
    } else if (typeof insight === "string") {
        topInsight = insight;
    }

    // ==========================
    // AI RECOMMENDATION
    // ==========================
    let topRecommendation =
        "Keep recording transactions consistently.";

    if (Array.isArray(recommendation) && recommendation.length > 0) {

        if (typeof recommendation[0] === "string") {

            topRecommendation = recommendation[0];

        } else if (
            recommendation[0] &&
            recommendation[0].message
        ) {

            topRecommendation = recommendation[0].message;

        }

    }

    return `📈 BUSINESS ANALYTICS

━━━━━━━━━━━━━━━━━━

📊 Revenue

₦${snapshot.sales.toLocaleString()}

Trend

${revenueTrend}

━━━━━━━━━━━━━━━━━━

🏆 Net Profit

₦${snapshot.netProfit.toLocaleString()}

Trend

${profitTrend}

━━━━━━━━━━━━━━━━━━

💵 Cash Position

₦${cash.cashPosition.toLocaleString()}

Trend

${cashTrend}

━━━━━━━━━━━━━━━━━━

📊 Gross Margin

${snapshot.grossMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

🤖 Business Health

${health.status}

⭐ Score

${health.score}/100

━━━━━━━━━━━━━━━━━━

👥 Customer Growth

${customerTrend}

━━━━━━━━━━━━━━━━━━

🧠 AI Insight

${topInsight}

━━━━━━━━━━━━━━━━━━

🎯 AI Recommendation

${topRecommendation}

━━━━━━━━━━━━━━━━━━

📅 Generated

${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━

📈 Analytics help you identify trends before they become problems.`;

}

module.exports = {
    buildAnalyticsDashboard
};