// ==========================
// FORMAT BUSINESS REPORT
// ==========================
function formatMorningBrief(report) {

    return `🌅 GOOD MORNING

━━━━━━━━━━━━━━━━━━

📊 AI CFO MORNING BUSINESS BRIEF

━━━━━━━━━━━━━━━━━━

💰 Revenue
₦${report.snapshot.sales.toLocaleString()}

📦 Cost of Goods Sold
₦${report.snapshot.costOfGoods.toLocaleString()}

🏆 Net Profit
₦${report.snapshot.netProfit.toLocaleString()}

━━━━━━━━━━━━━━━━━━

💳 Cash Position

₦${report.cash.cashPosition.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📦 Inventory Value

₦${report.snapshot.inventoryValue.toLocaleString()}

━━━━━━━━━━━━━━━━━━

🤖 Business Health

${report.health.status}

⭐ Score

${report.health.score}/100

━━━━━━━━━━━━━━━━━━

🚨 Critical Alerts

${report.alertSummary.critical}

⚠ Warnings

${report.alertSummary.warning}

ℹ Information

${report.alertSummary.info}

━━━━━━━━━━━━━━━━━━

💡 Top Recommendation

${report.recommendations.length > 0
    ? report.recommendations[0].message
    : "No recommendations available."}

━━━━━━━━━━━━━━━━━━

Have a productive business day. 🚀`;

}

module.exports = {

    formatMorningBrief

};