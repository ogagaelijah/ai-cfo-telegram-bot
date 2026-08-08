const analytics =
    require("./financialAnalyticsService");

const trends =
    require("./businessTrendsService");

const forecast =
    require("./businessForecastService");

// ==========================
// AI CFO DECISION ENGINE
// ==========================
function generateDecision(
    telegramId,
    topic = null
) {

    const health =
        analytics.getBusinessHealth(
            telegramId
        );

    const cash =
        analytics.getCashMetrics(
            telegramId
        );

    const snapshot =
        analytics.getBusinessSnapshot(
            telegramId
        );

    const trend =
        trends.getBusinessTrends(
            telegramId
        );

    const prediction =
        forecast.getBusinessForecast(
            telegramId
        );

    // ==================================================
    // DEFAULT VALUES
    // ==================================================

    let priority =
        "Maintain current operations.";

    let explanation =
        "Your business is performing normally.";

    let recommendation =
        "Continue monitoring daily transactions.";

    let urgency =
        "Low";


    // ==================================================
    // CASH FLOW
    // ==================================================

    if (topic === "cash") {

        if (
            cash.cashPosition < 0
        ) {

            urgency =
                "High";

            priority =
                "Improve Cash Flow";

            explanation =
                `Your cash position is negative at ₦${Math.round(
                    cash.cashPosition
                ).toLocaleString()}. This means the business currently has more recorded cash outflows than available cash inflows.`;

            recommendation =
                "Collect outstanding customer payments, delay non-essential purchases and review recent expenses.";

        } else {

            urgency =
                "Low";

            priority =
                "Maintain Healthy Cash Flow";

            explanation =
                `Your current cash position is positive at ₦${Math.round(
                    cash.cashPosition
                ).toLocaleString()}. There is no immediate negative cash-flow warning based on the recorded transactions.`;

            recommendation =
                "Continue monitoring collections and expenses so the positive cash position is maintained.";

        }

    }


    // ==================================================
    // PROFIT
    // ==================================================

    else if (
        topic === "profit"
    ) {

        const netProfit =
            snapshot.netProfit;

        const grossMargin =
            snapshot.grossMargin;

        if (
            netProfit < 0
        ) {

            urgency =
                "High";

            priority =
                "Protect Profit";

            explanation =
                `Your business is currently recording a net loss of ₦${Math.abs(
                    Math.round(netProfit)
                ).toLocaleString()}. This means recorded expenses are exceeding the profit generated from business activity.`;

            recommendation =
                "Review operating expenses, supplier costs and pricing before increasing discretionary spending.";

        } else if (
            netProfit === 0
        ) {

            urgency =
                "Medium";

            priority =
                "Improve Profitability";

            explanation =
                "Your recorded net profit is currently ₦0. This means the available financial records do not show a positive net profit for the period being analyzed.";

            recommendation =
                "Review revenue and expenses carefully, then identify opportunities to increase profitable sales and reduce unnecessary costs.";

        } else if (
            trend.profitTrend === "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Protect Profit";

            explanation =
                `Your business is profitable with recorded net profit of ₦${Math.round(
                    netProfit
                ).toLocaleString()}, but profitability is trending downward compared with previous periods.`;

            recommendation =
                "Review expenses, supplier pricing and product margins before the decline becomes more significant.";

        } else {

            urgency =
                "Low";

            priority =
                "Maintain Profitability";

            explanation =
                `Your business is currently recording a positive net profit of ₦${Math.round(
                    netProfit
                ).toLocaleString()} with a gross margin of ${grossMargin.toFixed(
                    2
                )}%.`;

            recommendation =
                "Maintain profitable sales while monitoring expenses and gross margin.";

        }

    }


    // ==================================================
    // REVENUE
    // ==================================================

    else if (
        topic === "revenue"
    ) {

        const sales =
            snapshot.sales;

        if (
            trend.revenueTrend ===
            "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Increase Revenue";

            explanation =
                `Recorded revenue is ₦${Math.round(
                    sales
                ).toLocaleString()}, and sales are currently trending downward compared with previous periods.`;

            recommendation =
                "Increase customer follow-up, reactivate inactive customers and review sales and marketing activity.";

        } else if (
            trend.revenueTrend ===
            "Growing"
        ) {

            urgency =
                "Low";

            priority =
                "Scale Revenue";

            explanation =
                `Recorded revenue is ₦${Math.round(
                    sales
                ).toLocaleString()}, and sales are showing positive growth compared with previous periods.`;

            recommendation =
                "Maintain the activities driving sales growth while ensuring inventory and cash reserves can support increased demand.";

        } else {

            urgency =
                "Low";

            priority =
                "Increase Revenue";

            explanation =
                `Recorded revenue is ₦${Math.round(
                    sales
                ).toLocaleString()}, with no strong upward or downward revenue trend currently detected.`;

            recommendation =
                "Look for opportunities to increase repeat purchases, customer retention and new customer acquisition.";

        }

    }


    // ==================================================
    // BUSINESS RISK
    // ==================================================

    else if (
        topic === "risk"
    ) {

        if (
            cash.cashPosition < 0
        ) {

            urgency =
                "High";

            priority =
                "Reduce Cash Risk";

            explanation =
                `The most immediate business risk is negative cash position. The recorded cash position is ₦${Math.round(
                    cash.cashPosition
                ).toLocaleString()}, which can make it difficult to meet upcoming business obligations.`;

            recommendation =
                "Prioritize customer collections and control non-essential cash outflows.";

        } else if (
            trend.revenueTrend ===
            "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Reduce Revenue Risk";

            explanation =
                "Revenue is declining compared with previous periods. If the decline continues, it may eventually put pressure on profitability and cash flow.";

            recommendation =
                "Investigate the cause of declining sales and focus on customer retention and revenue recovery.";

        } else if (
            trend.profitTrend ===
            "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Protect Profit";

            explanation =
                "Profitability is weakening compared with previous periods. Continued margin pressure could reduce the business's ability to generate sustainable returns.";

            recommendation =
                "Review expenses, supplier costs and pricing.";

        } else if (
            health.score < 70
        ) {

            urgency =
                "Medium";

            priority =
                "Improve Business Health";

            explanation =
                `The current business health score is ${health.score}/100, indicating that one or more financial performance areas require attention.`;

            recommendation =
                "Review the business dashboard and address the weakest financial performance area first.";

        } else {

            urgency =
                "Low";

            priority =
                "Maintain Business Stability";

            explanation =
                "No major immediate financial risk has been detected from the available business metrics.";

            recommendation =
                "Continue monitoring cash flow, revenue, profitability and expenses regularly.";

        }

    }


    // ==================================================
    // PRIORITY
    // ==================================================

    else if (
        topic === "priority"
    ) {

        // Cash takes highest priority.

        if (
            cash.cashPosition < 0
        ) {

            urgency =
                "High";

            priority =
                "Improve Cash Flow";

            explanation =
                `Cash position is currently negative at ₦${Math.round(
                    cash.cashPosition
                ).toLocaleString()}, making liquidity the most immediate concern.`;

            recommendation =
                "Collect customer payments and reduce non-essential spending.";

        }

        // Revenue decline.

        else if (
            trend.revenueTrend ===
            "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Increase Revenue";

            explanation =
                "Revenue is declining compared with previous periods, making sales recovery the next important priority.";

            recommendation =
                "Focus on customer retention, follow-ups and revenue-generating activities.";

        }

        // Profit decline.

        else if (
            trend.profitTrend ===
            "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Protect Profit";

            explanation =
                "Profitability is declining despite ongoing business activity.";

            recommendation =
                "Review expenses, supplier costs and pricing.";

        }

        // Health.

        else if (
            health.score < 70
        ) {

            urgency =
                "Medium";

            priority =
                "Improve Business Health";

            explanation =
                `The current business health score is ${health.score}/100, so overall business performance requires attention.`;

            recommendation =
                "Review the weakest financial area and address it before pursuing aggressive growth.";

        }

        // Growth.

        else if (
            prediction.revenueTrend ===
            "Growing"
        ) {

            urgency =
                "Low";

            priority =
                "Scale Operations";

            explanation =
                "Historical revenue trends indicate healthy business growth.";

            recommendation =
                "Prepare inventory, staffing and cash reserves for increasing demand.";

        }

    }


    // ==================================================
    // GENERAL BUSINESS DECISION
    // ==================================================

    else {

        // CASH CRITICAL

        if (
            cash.cashPosition < 0
        ) {

            urgency =
                "High";

            priority =
                "Improve Cash Flow";

            explanation =
                "Cash outflows currently exceed available inflows, creating immediate liquidity pressure.";

            recommendation =
                "Collect customer payments before making non-essential purchases.";

        }

        // DECLINING SALES

        else if (
            trend.revenueTrend ===
            "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Increase Revenue";

            explanation =
                "Sales have been declining compared with previous periods.";

            recommendation =
                "Increase customer follow-up and review sales and marketing activity.";

        }

        // DECLINING PROFIT

        else if (
            trend.profitTrend ===
            "Declining"
        ) {

            urgency =
                "Medium";

            priority =
                "Protect Profit";

            explanation =
                "Profitability is declining compared with previous periods.";

            recommendation =
                "Review expenses, supplier costs and pricing.";

        }

        // LOW HEALTH

        else if (
            health.score < 70
        ) {

            urgency =
                "Medium";

            priority =
                "Improve Business Health";

            explanation =
                "Overall business performance has weakened.";

            recommendation =
                "Focus on improving the weakest financial performance area.";

        }

        // GROWTH

        else if (
            prediction.revenueTrend ===
            "Growing"
        ) {

            urgency =
                "Low";

            priority =
                "Scale Operations";

            explanation =
                "Historical trends indicate healthy business growth.";

            recommendation =
                "Prepare inventory and cash reserves for increasing demand.";

        }

    }


    // ==================================================
    // RETURN DECISION
    // ==================================================

    return {

        urgency,

        priority,

        explanation,

        recommendation,

        projectedRevenue:
            prediction.projectedRevenue,

        projectedProfit:
            prediction.projectedProfit,

        confidence:
            prediction.confidence

    };

}


// ==========================
// EXPORT
// ==========================
module.exports = {

    generateDecision

};