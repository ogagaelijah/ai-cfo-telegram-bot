const keyboard = require("../keyboards/reportKeyboard");

const {
    getAIInsights
} = require("../services/aiInsightsService");

module.exports = async function aiInsightsFlow(ctx) {

    const report =
        getAIInsights(ctx.from.id);

    await ctx.reply(

`🤖 AI CFO STRATEGIC INSIGHTS

━━━━━━━━━━━━━━━━━━

🏥 BUSINESS HEALTH

${report.health.status}

Business Score

${report.health.score}/100

━━━━━━━━━━━━━━━━━━

🏆 TOP STRENGTHS

${
report.strengths.length
? report.strengths.map(item => `✅ ${item}`).join("\n")
: "No significant strengths identified."
}

━━━━━━━━━━━━━━━━━━

⚠️ KEY RISKS

${
report.risks.length
? report.risks.map(item => `⚠️ ${item}`).join("\n")
: "No major financial risks detected."
}

━━━━━━━━━━━━━━━━━━

📈 GROWTH OPPORTUNITIES

${
report.opportunities.length
? report.opportunities.map(item => `🚀 ${item}`).join("\n")
: "No immediate growth opportunities identified."
}

━━━━━━━━━━━━━━━━━━

🎯 PRIORITY ACTION

${report.priorityAction}

━━━━━━━━━━━━━━━━━━

🧠 AI CFO CONFIDENCE

${report.confidence}%`,

        keyboard

    );

};