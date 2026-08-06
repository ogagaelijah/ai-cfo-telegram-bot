const keyboard = require("../keyboards/reportKeyboard");

const {
    getCreditorsReport
} = require("../services/creditorsReportService");

module.exports = async function creditorsReportFlow(ctx) {

    const report = getCreditorsReport(ctx.from.id);

    await ctx.reply(

`🏢 AI CFO CREDITORS REPORT

━━━━━━━━━━━━━━━━━━

💰 OUTSTANDING CREDITORS

₦${report.outstandingCreditors.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📊 STATUS

${report.status}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO ANALYSIS

${
report.outstandingCreditors === 0
? "✅ No outstanding supplier liabilities."
: report.outstandingCreditors <= 100000
? "✅ Supplier obligations are within a manageable range."
: "⚠️ Outstanding supplier balances are high. Plan repayments carefully to maintain good supplier relationships."
}`,

        keyboard

    );

};