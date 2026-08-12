const keyboard = require("../keyboards/reportKeyboard");

const {
    getExecutiveReportForUser
} = require("../application/reportApplicationService");

module.exports = async function reportFlow(ctx) {

    const report =
        getExecutiveReportForUser(
            ctx.from.id
        );

    const dashboard =
        report.dashboard || {};

    const cashFlow =
        report.cashFlow || {};

    const health =
        report.health || {};

    const kpis =
        report.kpis || {};

    const forecast =
        report.forecast || {};

    const advisor =
        report.advisor || {};

    const decisions =
        Array.isArray(report.decisions)
            ? report.decisions
            : [];

    const recommendations =
        Array.isArray(report.recommendations)
            ? report.recommendations
            : [];

    const risks =
        Array.isArray(report.risks)
            ? report.risks
            : [];

    const insights =
        Array.isArray(report.insights)
            ? report.insights
            : [];

    const executiveSummary =
        report.executiveSummary || {};


    // ============================================================
    // SAFE FORMATTERS
    // ============================================================

    const money = (value) =>
        `₦${(
            Number(value) || 0
        ).toLocaleString()}`;

    const number = (value) =>
        (
            Number(value) || 0
        ).toLocaleString();

    const percent = (value) =>
        `${(
            Number(value) || 0
        ).toFixed(2)}%`;

    const decimal = (value) =>
        (
            Number(value) || 0
        ).toFixed(2);


    // ============================================================
    // FORECAST VALUES
    // ============================================================

    const revenueForecast =
        forecast.revenue || {};

    const cashForecast =
        forecast.cash || {};

    const profitForecast =
        forecast.profit || {};

    const inventoryForecast =
        forecast.inventory || {};

    const inventoryDemandForecast =
        forecast.inventoryDemand || {};


    // ============================================================
    // ADVISOR VALUES
    // ============================================================

    const advisorStatus =
        advisor.businessStatus ||
        "Unknown";

    const advisorPriority =
        advisor.overallPriority ||
        "None";

    const advisorHeadline =
        advisor.headline ||
        "No advisor assessment available.";

    const advisorAssessment =
        advisor.assessment ||
        "No advisor assessment is currently available.";


    // ============================================================
    // EXECUTIVE DASHBOARD
    // ============================================================

    const message = `💼 AI CFO EXECUTIVE DASHBOARD

━━━━━━━━━━━━━━━━━━━━━━

📋 EXECUTIVE SUMMARY

${executiveSummary.headline || "No executive summary available."}

${executiveSummary.message || "No executive message available."}

Status:
${executiveSummary.status || "Unknown"}

Top Priority:
${executiveSummary.topPriority || "None"}

━━━━━━━━━━━━━━━━━━━━━━

💰 PROFITABILITY

📈 Revenue
${money(dashboard.sales)}

📦 Cost of Goods Sold
${money(dashboard.costOfGoods)}

💵 Gross Profit
${money(dashboard.grossProfit)}

📊 Gross Margin
${percent(dashboard.grossMargin)}

💰 Net Profit
${money(dashboard.netProfit)}

━━━━━━━━━━━━━━━━━━━━━━

💵 CASH FLOW

💰 Cash In
${money(cashFlow.cashIn)}

💸 Cash Out
${money(cashFlow.cashOut)}

💳 Cash Position
${money(cashFlow.cashPosition)}

━━━━━━━━━━━━━━━━━━━━━━

📦 INVENTORY

💼 Inventory Value
${money(dashboard.inventoryValue)}

📦 Products
${number(dashboard.productCount)}

━━━━━━━━━━━━━━━━━━━━━━

👥 RECEIVABLES & PAYABLES

👤 Outstanding Debtors
${money(
        dashboard.outstandingDebtors ??
        report.health?.outstandingDebtors
    )}

🏢 Outstanding Creditors
${money(
        dashboard.outstandingCreditors ??
        report.health?.outstandingCreditors
    )}

━━━━━━━━━━━━━━━━━━━━━━

📊 KEY PERFORMANCE INDICATORS

📈 Gross Margin
${percent(kpis.grossMargin)}

💰 Net Margin
${percent(kpis.netMargin)}

💸 Expense Ratio
${percent(kpis.expenseRatio)}

💵 Cash Ratio
${decimal(kpis.cashRatio)}

📋 Debt Ratio
${percent(kpis.debtRatio)}

📦 Inventory Turnover
${decimal(kpis.inventoryTurnover)}

🛒 Revenue per Product
${money(kpis.revenuePerProduct)}

━━━━━━━━━━━━━━━━━━━━━━

🤖 AI CFO HEALTH

${health.status || "Unknown"}

Health Score:
${number(health.score)}/100

━━━━━━━━━━━━━━━━━━━━━━

💪 STRENGTHS

${
    Array.isArray(health.strengths) &&
    health.strengths.length > 0

        ? health.strengths
            .map(item => `✅ ${item}`)
            .join("\n")

        : "No strengths identified."
}

━━━━━━━━━━━━━━━━━━━━━━

⚠️ RISKS

${
    risks.length > 0

        ? risks
            .map(item => {

                if (
                    typeof item === "string"
                ) {
                    return `⚠️ ${item}`;
                }

                return `⚠️ ${
                    item.title ||
                    item.message ||
                    item.description ||
                    "Business risk identified."
                }`;

            })
            .join("\n")

        : "No major risks detected."
}

━━━━━━━━━━━━━━━━━━━━━━

🧠 AI CFO ADVISOR

Business Status:
${advisorStatus}

Priority:
${advisorPriority}

${advisorHeadline}

${advisorAssessment}

━━━━━━━━━━━━━━━━━━━━━━

🎯 DECISIONS

${
    decisions.length > 0

        ? decisions
            .slice(0, 5)
            .map((decision, index) => {

                if (
                    typeof decision === "string"
                ) {
                    return `${index + 1}. ${decision}`;
                }

                return `${index + 1}. ${
                    decision.title ||
                    decision.message ||
                    decision.description ||
                    "Decision identified."
                }`;

            })
            .join("\n")

        : "No major decisions identified."
}

━━━━━━━━━━━━━━━━━━━━━━

💡 RECOMMENDATIONS

${
    recommendations.length > 0

        ? recommendations
            .slice(0, 5)
            .map((recommendation, index) => {

                if (
                    typeof recommendation === "string"
                ) {
                    return `${index + 1}. ${recommendation}`;
                }

                return `${index + 1}. ${
                    recommendation.title ||
                    recommendation.message ||
                    recommendation.description ||
                    "Recommendation available."
                }`;

            })
            .join("\n")

        : "No recommendations at this time."
}

━━━━━━━━━━━━━━━━━━━━━━

📈 REVENUE FORECAST

Tomorrow:
${money(revenueForecast.tomorrow)}

Next 7 Days:
${money(revenueForecast.next7Days)}

Next 30 Days:
${money(revenueForecast.next30Days)}

Forecast Confidence:
${percent(revenueForecast.confidence)}

Trend:
${revenueForecast.trend || "Unknown"}

━━━━━━━━━━━━━━━━━━━━━━

💵 CASH FORECAST

Tomorrow:
${money(cashForecast.tomorrow)}

Next 7 Days:
${money(cashForecast.next7Days)}

Next 30 Days:
${money(cashForecast.next30Days)}

━━━━━━━━━━━━━━━━━━━━━━

💰 PROFIT FORECAST

Tomorrow:
${money(profitForecast.tomorrowProfit)}

Next 7 Days:
${money(profitForecast.next7DaysProfit)}

Next 30 Days:
${money(profitForecast.next30DaysProfit)}

━━━━━━━━━━━━━━━━━━━━━━

📦 INVENTORY FORECAST

Tomorrow:
${number(inventoryForecast.tomorrow)}

Next 7 Days:
${number(inventoryForecast.next7Days)}

Next 30 Days:
${number(inventoryForecast.next30Days)}

━━━━━━━━━━━━━━━━━━━━━━

🛒 INVENTORY DEMAND

${
    inventoryDemandForecast.summary ||
    inventoryDemandForecast.message ||
    "No inventory demand assessment available."
}

━━━━━━━━━━━━━━━━━━━━━━

💡 BUSINESS INSIGHTS

${
    insights.length > 0

        ? insights
            .slice(0, 5)
            .map(item => {

                if (
                    typeof item === "string"
                ) {
                    return `• ${item}`;
                }

                return `• ${
                    item.title ||
                    item.message ||
                    item.description ||
                    "Business insight available."
                }`;

            })
            .join("\n")

        : "No business insights available yet."
}

━━━━━━━━━━━━━━━━━━━━━━

📊 REPORT STATUS

Executive Report:
Ready

Advisor:
${advisorStatus}

Decision Intelligence:
${decisions.length > 0 ? "Available" : "None"}

Recommendation Intelligence:
${recommendations.length > 0 ? "Available" : "None"}

Risk Intelligence:
${risks.length > 0 ? "Available" : "None"}

━━━━━━━━━━━━━━━━━━━━━━
`;

    await ctx.reply(
        message,
        keyboard
    );

};