const analyticsRepository = require("../repositories/financialAnalyticsRepository");

// ==========================
// BUSINESS SNAPSHOT
// ==========================
function getBusinessSnapshot(telegramId) {

    const userId =
        analyticsRepository.getUserId(telegramId);

    const sales =
        analyticsRepository.getTotalSales(userId);

    const purchases =
        analyticsRepository.getTotalPurchases(userId);

    const costOfGoods =
        analyticsRepository.getCostOfGoodsSold(userId);

    const expenses =
        analyticsRepository.getTotalExpenses(userId);

    const income =
        analyticsRepository.getTotalIncome(userId);

    const inventoryValue =
        analyticsRepository.getInventoryValue(userId);

    const productCount =
        analyticsRepository.getProductCount(userId);

    const supplierCount =
    analyticsRepository.getSupplierCount(userId);

    // ==========================
    // ACCOUNTING CALCULATIONS
    // ==========================

    // Revenue - Cost of Goods Sold
    const grossProfit =
        sales - costOfGoods;

    // Gross Profit Margin
    const grossMargin =
        sales > 0
            ? (grossProfit / sales) * 100
            : 0;

    // Net Profit
    const netProfit =
        grossProfit - expenses + income;

        return {

        sales,

        purchases,

        costOfGoods,

        expenses,

        income,

        grossProfit,

        grossMargin,

        netProfit,

        inventoryValue,

        productCount,

        supplierCount

    };

}

// ==========================
// REVENUE
// ==========================
function getRevenueMetrics(telegramId) {

    const snapshot =
        getBusinessSnapshot(telegramId);

    return {

        sales: snapshot.sales,

        purchases: snapshot.purchases,

        income: snapshot.income

    };

}

// ==========================
// PROFITS
// ==========================
function getProfitMetrics(telegramId) {

    const snapshot =
        getBusinessSnapshot(telegramId);

    return {

        grossProfit: snapshot.grossProfit,

        netProfit: snapshot.netProfit

    };

}

// ==========================
// CASH
// ==========================
function getCashMetrics(telegramId) {

    const snapshot =
        getBusinessSnapshot(telegramId);

    return {

        cashIn:
            snapshot.sales +
            snapshot.income,

        cashOut:
            snapshot.purchases +
            snapshot.expenses,

        cashPosition:
            (snapshot.sales + snapshot.income) -
            (snapshot.purchases + snapshot.expenses)

    };

}

// ==========================
// INVENTORY
// ==========================
function getInventoryMetrics(telegramId) {

    const snapshot =
        getBusinessSnapshot(telegramId);

    return {

        inventoryValue: snapshot.inventoryValue,

        productCount: snapshot.productCount

    };

}

// ==========================
// DEBTS
// ==========================
function getDebtMetrics(telegramId) {

    const userId =
        analyticsRepository.getUserId(telegramId);

    return {

        debtors:
            analyticsRepository.getOutstandingDebtors(userId),

        creditors:
            analyticsRepository.getOutstandingCreditors(userId)

    };

}

// ==========================
// BUSINESS HEALTH
// ==========================
function getBusinessHealth(telegramId) {

    const snapshot =
        getBusinessSnapshot(telegramId);

    const debt =
        getDebtMetrics(telegramId);

    const cash =
        getCashMetrics(telegramId);

    const inventory =
        getInventoryMetrics(telegramId);

    let score = 100;

    const strengths = [];

    const risks = [];

    // ==========================
    // PROFITABILITY
    // ==========================
    if (snapshot.netProfit > 0) {

        strengths.push(
            "Business is profitable."
        );

    } else {

        score -= 20;

        risks.push(
            "Business is operating at a loss."
        );

    }

    // ==========================
    // GROSS MARGIN
    // ==========================
    if (snapshot.grossMargin >= 40) {

        strengths.push(
            "Healthy gross profit margin."
        );

    } else if (snapshot.grossMargin < 20) {

        score -= 10;

        risks.push(
            "Gross margin is low."
        );

    }

    // ==========================
    // EXPENSE CONTROL
    // ==========================
    if (snapshot.sales > 0) {

        const expenseRate =
            (snapshot.expenses / snapshot.sales) * 100;

        if (expenseRate > 60) {

            score -= 10;

            risks.push(
                "Operating expenses are high."
            );

        } else {

            strengths.push(
                "Expenses are under control."
            );

        }

    }

    // ==========================
    // CASH POSITION
    // ==========================
    if (cash.cashPosition >= 0) {

        strengths.push(
            "Positive cash position."
        );

    } else {

        score -= 15;

        risks.push(
            "Negative cash position."
        );

    }

    // ==========================
    // CREDITORS VS DEBTORS
    // ==========================
    if (debt.creditors > debt.debtors) {

        score -= 10;

        risks.push(
            "Supplier debt exceeds customer debt."
        );

    } else {

        strengths.push(
            "Debt levels are balanced."
        );

    }

    // ==========================
    // INVENTORY
    // ==========================
    if (inventory.inventoryValue === 0) {

        score -= 10;

        risks.push(
            "Inventory is empty."
        );

    } else {

        strengths.push(
            "Inventory available for sales."
        );

    }

    // ==========================
    // SCORE LIMITS
    // ==========================
    if (score < 0) score = 0;

    if (score > 100) score = 100;

    // ==========================
    // STATUS
    // ==========================
    let status = "🟢 Excellent";

    if (score < 90)
        status = "🟢 Good";

    if (score < 75)
        status = "🟡 Fair";

    if (score < 60)
        status = "🟠 Poor";

    if (score < 40)
        status = "🔴 Critical";

    return {

        score,

        status,

        strengths,

        risks

    };

}

// ==========================
// KPIs
// ==========================
function getBusinessKPIs(telegramId) {

    const {
        getBusinessKPIs
    } = require("./businessKPIService");

    return getBusinessKPIs(telegramId);

}

// ==========================
// BUSINESS FORECAST
// ==========================
function getBusinessForecast(telegramId) {

    const {
        getBusinessForecast
    } = require("./businessForecastService");

    return getBusinessForecast(telegramId);

}

module.exports = {

    getBusinessSnapshot,

    getRevenueMetrics,

    getProfitMetrics,

    getCashMetrics,

    getInventoryMetrics,

    getDebtMetrics,

    getBusinessHealth,

    getBusinessKPIs,

    getBusinessForecast

};