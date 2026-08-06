const keyboard = require("../keyboards/reportKeyboard");

const {
    getKPIs
} = require("../services/kpiService");

module.exports = async function kpiFlow(ctx) {

    const kpi = getKPIs(ctx.from.id);

    await ctx.reply(

`📊 AI CFO KPI DASHBOARD

━━━━━━━━━━━━━━━━━━

💰 REVENUE

Revenue
₦${kpi.revenue.toLocaleString()}

Gross Profit
₦${kpi.grossProfit.toLocaleString()}

Net Profit
₦${kpi.netProfit.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📈 PROFITABILITY

Gross Margin
${kpi.grossMargin.toFixed(2)}%

Net Margin
${kpi.netMargin.toFixed(2)}%

Expense Ratio
${kpi.expenseRatio.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

💵 CASH POSITION

Cash Position
₦${kpi.cashPosition.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📦 INVENTORY

Inventory Value
₦${kpi.inventoryValue.toLocaleString()}

Products
${kpi.productCount}

━━━━━━━━━━━━━━━━━━

👥 RECEIVABLES

Outstanding Debtors
₦${kpi.debtors.toLocaleString()}

Outstanding Creditors
₦${kpi.creditors.toLocaleString()}

Total Debt Exposure
₦${kpi.debtExposure.toLocaleString()}

━━━━━━━━━━━━━━━━━━

🤖 CFO SUMMARY

${
kpi.netMargin >= 20
? "✅ Profitability is strong."
: "⚠️ Profit margin needs improvement."
}

${
kpi.expenseRatio <= 30
? "✅ Operating expenses are under control."
: "⚠️ Expenses are consuming a large portion of revenue."
}

${
kpi.debtExposure <= kpi.revenue * 0.5
? "✅ Debt exposure is within a healthy range."
: "⚠️ Debt exposure is becoming significant."
}`,

        keyboard

    );

};