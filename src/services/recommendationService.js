const analytics = require("./financialAnalyticsService");

// ==========================
// AI CFO ACTION PLAN
// ==========================
function getRecommendations(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    const cash =
        analytics.getCashMetrics(telegramId);

    const debt =
        analytics.getDebtMetrics(telegramId);

    const recommendations = [];

    // ==========================
    // CASH FLOW
    // ==========================
    if (cash.cashPosition < 0) {

        recommendations.push({

            priority: 1,

            title: "Improve Cash Flow",

            recommendation:
                "Collect outstanding customer payments before making new purchases.",

            impact:
                "Increase available cash."

        });

    }

    // ==========================
    // INVENTORY
    // ==========================
    if (snapshot.productCount < 5) {

        recommendations.push({

            priority: 2,

            title: "Expand Inventory",

            recommendation:
                `Only ${snapshot.productCount} products are currently stocked. Increase product variety.`,

            impact:
                "Improve customer retention and sales."

        });

    }

    // ==========================
    // HIGH EXPENSES
    // ==========================
    if (snapshot.expenses > snapshot.grossProfit * 0.5) {

        recommendations.push({

            priority: 3,

            title: "Reduce Expenses",

            recommendation:
                "Review operating expenses and eliminate unnecessary spending.",

            impact:
                "Increase net profit."

        });

    }

    // ==========================
    // LOW INVENTORY TURNOVER
    // ==========================
    if (snapshot.inventoryTurnover < 1) {

        recommendations.push({

            priority: 4,

            title: "Increase Sales",

            recommendation:
                "Current inventory turnover is low. Run promotions or create product bundles.",

            impact:
                "Increase monthly revenue."

        });

    }

    // ==========================
    // HIGH DEBTORS
    // ==========================
    if (debt.debtors > 0) {

        recommendations.push({

            priority: 5,

            title: "Collect Outstanding Debts",

            recommendation:
                "Follow up customers with unpaid balances.",

            impact:
                "Improve cash inflow."

        });

    }

    // ==========================
    // HEALTHY BUSINESS
    // ==========================
    if (recommendations.length === 0) {

        recommendations.push({

            priority: 1,

            title: "Keep Growing",

            recommendation:
                "Business performance is healthy. Continue monitoring KPIs and maintain profitability.",

            impact:
                "Sustain long-term growth."

        });

    }

    recommendations.sort((a, b) => a.priority - b.priority);

    return recommendations;

}

module.exports = {

    getRecommendations

};