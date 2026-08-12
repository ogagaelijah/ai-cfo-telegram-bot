const analyticsRepository =
    require("../repositories/financialAnalyticsRepository");

// ============================================================
// FINANCIAL ANALYTICS SERVICE
// ============================================================
//
// ACCOUNT-BASED DOMAIN SERVICE
//
// This service is completely interface-independent.
//
// It does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - API
//
// It receives an internal accountId.
//
// Interface adapters are responsible for resolving:
//
// User / Session
//       ↓
// Current Account
//       ↓
// accountId
//
// ============================================================


// ============================================================
// BUSINESS SNAPSHOT
// ============================================================

function getBusinessSnapshot(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    const sales =
        analyticsRepository.getTotalSales(
            accountId
        );


    const purchases =
        analyticsRepository.getTotalPurchases(
            accountId
        );


    const costOfGoods =
        analyticsRepository.getCostOfGoodsSold(
            accountId
        );


    const expenses =
        analyticsRepository.getTotalExpenses(
            accountId
        );


    const income =
        analyticsRepository.getTotalIncome(
            accountId
        );


    const inventoryValue =
        analyticsRepository.getInventoryValue(
            accountId
        );


    const productCount =
        analyticsRepository.getProductCount(
            accountId
        );


    const supplierCount =
        analyticsRepository.getSupplierCount(
            accountId
        );


    // ========================================================
    // ACCOUNTING CALCULATIONS
    // ========================================================

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
        grossProfit -
        expenses +
        income;


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


// ============================================================
// REVENUE METRICS
// ============================================================

function getRevenueMetrics(accountId) {

    const snapshot =
        getBusinessSnapshot(
            accountId
        );


    return {

        sales:
            snapshot.sales,

        purchases:
            snapshot.purchases,

        income:
            snapshot.income

    };

}


// ============================================================
// PROFIT METRICS
// ============================================================

function getProfitMetrics(accountId) {

    const snapshot =
        getBusinessSnapshot(
            accountId
        );


    return {

        grossProfit:
            snapshot.grossProfit,

        netProfit:
            snapshot.netProfit

    };

}


// ============================================================
// CASH METRICS
// ============================================================

function getCashMetrics(accountId) {

    const snapshot =
        getBusinessSnapshot(
            accountId
        );


    return {

        cashIn:
            snapshot.sales +
            snapshot.income,


        cashOut:
            snapshot.purchases +
            snapshot.expenses,


        cashPosition:
            (
                snapshot.sales +
                snapshot.income
            ) -
            (
                snapshot.purchases +
                snapshot.expenses
            )

    };

}


// ============================================================
// INVENTORY METRICS
// ============================================================

function getInventoryMetrics(accountId) {

    const snapshot =
        getBusinessSnapshot(
            accountId
        );


    return {

        inventoryValue:
            snapshot.inventoryValue,

        productCount:
            snapshot.productCount

    };

}


// ============================================================
// DEBT METRICS
// ============================================================

function getDebtMetrics(accountId) {

    return {

        debtors:
            analyticsRepository.getOutstandingDebtors(
                accountId
            ),

        creditors:
            analyticsRepository.getOutstandingCreditors(
                accountId
            )

    };

}


// ============================================================
// BUSINESS HEALTH
// ============================================================

function getBusinessHealth(accountId) {

    const snapshot =
        getBusinessSnapshot(
            accountId
        );


    const debt =
        getDebtMetrics(
            accountId
        );


    const cash =
        getCashMetrics(
            accountId
        );


    const inventory =
        getInventoryMetrics(
            accountId
        );


    let score = 100;


    const strengths = [];


    const risks = [];


    // ========================================================
    // PROFITABILITY
    // ========================================================

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


    // ========================================================
    // GROSS MARGIN
    // ========================================================

    if (snapshot.grossMargin >= 40) {

        strengths.push(
            "Healthy gross profit margin."
        );

    }
    else if (snapshot.grossMargin < 20) {

        score -= 10;

        risks.push(
            "Gross margin is low."
        );

    }


    // ========================================================
    // EXPENSE CONTROL
    // ========================================================

    if (snapshot.sales > 0) {

        const expenseRate =
            (
                snapshot.expenses /
                snapshot.sales
            ) * 100;


        if (expenseRate > 60) {

            score -= 10;

            risks.push(
                "Operating expenses are high."
            );

        }
        else {

            strengths.push(
                "Expenses are under control."
            );

        }

    }


    // ========================================================
    // CASH POSITION
    // ========================================================

    if (cash.cashPosition >= 0) {

        strengths.push(
            "Positive cash position."
        );

    }
    else {

        score -= 15;

        risks.push(
            "Negative cash position."
        );

    }


    // ========================================================
    // CREDITORS VS DEBTORS
    // ========================================================

    if (debt.creditors > debt.debtors) {

        score -= 10;

        risks.push(
            "Supplier debt exceeds customer debt."
        );

    }
    else {

        strengths.push(
            "Debt levels are balanced."
        );

    }


    // ========================================================
    // INVENTORY
    // ========================================================

    if (inventory.inventoryValue === 0) {

        score -= 10;

        risks.push(
            "Inventory is empty."
        );

    }
    else {

        strengths.push(
            "Inventory available for sales."
        );

    }


    // ========================================================
    // SCORE LIMITS
    // ========================================================

    if (score < 0) {

        score = 0;

    }


    if (score > 100) {

        score = 100;

    }


    // ========================================================
    // STATUS
    // ========================================================

    let status =
        "🟢 Excellent";


    if (score < 90) {

        status =
            "🟢 Good";

    }


    if (score < 75) {

        status =
            "🟡 Fair";

    }


    if (score < 60) {

        status =
            "🟠 Poor";

    }


    if (score < 40) {

        status =
            "🔴 Critical";

    }


    return {

        score,

        status,

        strengths,

        risks

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getBusinessSnapshot,

    getRevenueMetrics,

    getProfitMetrics,

    getCashMetrics,

    getInventoryMetrics,

    getDebtMetrics,

    getBusinessHealth

};