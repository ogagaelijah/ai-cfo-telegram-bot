const keyboard = require("../keyboards/reportKeyboard");

const {
    getCashFlow
} = require("../services/cashFlowService");

module.exports = async function cashFlowFlow(ctx) {

    const report = getCashFlow(ctx.from.id);

    await ctx.reply(

`💵 AI CFO CASH FLOW STATEMENT

━━━━━━━━━━━━━━━━━━

💰 CASH INFLOWS

Sales
₦${report.sales.toLocaleString()}

Other Income
₦${report.otherIncome.toLocaleString()}

━━━━━━━━━━━━━━━━━━

Total Cash In

₦${report.cashIn.toLocaleString()}

━━━━━━━━━━━━━━━━━━

💸 CASH OUTFLOWS

Purchases

₦${report.purchases.toLocaleString()}

Operating Expenses

₦${report.expenses.toLocaleString()}

━━━━━━━━━━━━━━━━━━

Total Cash Out

₦${report.cashOut.toLocaleString()}

━━━━━━━━━━━━━━━━━━

💳 NET CASH FLOW

Cash Position

₦${report.cashPosition.toLocaleString()}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO ANALYSIS

${
report.cashPosition >= 0
? "✅ Cash inflows currently exceed cash outflows. Liquidity is healthy."
: "⚠️ Cash outflows currently exceed inflows. Review purchasing and improve collections."
}

${
report.cashOut > report.cashIn * 1.5
? "⚠️ Cash outflows are significantly higher than inflows."
: "✅ Cash movement appears balanced."
}`,

        keyboard

    );

};