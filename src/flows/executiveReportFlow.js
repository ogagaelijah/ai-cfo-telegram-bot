const keyboard = require("../keyboards/reportKeyboard");

const {
    getExecutiveReport
} = require("../services/executiveReportService");

const {
    formatCurrency,
    formatPercentage,
    formatScore
} = require("../helpers/formatters");

module.exports = async function executiveReportFlow(ctx) {

    const report =
        getExecutiveReport(ctx.from.id);

    await ctx.reply(

`📑 AI CFO EXECUTIVE REPORT

━━━━━━━━━━━━━━━━━━

🏢 BUSINESS OVERVIEW

Revenue

${formatCurrency(report.dashboard.sales)}

Net Profit

${formatCurrency(report.dashboard.netProfit)}

Business Health

${report.health.status}

Business Score

${formatScore(report.health.score)}

━━━━━━━━━━━━━━━━━━

📈 KPI SUMMARY

Gross Margin

${formatPercentage(report.kpis.grossMargin)}

Net Margin

${formatPercentage(report.kpis.netMargin)}

Cash Position

${formatCurrency(report.kpis.cashPosition)}

━━━━━━━━━━━━━━━━━━

📉 BUSINESS TRENDS

Today

${formatPercentage(report.trends.daily.growth)}

This Week

${formatPercentage(report.trends.weekly.growth)}

This Month

${formatPercentage(report.trends.monthly.growth)}

━━━━━━━━━━━━━━━━━━

🔮 BUSINESS FORECAST

Next 7 Days

${formatCurrency(report.forecast.next7DaysRevenue)}

Next 30 Days

${formatCurrency(report.forecast.next30DaysRevenue)}

━━━━━━━━━━━━━━━━━━

💰 PROFITABILITY

Gross Profit

${formatCurrency(report.profitLoss.grossProfit)}

Net Profit

${formatCurrency(report.profitLoss.netProfit)}

━━━━━━━━━━━━━━━━━━

💵 CASH FLOW

Cash Position

${formatCurrency(report.cashFlow.cashPosition)}

━━━━━━━━━━━━━━━━━━

🤖 CFO INSIGHT

${report.insights.summary}

━━━━━━━━━━━━━━━━━━

🏆 EXECUTIVE SUMMARY

${
report.health.score >= 85
? "✅ Overall business performance is strong with positive financial indicators."
: report.health.score >= 70
? "🟡 Business is stable but has areas that require attention."
: "🔴 Business performance requires immediate financial improvement."
}`,

        keyboard

    );

};