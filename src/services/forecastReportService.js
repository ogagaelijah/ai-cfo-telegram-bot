const { buildForecast } = require("./forecasting/forecastEngine");

// ==========================
// BUILD FORECAST REPORT
// ==========================
function buildForecastReport(userId) {

    const forecast =
        buildForecast(userId);

    const revenue =
        forecast.revenue;

    const cash =
        forecast.cash;

    const inventory =
        forecast.inventory;

    const profit =
        forecast.profit;

    const risks =
        forecast.risks;

    return `🔮 AI CFO BUSINESS FORECAST

━━━━━━━━━━━━━━━━━━

📈 REVENUE FORECAST

Average Daily Revenue

₦${Math.round(revenue.averageDailySales).toLocaleString()}

Tomorrow

₦${Math.round(revenue.tomorrow).toLocaleString()}

Next 7 Days

₦${Math.round(revenue.next7Days).toLocaleString()}

Next 30 Days

₦${Math.round(revenue.next30Days).toLocaleString()}

Growth Rate

${revenue.growthRate.toFixed(2)}%

Trend

📊 ${revenue.trend}

Confidence

${revenue.confidence}%

━━━━━━━━━━━━━━━━━━

💰 CASH FORECAST

Current Cash

₦${Math.round(cash.currentCash).toLocaleString()}

Projected 7 Days

₦${Math.round(cash.next7Days).toLocaleString()}

Projected 30 Days

₦${Math.round(cash.next30Days).toLocaleString()}

Cash Status

${cash.status}

━━━━━━━━━━━━━━━━━━

🏆 PROFIT FORECAST

Tomorrow

₦${Math.round(profit.estimatedTomorrowProfit).toLocaleString()}

Next 7 Days

₦${Math.round(profit.estimatedNext7DaysProfit).toLocaleString()}

Next 30 Days

₦${Math.round(profit.estimatedNext30DaysProfit).toLocaleString()}

Profit Outlook

${profit.status}

━━━━━━━━━━━━━━━━━━

📦 INVENTORY FORECAST

Products

${inventory.totalItems}

Low Stock

${inventory.lowStockItems}

Out of Stock

${inventory.outOfStockItems}

Restock Urgency

${inventory.restockUrgency}

Estimated Stockout

${inventory.estimatedStockoutDays} day(s)

━━━━━━━━━━━━━━━━━━

🚨 BUSINESS RISKS

${risks.map(r => `• ${r.message}`).join("\n")}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO Forecast

These projections are based on your recent business activity and will become more accurate as more data is recorded.

Keep recording your transactions consistently.`;
}

module.exports = {

    buildForecastReport

};