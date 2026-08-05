const {
    getBusinessSnapshot,
    getBusinessHealth,
    getCashMetrics,
    getDebtMetrics
} = require("./financialAnalyticsService");

// ==========================
// BUSINESS RECOMMENDATIONS
// ==========================
function getBusinessRecommendations(telegramId) {

    const snapshot = getBusinessSnapshot(telegramId);
    const health = getBusinessHealth(telegramId);
    const cash = getCashMetrics(telegramId);
    const debt = getDebtMetrics(telegramId);

    const recommendations = [];

    // ==========================
    // LOW GROSS MARGIN
    // ==========================
    if (snapshot.grossMargin < 20) {

        recommendations.push(
            "💡 Review product pricing or negotiate better supplier prices to improve your gross margin."
        );

    }

    // ==========================
    // NEGATIVE CASH POSITION
    // ==========================
    if (cash.cashPosition < 0) {

        recommendations.push(
            "💰 Your cash outflow exceeds inflow. Reduce unnecessary spending and improve collections."
        );

    }

    // ==========================
    // HIGH DEBTORS
    // ==========================
    if (debt.debtors > snapshot.sales * 0.30) {

        recommendations.push(
            "📋 A large amount of money is tied up with customers. Follow up on outstanding payments."
        );

    }

    // ==========================
    // HIGH CREDITORS
    // ==========================
    if (debt.creditors > debt.debtors) {

        recommendations.push(
            "🏢 Supplier debt is higher than customer debt. Plan repayments to maintain good supplier relationships."
        );

    }

    // ==========================
    // HEALTH SCORE
    // ==========================
    if (health.score < 70) {

        recommendations.push(
            "🚨 Your overall business health needs attention. Focus on improving profitability and cash flow."
        );

    }

    // ==========================
    // DEFAULT
    // ==========================
    if (recommendations.length === 0) {

        recommendations.push(
            "✅ Business performance looks healthy. Keep recording transactions consistently."
        );

    }

    return recommendations;

}

module.exports = {

    getBusinessRecommendations

};