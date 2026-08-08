const {
    buildForecast
} = require("./forecasting/forecastEngine");


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


    // ==========================
    // SAFE PROFIT VALUES
    // ==========================
    const netProfitMargin =
        Number(
            profit.netProfitMargin || 0
        );


    const grossMargin =
        Number(
            profit.grossMargin || 0
        );


    const tomorrowNetProfit =
        Number(
            profit.estimatedTomorrowNetProfit || 0
        );


    const next7DaysNetProfit =
        Number(
            profit.estimatedNext7DaysNetProfit || 0
        );


    const next30DaysNetProfit =
        Number(
            profit.estimatedNext30DaysNetProfit || 0
        );


    const tomorrowGrossProfit =
        Number(
            profit.estimatedTomorrowGrossProfit || 0
        );


    const next7DaysGrossProfit =
        Number(
            profit.estimatedNext7DaysGrossProfit || 0
        );


    const next30DaysGrossProfit =
        Number(
            profit.estimatedNext30DaysGrossProfit || 0
        );


    // ==========================
    // BUILD RISK MESSAGE
    // ==========================
    let riskMessage =
        "No major business risks detected.";


    if (
        Array.isArray(risks) &&
        risks.length > 0
    ) {

        riskMessage =
            risks
                .map(
                    r => `• ${r.message}`
                )
                .join("\n");

    }


    // ==========================
    // BUILD REPORT
    // ==========================
    return `🔮 AI CFO BUSINESS FORECAST

━━━━━━━━━━━━━━━━━━

📈 REVENUE FORECAST

Average Daily Revenue

₦${Math.round(
        revenue.averageDailySales || 0
    ).toLocaleString()}

Tomorrow

₦${Math.round(
        revenue.tomorrow || 0
    ).toLocaleString()}

Next 7 Days

₦${Math.round(
        revenue.next7Days || 0
    ).toLocaleString()}

Next 30 Days

₦${Math.round(
        revenue.next30Days || 0
    ).toLocaleString()}

Growth Rate

${Number(
        revenue.growthRate || 0
    ).toFixed(2)}%

Trend

📊 ${revenue.trend || "No Data"}

Confidence

${revenue.confidence || 0}%

━━━━━━━━━━━━━━━━━━

💰 CASH FORECAST

Current Cash

₦${Math.round(
        cash.currentCash || 0
    ).toLocaleString()}

Projected 7 Days

₦${Math.round(
        cash.next7Days || 0
    ).toLocaleString()}

Projected 30 Days

₦${Math.round(
        cash.next30Days || 0
    ).toLocaleString()}

Cash Status

${cash.status || "Unknown"}

━━━━━━━━━━━━━━━━━━

🏆 PROFIT FORECAST

Net Profit Margin

${netProfitMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

Estimated Net Profit

Tomorrow

₦${Math.round(
        tomorrowNetProfit
    ).toLocaleString()}

Next 7 Days

₦${Math.round(
        next7DaysNetProfit
    ).toLocaleString()}

Next 30 Days

₦${Math.round(
        next30DaysNetProfit
    ).toLocaleString()}

━━━━━━━━━━━━━━━━━━

Gross Margin

${grossMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

Estimated Gross Profit

Tomorrow

₦${Math.round(
        tomorrowGrossProfit
    ).toLocaleString()}

Next 7 Days

₦${Math.round(
        next7DaysGrossProfit
    ).toLocaleString()}

Next 30 Days

₦${Math.round(
        next30DaysGrossProfit
    ).toLocaleString()}

━━━━━━━━━━━━━━━━━━

Profit Outlook

${profit.status || "Unknown"}

━━━━━━━━━━━━━━━━━━

📦 INVENTORY FORECAST

Products

${inventory.totalItems || 0}

Low Stock

${inventory.lowStockItems || 0}

Out of Stock

${inventory.outOfStockItems || 0}

Restock Urgency

${inventory.restockUrgency || "Unknown"}

Estimated Stockout

${inventory.estimatedStockoutDays || 0} day(s)

━━━━━━━━━━━━━━━━━━

🚨 BUSINESS RISKS

${riskMessage}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO FORECAST

These projections are based on your recent business activity and will become more accurate as more data is recorded.

Keep recording your transactions consistently.`;

}


module.exports = {

    buildForecastReport

};