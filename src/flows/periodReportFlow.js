const reportKeyboard = require("../keyboards/reportKeyboard");

const {
    getPeriodReport
} = require("../services/periodReportService");

const {
    formatCurrency,
    formatPercentage
} = require("../helpers/formatters");

module.exports = async function periodReportFlow(ctx, period) {

    const report =
        getPeriodReport(ctx.from.id, period);

    let analysis = "";
    let recommendation = "";

    if (report.growth > 0) {

        analysis =
            `🟢 ${report.title} revenue increased compared to the previous period.`;

        recommendation =
            "Continue your current strategy and ensure inventory can meet the growing demand.";

    } else if (report.growth < 0) {

        analysis =
            `🔴 ${report.title} revenue declined compared to the previous period.`;

        recommendation =
            "Review sales activities, marketing efforts and customer retention to reverse the decline.";

    } else {

        analysis =
            `🟡 ${report.title} revenue remained unchanged from the previous period.`;

        recommendation =
            "Look for opportunities to increase sales and improve customer engagement.";

    }

    await ctx.reply(

`📊 AI CFO ${report.title.toUpperCase()} REPORT

━━━━━━━━━━━━━━━━━━

💰 Current Period

${formatCurrency(report.current)}

━━━━━━━━━━━━━━━━━━

📅 Previous Period

${formatCurrency(report.previous)}

━━━━━━━━━━━━━━━━━━

📈 Growth Rate

${formatPercentage(report.growth)}

━━━━━━━━━━━━━━━━━━

🤖 AI CFO ANALYSIS

${analysis}

━━━━━━━━━━━━━━━━━━

🎯 RECOMMENDATION

${recommendation}

━━━━━━━━━━━━━━━━━━

📈 Keep monitoring your business performance regularly to identify trends early and make better decisions.`,

        reportKeyboard

    );

};