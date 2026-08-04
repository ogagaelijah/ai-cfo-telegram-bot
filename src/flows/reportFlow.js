const keyboard = require("../keyboards/mainKeyboard");

const {
    getBusinessSnapshot,
    getBusinessHealth,
    getCashMetrics,
    getDebtMetrics
} = require("../services/financialAnalyticsService");

module.exports = async function reportFlow(ctx) {

    const snapshot = getBusinessSnapshot(ctx.from.id);

    const cash = getCashMetrics(ctx.from.id);

    const debt = getDebtMetrics(ctx.from.id);

    const health = getBusinessHealth(ctx.from.id);

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
    : "No major risks detected."}`,

        keyboard

    );

};