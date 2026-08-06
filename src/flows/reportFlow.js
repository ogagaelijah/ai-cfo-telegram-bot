const keyboard = require("../keyboards/reportKeyboard");

const {
    getBusinessSnapshot,
    getBusinessHealth,
    getCashMetrics,
    getDebtMetrics,
    getBusinessKPIs,
    getBusinessForecast
} = require("../services/financialAnalyticsService");

const {
    getBusinessInsights
} = require("../services/businessInsightsService");

const {
    getBusinessRecommendations
} = require("../services/businessRecommendationService");

module.exports = async function reportFlow(ctx) {

    const snapshot = getBusinessSnapshot(ctx.from.id);

    const cash = getCashMetrics(ctx.from.id);

    const debt = getDebtMetrics(ctx.from.id);

    const health = getBusinessHealth(ctx.from.id);

    const kpis = getBusinessKPIs(ctx.from.id);

    const forecast =
    getBusinessForecast(ctx.from.id);

    const insights = getBusinessInsights(ctx.from.id);

    const recommendations =
        getBusinessRecommendations(ctx.from.id);

    await ctx.reply(

`🏢 AI CFO EXECUTIVE DASHBOARD

━━━━━━━━━━━━━━━━━━

💰 PROFITABILITY

📈 Revenue
₦${snapshot.sales.toLocaleString()}

📦 Cost of Goods Sold
₦${snapshot.costOfGoods.toLocaleString()}

💵 Gross Profit
₦${snapshot.grossProfit.toLocaleString()}

📊 Gross Margin
${snapshot.grossMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

💵 CASH FLOW

💰 Cash In
₦${cash.cashIn.toLocaleString()}

💸 Cash Out
₦${cash.cashOut.toLocaleString()}

💳 Cash Position
₦${cash.cashPosition.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📦 INVENTORY

💼 Inventory Value
₦${snapshot.inventoryValue.toLocaleString()}

📦 Products
${snapshot.productCount}

━━━━━━━━━━━━━━━━━━

👥 RECEIVABLES & PAYABLES

👤 Outstanding Debtors
₦${debt.debtors.toLocaleString()}

🏢 Outstanding Creditors
₦${debt.creditors.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📈 BUSINESS PERFORMANCE

💸 Operating Expenses
₦${snapshot.expenses.toLocaleString()}

💵 Other Income
₦${snapshot.income.toLocaleString()}

🏆 Net Profit
₦${snapshot.netProfit.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📊 KEY PERFORMANCE INDICATORS

📈 Gross Margin
${kpis.grossMargin.toFixed(2)}%

💰 Net Margin
${kpis.netMargin.toFixed(2)}%

💸 Expense Ratio
${kpis.expenseRatio.toFixed(2)}%

🏦 Cash Ratio
${kpis.cashRatio.toFixed(2)}%

📋 Debt Ratio
${kpis.debtRatio.toFixed(2)}%

📦 Inventory Turnover
${kpis.inventoryTurnover.toFixed(2)}

🛒 Revenue per Product
₦${kpis.revenuePerProduct.toLocaleString()}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO HEALTH

${health.status}

⭐ Business Score
${health.score}/100

━━━━━━━━━━━━━━━━━━

🏆 Strengths

${health.strengths.length > 0
    ? health.strengths.map(item => `✅ ${item}`).join("\n")
    : "None"}

━━━━━━━━━━━━━━━━━━

⚠️ Risks

${health.risks.length > 0
    ? health.risks.map(item => `⚠️ ${item}`).join("\n")
    : "No major risks detected."}

━━━━━━━━━━━━━━━━━━

🧠 AI CFO INSIGHTS

${insights.length > 0
    ? insights.join("\n")
    : "No business insights available yet."}

    ━━━━━━━━━━━━━━━━━━

🔮 FORECAST TEST

📈 Average Daily Sales

₦${forecast.averageDailySales.toLocaleString()}

💸 Average Daily Expenses

₦${forecast.averageDailyExpenses.toLocaleString()}

📅 7-Day Revenue Forecast

₦${forecast.forecast7DaysRevenue.toLocaleString()}

📅 30-Day Revenue Forecast

₦${forecast.forecast30DaysRevenue.toLocaleString()}

💰 7-Day Cash Forecast

₦${forecast.forecast7DaysCash.toLocaleString()}

💰 30-Day Cash Forecast

₦${forecast.forecast30DaysCash.toLocaleString()}

━━━━━━━━━━━━━━━━━━

🎯 AI CFO RECOMMENDATIONS

${recommendations.length > 0
    ? recommendations.join("\n")
    : "No recommendations at this time."}`,

        keyboard

    );

};