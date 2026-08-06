const keyboard = require("../keyboards/reportKeyboard");

const {
    getDebtorsReport
} = require("../services/debtorsReportService");

module.exports = async function debtorsReportFlow(ctx) {

    const report = getDebtorsReport(ctx.from.id);

    await ctx.reply(

`👥 AI CFO DEBTORS REPORT

━━━━━━━━━━━━━━━━━━

💰 OUTSTANDING DEBTORS

₦${report.outstandingDebtors.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📊 STATUS

${report.status}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO ANALYSIS

${
report.outstandingDebtors === 0
? "✅ No outstanding customer debts."
: report.outstandingDebtors <= 100000
? "✅ Customer debt is within a manageable range."
: "⚠️ Outstanding customer balances are high. Follow up on collections to improve cash flow."
}`,

        keyboard

    );

};