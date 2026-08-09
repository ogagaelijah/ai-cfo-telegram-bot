// ============================================================
// RISK FORECAST SERVICE
// ============================================================
//
// This service ONLY analyzes forecast objects that have already
// been calculated by forecastEngine.js.
//
// It does NOT call any other forecast service.
//
// ============================================================
//
// FORECAST DATA RECEIVED:
//
// revenueForecast
// cashForecast
// inventoryForecast
// inventoryDemandForecast
//
// ============================================================

function getRiskForecast(
    userId,
    revenueForecast,
    cashForecast,
    inventoryForecast,
    inventoryDemandForecast
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


    // ========================================================
    // RISK COLLECTION
    // ========================================================

    const risks = [];


    // ========================================================
    // CASH RISKS
    // ========================================================

    const currentCash =
        Number(
            cash.currentCash
        ) || 0;


    const next7DaysCash =
        Number(
            cash.next7Days
        ) || 0;


    const next30DaysCash =
        Number(
            cash.next30Days
        ) || 0;


    const estimatedDailyBurn =
        Number(
            cash.estimatedDailyBurn
        ) || 0;


    // --------------------------------------------------------
    // CURRENT NEGATIVE CASH
    // --------------------------------------------------------

    if (
        currentCash < 0
    ) {

        risks.push({

            severity:
                "Critical",

            title:
                "Cash Flow Risk",

            message:
                `Cash is currently negative at ₦${Math.round(
                    currentCash
                ).toLocaleString()}. Immediate attention is required to improve liquidity.`

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

            title:
                "Projected Cash Shortage",

            message:
                `Cash is projected to become negative within seven days, reaching approximately ₦${Math.round(
                    next7DaysCash
                ).toLocaleString()}.`

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

            title:
                "Future Cash Pressure",

            message:
                "Current cash levels may become insufficient within 30 days if the current cash-flow pattern continues."

        });

    }


    // --------------------------------------------------------
    // DECLINING CASH FLOW
    // --------------------------------------------------------

    if (
        cash.cashTrend === "Declining" &&
        currentCash >= 0
    ) {

        risks.push({

            severity:
                "Warning",

            title:
                "Declining Cash Flow",

            message:
                `Cash flow is declining, with an estimated daily cash burn of approximately ₦${Math.round(
                    estimatedDailyBurn
                ).toLocaleString()}.`

        });

    }


    // ========================================================
    // REVENUE RISKS
    // ========================================================

    const revenueTrend =
        revenue.trend;


    const revenueConfidence =
        Number(
            revenue.confidence
        ) || 0;


    // --------------------------------------------------------
    // DECLINING SALES
    // --------------------------------------------------------

    if (
        revenueTrend === "Declining"
    ) {

        risks.push({

            severity:
                "Warning",

            title:
                "Sales Trend",

            message:
                "Sales are trending downward compared with the earlier period."

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

            title:
                "Forecast Confidence",

            message:
                "Revenue forecasting confidence is currently limited because there is not yet enough historical transaction data."

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

            title:
                "Inventory Monitoring",

            message:
                "Some products are approaching low-stock levels and should be monitored for timely restocking."

        });

    }


    // ========================================================
    // PRODUCT DEMAND RISKS
    // ========================================================
    //
    // This is the new intelligence layer.
    //
    // It looks at predicted demand rather than simply
    // checking whether current stock is below a fixed
    // threshold.
    //
    // ========================================================

    const demandProducts =
        Array.isArray(
            inventoryDemand.products
        )
            ? inventoryDemand.products
            : [];


    // --------------------------------------------------------
    // PRODUCTS REQUIRING REORDER
    // --------------------------------------------------------

    const reorderProducts =
        demandProducts.filter(
            product => {

                return (
                    product.reorderRecommendation ===
                        "Reorder Immediately"

                    ||

                    product.reorderRecommendation ===
                        "Urgent"

                    ||

                    product.reorderRecommendation ===
                        "Reorder Soon"
                );

            }
        );


    // --------------------------------------------------------
    // URGENT PRODUCTS
    // --------------------------------------------------------

    const urgentProducts =
        demandProducts.filter(
            product =>
                product.reorderRecommendation ===
                "Urgent"
        );


    if (
        urgentProducts.length > 0
    ) {

        urgentProducts.forEach(
            product => {

                const stockoutDays =
                    Number(
                        product.estimatedStockoutDays
                    );


                const stockoutText =
                    Number.isFinite(
                        stockoutDays
                    )
                        ? `${stockoutDays.toFixed(1)} days`
                        : "an unknown number of days";


                risks.push({

                    severity:
                        "Critical",

                    title:
                        `Urgent Product Reorder: ${product.productName}`,

                    message:
                        `${product.productName} is projected to run out of stock in approximately ${stockoutText} at the current demand rate. Immediate restocking is recommended.`

                });

            }
        );

    }


    // --------------------------------------------------------
    // PRODUCTS REQUIRING REORDER SOON
    // --------------------------------------------------------

    const reorderSoonProducts =
        demandProducts.filter(
            product =>
                product.reorderRecommendation ===
                "Reorder Soon"
        );


    if (
        reorderSoonProducts.length > 0
    ) {

        reorderSoonProducts.forEach(
            product => {

                const stockoutDays =
                    Number(
                        product.estimatedStockoutDays
                    );


                const stockoutText =
                    Number.isFinite(
                        stockoutDays
                    )
                        ? `${stockoutDays.toFixed(1)} days`
                        : "an unknown number of days";


                risks.push({

                    severity:
                        "Warning",

                    title:
                        `Upcoming Product Stockout: ${product.productName}`,

                    message:
                        `${product.productName} is projected to run out of stock in approximately ${stockoutText} at the current demand rate. Consider restocking soon.`

                });

            }
        );

    }


    // --------------------------------------------------------
    // DEMAND FORECAST DATA QUALITY
    // --------------------------------------------------------

    const lowConfidenceDemandProducts =
        demandProducts.filter(
            product =>
                Number(
                    product.confidence
                ) < 50
        );


    if (
        lowConfidenceDemandProducts.length > 0
    ) {

        risks.push({

            severity:
                "Info",

            title:
                "Inventory Demand Confidence",

            message:
                `Product demand predictions are currently based on limited sales history for ${lowConfidenceDemandProducts.length} product(s). Forecast accuracy will improve as more sales data is recorded.`

        });

    }


    // ========================================================
    // NO SIGNIFICANT RISKS
    // ========================================================

    if (
        risks.length === 0
    ) {

        risks.push({

            severity:
                "Info",

            title:
                "Business Outlook",

            message:
                "No significant financial or inventory risks are currently predicted."

        });

    }


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