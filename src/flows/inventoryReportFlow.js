const keyboard = require("../keyboards/reportKeyboard");

const {
    getInventoryReport
} = require("../services/inventoryReportService");

module.exports = async function inventoryReportFlow(ctx) {

    const report = getInventoryReport(ctx.from.id);

    await ctx.reply(

`📦 AI CFO INVENTORY REPORT

━━━━━━━━━━━━━━━━━━

📦 INVENTORY SUMMARY

Inventory Value

₦${report.inventoryValue.toLocaleString()}

━━━━━━━━━━━━━━━━━━

📦 PRODUCTS

Total Products

${report.productCount}

━━━━━━━━━━━━━━━━━━

📊 INVENTORY STATUS

${report.inventoryStatus}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO ANALYSIS

${
report.inventoryStatus === "Healthy"
? "✅ Inventory levels appear healthy."
: report.inventoryStatus === "Low Variety"
? "⚠️ Consider expanding your product range to improve sales opportunities."
: "⚠️ Inventory is empty. Restock products to continue selling."
}`,

        keyboard

    );

};