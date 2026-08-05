const {
    getSalesTrends
} = require("./businessTrendsService");

// ==========================
// BUSINESS INSIGHTS
// ==========================
function getBusinessInsights(telegramId) {

    const sales = getSalesTrends(telegramId);

    const insights = [];

    // ==========================
    // TODAY
    // ==========================
    if (sales.todayChange > 0) {

        insights.push(
            `📈 Today's sales increased by ${sales.todayChange.toFixed(1)}% compared to yesterday.`
        );

    } else if (sales.todayChange < 0) {

        insights.push(
            `📉 Today's sales decreased by ${Math.abs(sales.todayChange).toFixed(1)}% compared to yesterday.`
        );

    } else {

        insights.push(
            "➖ Today's sales remained unchanged."
        );

    }

    // ==========================
    // WEEK
    // ==========================
    if (sales.weekChange > 0) {

        insights.push(
            `📊 Weekly sales are up ${sales.weekChange.toFixed(1)}% compared to last week.`
        );

    } else if (sales.weekChange < 0) {

        insights.push(
            `📊 Weekly sales are down ${Math.abs(sales.weekChange).toFixed(1)}% compared to last week.`
        );

    }

    // ==========================
    // MONTH
    // ==========================
    if (sales.monthChange > 0) {

        insights.push(
            `🚀 Monthly sales increased by ${sales.monthChange.toFixed(1)}%.`
        );

    } else if (sales.monthChange < 0) {

        insights.push(
            `⚠️ Monthly sales declined by ${Math.abs(sales.monthChange).toFixed(1)}%.`
        );

    }

    return insights;

}

module.exports = {

    getBusinessInsights

};