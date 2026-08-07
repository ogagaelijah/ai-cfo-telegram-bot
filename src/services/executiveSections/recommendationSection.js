// ==========================
// RECOMMENDATION SECTION
// ==========================
function buildRecommendationSection(report) {

    let priority =
        "Continue operating normally while maintaining accurate financial records.";

    let expectedBenefits = [
        "✔ Maintain business stability"
    ];

    // ==========================
    // NEGATIVE CASH
    // ==========================
    if (report.cash.cashPosition < 0) {

        priority =
            "Collect outstanding customer payments before making any new non-essential purchases.";

        expectedBenefits = [

            "✔ Improved liquidity",

            "✔ Stronger cash flow",

            "✔ Better supplier confidence"

        ];

    }

    // ==========================
    // HIGH CUSTOMER DEBTS
    // ==========================
    else if (
        report.debt.debtors >
        report.snapshot.sales * 0.30
    ) {

        priority =
            "Follow up customers with overdue invoices and accelerate collections.";

        expectedBenefits = [

            "✔ Faster cash inflow",

            "✔ Lower bad debt risk",

            "✔ Stronger working capital"

        ];

    }

    // ==========================
    // LOW GROSS MARGIN
    // ==========================
    else if (
        report.snapshot.grossMargin < 20
    ) {

        priority =
            "Review pricing strategy and negotiate better supplier pricing.";

        expectedBenefits = [

            "✔ Higher profitability",

            "✔ Better margins",

            "✔ Sustainable business growth"

        ];

    }

    return `🎯 TODAY'S PRIORITY

${priority}

━━━━━━━━━━━━━━━━━━

📈 EXPECTED BENEFITS

${expectedBenefits.join("\n")}`;

}

module.exports = {

    buildRecommendationSection

};