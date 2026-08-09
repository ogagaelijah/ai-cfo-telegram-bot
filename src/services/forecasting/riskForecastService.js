// ============================================================
// RISK FORECAST SERVICE
// ============================================================
//
// BUSINESS INTELLIGENCE RISK ENGINE
//
// Responsibilities:
//
// 1. Detect liquidity risks.
// 2. Detect profitability risks.
// 3. Detect revenue risks.
// 4. Detect inventory risks.
// 5. Detect inventory-demand risks.
// 6. Detect forecast/data-quality risks.
// 7. Rank risks by severity.
//
// IMPORTANT:
//
// This service does NOT calculate forecasts.
//
// It only interprets forecast objects produced by:
//
//     forecastEngine.js
//
// ============================================================


// ============================================================
// NUMBER SAFETY
// ============================================================

function toNumber(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


// ============================================================
// ROUND MONEY
// ============================================================

function formatMoney(value) {

    return `₦${Math.round(
        toNumber(value)
    ).toLocaleString()}`;
}


// ============================================================
// SAFE STOCKOUT DAYS
// ============================================================

function formatStockoutDays(value) {

    const days =
        Number(value);

    if (
        !Number.isFinite(days)
    ) {

        return "an unknown number of days";
    }

    return `${days.toFixed(1)} days`;
}


// ============================================================
// SEVERITY PRIORITY
// ============================================================
//
// Lower number = higher priority.
//
// Critical
// Warning
// Info
//
// ============================================================

function getSeverityPriority(
    severity
) {

    switch (severity) {

        case "Critical":
            return 1;

        case "Warning":
            return 2;

        case "Info":
            return 3;

        default:
            return 4;
    }
}


// ============================================================
// SORT RISKS
// ============================================================

function sortRisks(
    risks
) {

    return risks.sort(
        (
            a,
            b
        ) =>
            getSeverityPriority(
                a.severity
            ) -
            getSeverityPriority(
                b.severity
            )
    );
}


// ============================================================
// MAIN RISK ENGINE
// ============================================================

function getRiskForecast(
    userId,
    revenueForecast,
    cashForecast,
    inventoryForecast,
    inventoryDemandForecast,
    profitForecast
) {

    // ========================================================
    // NORMALIZE INPUTS
    // ========================================================

    const revenue =
        revenueForecast || {};

    const cash =
        cashForecast || {};

    const inventory =
        inventoryForecast || {};

    const inventoryDemand =
        inventoryDemandForecast || {};

    const profit =
        profitForecast || {};


    // ========================================================
    // RISK COLLECTION
    // ========================================================

    const risks = [];


    // ========================================================
    // LIQUIDITY / CASH RISKS
    // ========================================================

    const currentCash =
        toNumber(
            cash.currentCash
        );

    const next7DaysCash =
        toNumber(
            cash.next7Days
        );

    const next30DaysCash =
        toNumber(
            cash.next30Days
        );

    const estimatedDailyBurn =
        toNumber(
            cash.estimatedDailyBurn
        );

    const estimatedDailyNetCashFlow =
        toNumber(
            cash.estimatedDailyNetCashFlow
        );

    const cashTrend =
        cash.cashTrend;


    // --------------------------------------------------------
    // CURRENT NEGATIVE CASH
    // --------------------------------------------------------

    if (
        currentCash < 0
    ) {

        risks.push({

            severity:
                "Critical",

            category:
                "Liquidity",

            title:
                "Cash Flow Risk",

            message:
                `Cash is currently negative at ${formatMoney(
                    currentCash
                )}. Immediate attention is required to improve liquidity.`

        });

    }


    // --------------------------------------------------------
    // PROJECTED 7-DAY CASH SHORTAGE
    // --------------------------------------------------------

    else if (
        next7DaysCash < 0
    ) {

        risks.push({

            severity:
                "Critical",

            category:
                "Liquidity",

            title:
                "Projected Cash Shortage",

            message:
                `Cash is projected to become negative within seven days, reaching approximately ${formatMoney(
                    next7DaysCash
                )}.`

        });

    }


    // --------------------------------------------------------
    // PROJECTED 30-DAY CASH PRESSURE
    // --------------------------------------------------------

    else if (
        next30DaysCash < 0
    ) {

        risks.push({

            severity:
                "Warning",

            category:
                "Liquidity",

            title:
                "Future Cash Pressure",

            message:
                "Current cash levels may become insufficient within 30 days if the current cash-flow pattern continues."

        });

    }


    // --------------------------------------------------------
    // DAILY CASH BURN / DECLINING CASH FLOW
    // --------------------------------------------------------

    if (
        currentCash >= 0 &&
        (
            estimatedDailyNetCashFlow < 0 ||
            cashTrend === "Declining"
        )
    ) {

        let dailyLoss =
            Math.abs(
                estimatedDailyNetCashFlow
            );


        if (
            dailyLoss === 0 &&
            estimatedDailyBurn > 0
        ) {

            dailyLoss =
                estimatedDailyBurn;
        }


        const message =
            dailyLoss > 0
                ? `The business is currently experiencing declining cash flow, with an estimated cash outflow of approximately ${formatMoney(
                    dailyLoss
                )} per day.`
                : "The business is currently experiencing declining cash flow. Cash generation should be monitored closely.";


        risks.push({

            severity:
                "Warning",

            category:
                "Liquidity",

            title:
                "Declining Cash Flow",

            message

        });

    }


    // ========================================================
    // REVENUE RISKS
    // ========================================================

    const revenueTrend =
        revenue.trend;

    const revenueConfidence =
        toNumber(
            revenue.confidence
        );

    const activeSalesDays =
        toNumber(
            revenue.activeSalesDays
        );

    const growthRate =
        toNumber(
            revenue.growthRate
        );


    // --------------------------------------------------------
    // DECLINING REVENUE
    // --------------------------------------------------------

    const revenueIsDeclining =
        revenueTrend === "Declining" ||
        (
            growthRate < 0 &&
            revenueTrend !== "No Data" &&
            revenueTrend !== "Insufficient Data"
        );


    if (
        revenueIsDeclining
    ) {

        risks.push({

            severity:
                "Warning",

            category:
                "Revenue",

            title:
                "Sales Trend",

            message:
                "Sales are trending downward compared with the earlier period."

        });

    }


    // --------------------------------------------------------
    // INSUFFICIENT REVENUE HISTORY
    // --------------------------------------------------------

    if (
        revenueTrend === "Insufficient Data"
    ) {

        risks.push({

            severity:
                "Info",

            category:
                "Revenue",

            title:
                "Limited Revenue History",

            message:
                `Revenue forecasting is currently based on only ${activeSalesDays} active selling day(s). Forecast reliability will improve as more sales are recorded.`

        });

    }


    // --------------------------------------------------------
    // LOW FORECAST CONFIDENCE
    // --------------------------------------------------------

    if (
        revenueConfidence < 65 &&
        revenueTrend !== "No Data" &&
        revenueTrend !== undefined &&
        revenueTrend !== null
    ) {

        risks.push({

            severity:
                "Info",

            category:
                "Data Quality",

            title:
                "Revenue Forecast Confidence",

            message:
                `Revenue forecast confidence is currently ${revenueConfidence}%. More historical sales data is required for stronger forecasting reliability.`

        });

    }


    // ========================================================
    // PROFITABILITY RISKS
    // ========================================================

    const tomorrowProfit =
        toNumber(
            profit.tomorrowProfit
        );

    const tomorrowGrossMargin =
        toNumber(
            profit.tomorrowGrossMargin
        );

    const tomorrowProfitMargin =
        toNumber(
            profit.tomorrowProfitMargin
        );

    const profitStatus =
        profit.status;


    // --------------------------------------------------------
    // FORECASTED LOSS
    // --------------------------------------------------------

    if (
        tomorrowProfit < 0 ||
        profitStatus === "Loss"
    ) {

        risks.push({

            severity:
                "Critical",

            category:
                "Profitability",

            title:
                "Projected Loss",

            message:
                `The business is projected to lose approximately ${formatMoney(
                    Math.abs(
                        tomorrowProfit
                    )
                )} on the next forecast day.`

        });

    }


    // --------------------------------------------------------
    // BREAK-EVEN
    // --------------------------------------------------------

    else if (
        tomorrowProfit === 0 ||
        profitStatus === "Break-even"
    ) {

        risks.push({

            severity:
                "Warning",

            category:
                "Profitability",

            title:
                "Break-even Forecast",

            message:
                "The business is currently forecast to break even. There is little margin for unexpected costs or revenue weakness."

        });

    }


    // --------------------------------------------------------
    // LOW GROSS MARGIN
    // --------------------------------------------------------

    if (
        tomorrowGrossMargin > 0 &&
        tomorrowGrossMargin < 20
    ) {

        risks.push({

            severity:
                "Warning",

            category:
                "Profitability",

            title:
                "Low Gross Margin",

            message:
                `Forecast gross margin is approximately ${tomorrowGrossMargin.toFixed(
                    1
                )}%. Product costs may be putting pressure on profitability.`

        });

    }


    // --------------------------------------------------------
    // LOW NET PROFIT MARGIN
    // --------------------------------------------------------

    if (
        tomorrowProfitMargin > 0 &&
        tomorrowProfitMargin < 10
    ) {

        risks.push({

            severity:
                "Warning",

            category:
                "Profitability",

            title:
                "Low Net Profit Margin",

            message:
                `Forecast net profit margin is approximately ${tomorrowProfitMargin.toFixed(
                    1
                )}%. Operating costs or product costs may be leaving the business with limited profit protection.`

        });

    }


    // ========================================================
    // BASIC INVENTORY RISKS
    // ========================================================

    const restockUrgency =
        inventory.restockUrgency;


    // --------------------------------------------------------
    // CRITICAL INVENTORY
    // --------------------------------------------------------

    if (
        restockUrgency === "Critical"
    ) {

        risks.push({

            severity:
                "Critical",

            category:
                "Inventory",

            title:
                "Inventory Risk",

            message:
                "One or more products are currently out of stock and may affect future sales."

        });

    }


    // --------------------------------------------------------
    // HIGH INVENTORY PRESSURE
    // --------------------------------------------------------

    else if (
        restockUrgency === "High"
    ) {

        risks.push({

            severity:
                "Warning",

            category:
                "Inventory",

            title:
                "Inventory Pressure",

            message:
                "Several products are approaching low-stock levels and may require restocking soon."

        });

    }


    // --------------------------------------------------------
    // MEDIUM INVENTORY PRESSURE
    // --------------------------------------------------------

    else if (
        restockUrgency === "Medium"
    ) {

        risks.push({

            severity:
                "Info",

            category:
                "Inventory",

            title:
                "Inventory Monitoring",

            message:
                "Some products are approaching low-stock levels and should be monitored for timely restocking."

        });

    }


    // ========================================================
    // INVENTORY DEMAND RISKS
    // ========================================================

    const demandProducts =
        Array.isArray(
            inventoryDemand.products
        )
            ? inventoryDemand.products
            : [];


    // --------------------------------------------------------
    // URGENT REORDERS
    // --------------------------------------------------------

    const urgentProducts =
        demandProducts.filter(
            product =>
                product &&
                product.reorderRecommendation ===
                    "Urgent"
        );


    urgentProducts.forEach(
        product => {

            risks.push({

                severity:
                    "Critical",

                category:
                    "Inventory Demand",

                title:
                    `Urgent Product Reorder: ${product.productName}`,

                message:
                    `${product.productName} is projected to run out of stock in approximately ${formatStockoutDays(
                        product.estimatedStockoutDays
                    )} at the current demand rate. Immediate restocking is recommended.`

            });

        }
    );


    // --------------------------------------------------------
    // REORDER IMMEDIATELY
    // --------------------------------------------------------

    const immediateProducts =
        demandProducts.filter(
            product =>
                product &&
                product.reorderRecommendation ===
                    "Reorder Immediately"
        );


    immediateProducts.forEach(
        product => {

            risks.push({

                severity:
                    "Critical",

                category:
                    "Inventory Demand",

                title:
                    `Immediate Product Reorder: ${product.productName}`,

                message:
                    `${product.productName} is expected to require immediate restocking. Current demand indicates that existing inventory may not be sufficient.`

            });

        }
    );


    // --------------------------------------------------------
    // REORDER SOON
    // --------------------------------------------------------

    const reorderSoonProducts =
        demandProducts.filter(
            product =>
                product &&
                product.reorderRecommendation ===
                    "Reorder Soon"
        );


    reorderSoonProducts.forEach(
        product => {

            risks.push({

                severity:
                    "Warning",

                category:
                    "Inventory Demand",

                title:
                    `Upcoming Product Stockout: ${product.productName}`,

                message:
                    `${product.productName} is projected to run out of stock in approximately ${formatStockoutDays(
                        product.estimatedStockoutDays
                    )}. Consider restocking soon.`

            });

        }
    );


    // ========================================================
    // INVENTORY DEMAND DATA QUALITY
    // ========================================================

    const lowConfidenceDemandProducts =
        demandProducts.filter(
            product =>
                toNumber(
                    product?.confidence
                ) < 50
        );


    if (
        lowConfidenceDemandProducts.length > 0
    ) {

        risks.push({

            severity:
                "Info",

            category:
                "Data Quality",

            title:
                "Inventory Demand Confidence",

            message:
                `Product demand predictions are currently based on limited sales history for ${lowConfidenceDemandProducts.length} product(s). Forecast accuracy will improve as more sales data is recorded.`

        });

    }


    // ========================================================
    // SORT RISKS
    // ========================================================

    sortRisks(
        risks
    );


    // ========================================================
    // NO SIGNIFICANT RISKS
    // ========================================================

    if (
        risks.length === 0
    ) {

        risks.push({

            severity:
                "Info",

            category:
                "Business Outlook",

            title:
                "Business Outlook",

            message:
                "No significant financial, operational, or inventory risks are currently predicted."

        });

    }


    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "⚠️ RISK FORECAST"
    );

    console.log(
        "Total Risks:",
        risks.length
    );

    console.log(
        "Critical Risks:",
        risks.filter(
            risk =>
                risk.severity ===
                "Critical"
        ).length
    );

    console.log(
        "Warning Risks:",
        risks.filter(
            risk =>
                risk.severity ===
                "Warning"
        ).length
    );

    console.log(
        "Info Risks:",
        risks.filter(
            risk =>
                risk.severity ===
                "Info"
        ).length
    );


    // ========================================================
    // RETURN
    // ========================================================

    return risks;
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getRiskForecast

};