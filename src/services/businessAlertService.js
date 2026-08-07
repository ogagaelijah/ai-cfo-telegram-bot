const analytics = require("./financialAnalyticsService");

// ==========================
// ALERT THRESHOLDS
// ==========================
const MIN_PRODUCTS = 5;

const HIGH_DEBT = 100000;

const MIN_HEALTH_SCORE = 70;

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
    // NEGATIVE CASH FLOW
    // ==========================
    if (cash.cashPosition < 0) {

        alerts.push({

            level: "CRITICAL",

            title: "Negative Cash Flow",

            message:
                "Cash outflow is greater than cash inflow."

        });

    }

    // ==========================
    // LOW INVENTORY
    // ==========================
    if (snapshot.productCount < MIN_PRODUCTS) {

        alerts.push({

            level: "WARNING",

            title: "Low Inventory",

            message:
                "Your inventory contains fewer than 5 products."

        });

    }

    // ==========================
    // HIGH SUPPLIER DEBT
    // ==========================
    if (debt.creditors > HIGH_DEBT) {

        alerts.push({

            level: "CRITICAL",

            title: "High Supplier Debt",

            message:
                "Outstanding supplier balances are becoming high."

        });

    }

    // ==========================
    // HIGH CUSTOMER DEBT
    // ==========================
    if (debt.debtors > HIGH_DEBT) {

        alerts.push({

            level: "WARNING",

            title: "High Customer Debt",

            message:
                "Large amounts are yet to be collected from customers."

        });

    }

    // ==========================
    // LOW BUSINESS HEALTH
    // ==========================
    if (health.score < MIN_HEALTH_SCORE) {

        alerts.push({

            level: "CRITICAL",

            title: "Business Health",

            message:
                "Overall business health requires immediate attention."

        });

    }

    // ==========================
    // NO ALERTS
    // ==========================
    if (alerts.length === 0) {

        alerts.push({

            level: "INFO",

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