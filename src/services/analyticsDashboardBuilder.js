const analytics = require("./financialAnalyticsService");
const trends = require("./businessTrendsService");
const insights = require("./businessInsightsService");
const aiIntelligence = require("./aiIntelligenceService");

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

    // ==========================
    // AI CFO INTELLIGENCE
    // ==========================
    const intelligence =
        aiIntelligence.buildIntelligence(telegramId);

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
    let topInsight =
        "No major insights available.";

    if (Array.isArray(insight) && insight.length > 0) {

        topInsight =
            insight[0];

    } else if (typeof insight === "string") {

        topInsight =
            insight;

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

🎯 Management Priority

${intelligence.priority}

━━━━━━━━━━━━━━━━━━

⚠️ Urgency

${intelligence.urgency}

━━━━━━━━━━━━━━━━━━

🧠 AI Decision

${intelligence.explanation}

━━━━━━━━━━━━━━━━━━

✅ Recommended Action

${intelligence.recommendation}

━━━━━━━━━━━━━━━━━━

📈 Projected Revenue

₦${Math.round(intelligence.forecast.projectedRevenue).toLocaleString()}

━━━━━━━━━━━━━━━━━━

🏆 Projected Profit

₦${Math.round(intelligence.forecast.projectedProfit).toLocaleString()}

━━━━━━━━━━━━━━━━━━

🎯 Forecast Confidence

${intelligence.forecast.confidence}%

━━━━━━━━━━━━━━━━━━

📅 Generated

${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━

📈 AI CFO analyzed your business using historical trends, forecasting and decision intelligence.`;

}

module.exports = {

    buildAnalyticsDashboard

};