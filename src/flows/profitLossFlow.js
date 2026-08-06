const keyboard = require("../keyboards/reportKeyboard");

const {
    getProfitLoss
} = require("../services/profitLossService");

module.exports = async function profitLossFlow(ctx) {

    const report = getProfitLoss(ctx.from.id);

    await ctx.reply(

`💰 AI CFO PROFIT & LOSS STATEMENT

━━━━━━━━━━━━━━━━━━

📈 REVENUE

Sales
₦${report.sales.toLocaleString()}

Other Income
₦${report.otherIncome.toLocaleString()}

Total Revenue
₦${report.totalRevenue.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📦 COST OF SALES

Cost of Goods Sold
₦${report.costOfGoods.toLocaleString()}

Gross Profit
₦${report.grossProfit.toLocaleString()}

Gross Margin
${report.grossMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

💸 OPERATING EXPENSES

Operating Expenses
₦${report.expenses.toLocaleString()}

━━━━━━━━━━━━━━━━━━

🏆 NET PROFIT

Net Profit
₦${report.netProfit.toLocaleString()}

Net Margin
${report.netMargin.toFixed(2)}%

━━━━━━━━━━━━━━━━━━

🤖 AI CFO ANALYSIS

${
report.netMargin >= 20
? "✅ Your business is generating a healthy net profit."
: "⚠️ Net profit margin is low. Review costs and pricing."
}

${
report.grossMargin >= 40
? "✅ Gross margin indicates strong pricing and cost control."
: "⚠️ Gross margin is below the recommended level."
}`,

        keyboard

    );

};