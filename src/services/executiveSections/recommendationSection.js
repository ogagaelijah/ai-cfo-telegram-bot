// ==========================
// RECOMMENDATION SECTION
// ==========================
function buildRecommendationSection(report) {

    // ==========================
    // USE PRE-BUILT DECISION
    // ==========================
    const decision =
        report.decision;

    const expectedBenefits = [];

    switch (decision.priority) {

        case "Improve Cash Flow":

            expectedBenefits.push(
                "✔ Improved liquidity",
                "✔ Stronger cash flow",
                "✔ Better supplier confidence"
            );

            break;

        case "Increase Revenue":

            expectedBenefits.push(
                "✔ Higher sales",
                "✔ More customers",
                "✔ Stronger business growth"
            );

            break;

        case "Protect Profit":

            expectedBenefits.push(
                "✔ Higher profitability",
                "✔ Better margins",
                "✔ Reduced operating costs"
            );

            break;

        case "Improve Business Health":

            expectedBenefits.push(
                "✔ Better financial stability",
                "✔ Improved cash reserves",
                "✔ Stronger business performance"
            );

            break;

        case "Scale Operations":

            expectedBenefits.push(
                "✔ Increased revenue",
                "✔ Business expansion",
                "✔ Better long-term growth"
            );

            break;

        default:

            expectedBenefits.push(
                "✔ Maintain business stability"
            );

    }

    return `🎯 TODAY'S PRIORITY

${decision.recommendation}

━━━━━━━━━━━━━━━━━━

🧠 AI CFO DECISION

${decision.explanation}

━━━━━━━━━━━━━━━━━━

⚠️ PRIORITY LEVEL

${decision.urgency}

━━━━━━━━━━━━━━━━━━

📈 EXPECTED BENEFITS

${expectedBenefits.join("\n")}`;

}

module.exports = {

    buildRecommendationSection

};