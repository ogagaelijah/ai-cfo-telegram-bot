const analytics = require("./financialAnalyticsService");

// ==========================
// BUSINESS ALERTS
// ==========================
function getBusinessAlerts(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    const cash =
        analytics.getCashMetrics(telegramId);

    const debt =
        analytics.getDebtMetrics(telegramId);

    const health =
        analytics.getBusinessHealth(telegramId);

    const alerts = [];

    // ==========================
    // LOW CASH
    // ==========================
    if (cash.cashPosition < 0) {

        alerts.push({
            level: "HIGH",
            title: "Negative Cash Flow",
            message:
                "Cash outflow is greater than cash inflow."
        });

    }

    // ==========================
    // LOW INVENTORY
    // ==========================
    if (snapshot.productCount < 5) {

        alerts.push({
            level: "MEDIUM",
            title: "Low Inventory",
            message:
                "Your inventory contains fewer than 5 products."
        });

    }

    // ==========================
    // HIGH CREDITORS
    // ==========================
    if (debt.creditors > 100000) {

        alerts.push({
            level: "HIGH",
            title: "Supplier Debt",
            message:
                "Outstanding supplier balances are becoming high."
        });

    }

    // ==========================
    // HIGH DEBTORS
    // ==========================
    if (debt.debtors > 100000) {

        alerts.push({
            level: "MEDIUM",
            title: "Customer Debts",
            message:
                "Large amounts are yet to be collected from customers."
        });

    }

    // ==========================
    // LOW HEALTH SCORE
    // ==========================
    if (health.score < 70) {

        alerts.push({
            level: "HIGH",
            title: "Business Health",
            message:
                "Overall business health requires attention."
        });

    }

    // ==========================
    // HEALTHY BUSINESS
    // ==========================
    if (alerts.length === 0) {

        alerts.push({
            level: "GOOD",
            title: "Business Healthy",
            message:
                "No critical business alerts detected."
        });

    }

    return alerts;

}

module.exports = {

    getBusinessAlerts

};