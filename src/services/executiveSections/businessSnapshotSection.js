// ==========================
// BUSINESS SNAPSHOT SECTION
// ==========================
function buildBusinessSnapshotSection(report) {

    return `📈 BUSINESS SNAPSHOT

💰 Revenue
₦${report.snapshot.sales.toLocaleString()}

📦 Inventory Value
₦${report.snapshot.inventoryValue.toLocaleString()}

📦 Cost of Goods Sold
₦${report.snapshot.costOfGoods.toLocaleString()}

🏆 Net Profit
₦${report.snapshot.netProfit.toLocaleString()}

📊 Gross Margin
${report.snapshot.grossMargin.toFixed(2)}%

🤖 Business Health

${report.health.status}

⭐ Score

${report.health.score}/100`;

}

module.exports = {

    buildBusinessSnapshotSection

};