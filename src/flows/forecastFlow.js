const keyboard = require("../keyboards/mainKeyboard");

const {
    getBusinessForecast
} = require("../services/financialAnalyticsService");

module.exports = async function forecastFlow(ctx) {

    const forecast =
        getBusinessForecast(ctx.from.id);


    // ==========================
    // REVENUE
    // ==========================

    const revenue =
        forecast.revenue || {};

    const averageDailyRevenue =
        Number(
            revenue.averageDailySales
        ) || 0;

    const tomorrowRevenue =
        Number(
            revenue.tomorrow
        ) || 0;

    const next7DaysRevenue =
        Number(
            revenue.next7Days
        ) || 0;

    const next30DaysRevenue =
        Number(
            revenue.next30Days
        ) || 0;

    const growthRate =
        Number(
            revenue.growthRate
        ) || 0;

    const revenueTrend =
        revenue.trend || "No Data";

    const confidence =
        Number(
            revenue.confidence
        ) || 0;


    // ==========================
    // CASH
    // ==========================

    const cash =
        forecast.cash || {};

    const currentCash =
        Number(
            cash.currentCash
        ) || 0;

    const projected7DaysCash =
        Number(
            cash.next7Days
        ) || 0;

    const projected30DaysCash =
        Number(
            cash.next30Days
        ) || 0;

    const cashStatus =
        cash.status || "Unknown";


    // ==========================
    // PROFIT
    // ==========================

    const profit =
        forecast.profit || {};

    const netProfitMargin =
        Number(
            profit.netProfitMargin
        ) || 0;

    const grossMargin =
        Number(
            profit.grossMargin
        ) || 0;

    const tomorrowNetProfit =
        Number(
            profit.estimatedTomorrowNetProfit
        ) || 0;

    const next7DaysNetProfit =
        Number(
            profit.estimatedNext7DaysNetProfit
        ) || 0;

    const next30DaysNetProfit =
        Number(
            profit.estimatedNext30DaysNetProfit
        ) || 0;

    const tomorrowGrossProfit =
        Number(
            profit.estimatedTomorrowGrossProfit
        ) || 0;

    const next7DaysGrossProfit =
        Number(
            profit.estimatedNext7DaysGrossProfit
        ) || 0;

    const next30DaysGrossProfit =
        Number(
            profit.estimatedNext30DaysGrossProfit
        ) || 0;

    const profitOutlook =
        profit.status || "Unknown";


    // ==========================
    // INVENTORY
    // ==========================

    const inventory =
        forecast.inventory || {};

    const products =
        Number(
            inventory.totalItems
        ) || 0;

    const lowStock =
        Number(
            inventory.lowStockItems
        ) || 0;

    const outOfStock =
        Number(
            inventory.outOfStockItems
        ) || 0;

    const restockUrgency =
        inventory.restockUrgency || "Unknown";

    const estimatedStockout =
        inventory.estimatedStockoutDays || 0;


    // ==========================
    // RISKS
    // ==========================

    const risks =
        Array.isArray(forecast.risks)
            ? forecast.risks
            : [];

    const riskText =
        risks.length > 0
            ? risks
                .map(
                    risk =>
                        `• ${
                            typeof risk === "string"
                                ? risk
                                : risk.message ||
                                  risk.description ||
                                  JSON.stringify(risk)
                        }`
                )
                .join("\n")
            : "• No major business risks detected.";


    // ==========================
    // TREND DISPLAY
    // ==========================

    let trendDisplay =
        "📊 Stable";

    if (
        revenueTrend === "Growing"
    ) {

        trendDisplay =
            "📈 Growing";

    } else if (
        revenueTrend === "Declining"
    ) {

        trendDisplay =
            "📉 Declining";

    } else if (
        revenueTrend === "Insufficient Data"
    ) {

        trendDisplay =
            "📊 Insufficient Data";

    } else if (
        revenueTrend === "No Data"
    ) {

        trendDisplay =
            "⚪ No Data";

    }


    // ==========================
    // CASH OUTLOOK
    // ==========================

    const cashOutlook =
        projected30DaysCash > 0
            ? "positive"
            : "critical";


    // ==========================
    // SEND FORECAST
    // ==========================

    await ctx.reply(

`🔮 AI CFO BUSINESS FORECAST

━━━━━━━━━━━━━━━━━━

📈 REVENUE FORECAST

Average Daily Revenue

₦${averageDailyRevenue.toLocaleString()}

Tomorrow

₦${tomorrowRevenue.toLocaleString()}

Next 7 Days

₦${next7DaysRevenue.toLocaleString()}

Next 30 Days

₦${next30DaysRevenue.toLocaleString()}

Growth Rate

${growthRate.toFixed(2)}%

Trend

${trendDisplay}

Confidence

${confidence}%

━━━━━━━━━━━━━━━━━━

💰 CASH FORECAST

Current Cash

₦${currentCash.toLocaleString()}

Projected 7 Days

₦${projected7DaysCash.toLocaleString()}

Projected 30 Days

₦${projected30DaysCash.toLocaleString()}

Cash Status

${cashStatus}

━━━━━━━━━━━━━━━━━━

🏆 PROFIT FORECAST

Net Profit Margin

${netProfitMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

Estimated Net Profit

Tomorrow

₦${tomorrowNetProfit.toLocaleString()}

Next 7 Days

₦${next7DaysNetProfit.toLocaleString()}

Next 30 Days

₦${next30DaysNetProfit.toLocaleString()}

━━━━━━━━━━━━━━━━━━

Gross Margin

${grossMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

Estimated Gross Profit

Tomorrow

₦${tomorrowGrossProfit.toLocaleString()}

Next 7 Days

₦${next7DaysGrossProfit.toLocaleString()}

Next 30 Days

₦${next30DaysGrossProfit.toLocaleString()}

━━━━━━━━━━━━━━━━━━

Profit Outlook

${profitOutlook}

━━━━━━━━━━━━━━━━━━

📦 INVENTORY FORECAST

Products

${products}

Low Stock

${lowStock}

Out of Stock

${outOfStock}

Restock Urgency

${restockUrgency}

Estimated Stockout

${estimatedStockout} day(s)

━━━━━━━━━━━━━━━━━━

🚨 BUSINESS RISKS

${riskText}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO FORECAST

${
    cashOutlook === "critical"
        ? "⚠️ Cash flow requires immediate attention. Review expenses, receivables and upcoming obligations."
        : "✅ Current projections indicate a positive cash position over the next month."
}

These projections are based on your recent business activity and will become more accurate as more transactions are recorded.

Keep recording your transactions consistently.`,

        keyboard

    );

};