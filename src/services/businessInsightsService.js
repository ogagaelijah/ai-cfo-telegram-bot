const {
    getBusinessTrends
} = require("./businessTrendsService");

// ==========================
// BUSINESS INSIGHTS
// ==========================
function getBusinessInsights(telegramId) {

    const trends =
        getBusinessTrends(telegramId);

    const insights = [];

    // ==========================
    // DAILY
    // ==========================
    if (trends.daily.growth > 0) {

        insights.push(
            `📈 Today's sales increased by ${trends.daily.growth.toFixed(1)}% compared to yesterday.`
        );

    } else if (trends.daily.growth < 0) {

        insights.push(
            `📉 Today's sales decreased by ${Math.abs(trends.daily.growth).toFixed(1)}% compared to yesterday.`
        );

    } else {

        insights.push(
            "➖ Today's sales remained unchanged."
        );

    }

    // ==========================
    // WEEKLY
    // ==========================
    if (trends.weekly.growth > 0) {

        insights.push(
            `📊 Weekly sales increased by ${trends.weekly.growth.toFixed(1)}%.`
        );

    } else if (trends.weekly.growth < 0) {

        insights.push(
            `📊 Weekly sales declined by ${Math.abs(trends.weekly.growth).toFixed(1)}%.`
        );

    }

    // ==========================
    // MONTHLY
    // ==========================
    if (trends.monthly.growth > 0) {

        insights.push(
            `🚀 Monthly sales increased by ${trends.monthly.growth.toFixed(1)}%.`
        );

    } else if (trends.monthly.growth < 0) {

        insights.push(
            `⚠️ Monthly sales declined by ${Math.abs(trends.monthly.growth).toFixed(1)}%.`
        );

    }

    return {

        summary:
            insights.join("\n"),

        insights

    };

}

module.exports = {

    getBusinessInsights

};