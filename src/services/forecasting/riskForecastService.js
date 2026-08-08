// ============================================================
// RISK FORECAST SERVICE
// ============================================================
//
// This service ONLY analyzes forecast objects that have already
// been calculated by forecastEngine.js.
//
// IMPORTANT:
//
// This file must NOT require:
//
// - forecastEngine
// - revenueForecastService
// - cashForecastService
// - inventoryForecastService
// - profitForecastService
//
// All required forecast data is passed into getRiskForecast().
//
// This keeps the forecasting architecture:
//
// forecastEngine
//      |
//      ├── revenueForecastService
//      ├── cashForecastService
//      ├── inventoryForecastService
//      ├── profitForecastService
//      └── riskForecastService
//
// ============================================================


// ============================================================
// BUILD RISK FORECAST
// ============================================================

function getRiskForecast(
    userId,
    revenueForecast,
    cashForecast,
    inventoryForecast
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
                `Cash flow is currently negative, with an estimated daily cash burn of approximately ₦${Math.round(
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
    // INVENTORY RISKS
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
                "No significant financial risks are currently predicted."

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