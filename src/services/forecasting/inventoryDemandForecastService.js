const inventoryRepository =
require("../../repositories/inventoryRepository");

const trendsRepository =
require("../../repositories/businessTrendsRepository");

// ============================================================
// INVENTORY DEMAND FORECAST SERVICE
// ============================================================
//
// Predicts future product demand using historical sales.
//
// This service:
// - DOES NOT modify inventory
// - DOES NOT calculate revenue
// - DOES NOT calculate cash
// - DOES NOT calculate profit
// - DOES NOT calculate risk
//
// It only predicts product demand.
//
// ============================================================

// ============================================================
// CONSTANTS
// ============================================================

const HISTORY_DAYS = 30;

const FORECAST_DAYS_7 = 7;

const FORECAST_DAYS_30 = 30;

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
// ROUND NUMBER
// ============================================================

function round(value, decimals = 2) {

    const multiplier =
        Math.pow(
            10,
            decimals
        );

    return Math.round(
        toNumber(value) *
        multiplier
    ) / multiplier;

}

// ============================================================
// CALCULATE AVERAGE
// ============================================================

function calculateAverage(values) {

    if (
        !Array.isArray(values) ||
        values.length === 0
    ) {

        return 0;

    }

    const numbers =
        values.map(
            toNumber
        );

    const total =
        numbers.reduce(
            (
                sum,
                value
            ) =>
                sum + value,
            0
        );

    return (
        total /
        numbers.length
    );

}

// ============================================================
// NORMALIZE DEMAND HISTORY
// ============================================================

function normalizeDemandHistory(history) {

    if (
        !Array.isArray(history)
    ) {

        return [];

    }

    return history
        .map(row => {

            const productName =
                row.product_name ??
                row.productName ??
                row.item ??
                row.product ??
                null;

            const date =
                row.date ??
                row.sale_date ??
                row.saleDate ??
                null;

            const quantity =
                row.quantity ??
                row.units ??
                row.qty ??
                0;

            return {

                productName:
                    productName
                        ? String(
                            productName
                        ).trim()
                        : null,

                date,

                quantity:
                    toNumber(
                        quantity
                    )

            };

        })
        .filter(row =>
            row.productName &&
            row.quantity > 0
        );

}

// ============================================================
// GROUP HISTORY BY PRODUCT
// ============================================================

function groupDemandByProduct(history) {

    const grouped =
        new Map();

    history.forEach(row => {

        if (
            !grouped.has(
                row.productName
            )
        ) {

            grouped.set(
                row.productName,
                []
            );

        }

        grouped
            .get(
                row.productName
            )
            .push(row);

    });

    return grouped;

}

// ============================================================
// CALCULATE DEMAND TREND
// ============================================================

function calculateDemandTrend(history) {

    if (
        !Array.isArray(history) ||
        history.length < 4
    ) {

        return "Insufficient Data";

    }

    const midpoint =
        Math.floor(
            history.length / 2
        );

    const firstHalf =
        history.slice(
            0,
            midpoint
        );

    const secondHalf =
        history.slice(
            midpoint
        );

    const firstAverage =
        calculateAverage(
            firstHalf.map(
                row =>
                    row.quantity
            )
        );

    const secondAverage =
        calculateAverage(
            secondHalf.map(
                row =>
                    row.quantity
            )
        );

    if (
        firstAverage <= 0
    ) {

        return secondAverage > 0
            ? "Growing"
            : "Stable";

    }

    const percentageChange =
        (
            (
                secondAverage -
                firstAverage
            ) /
            firstAverage
        ) *
        100;

    // --------------------------------------------------
    // SMALL SAMPLE
    // --------------------------------------------------
    //
    // With fewer than 7 observations, require stronger
    // evidence before declaring a trend.
    //
    // This prevents small fluctuations from being
    // interpreted as a genuine business trend.
    // --------------------------------------------------

    const trendThreshold =
        history.length < 7
            ? 20
            : 10;

    if (
        percentageChange >=
        trendThreshold
    ) {

        return "Growing";

    }

    if (
        percentageChange <=
        -trendThreshold
    ) {

        return "Declining";

    }

    return "Stable";

}

// ============================================================
// CALCULATE CONFIDENCE
// ============================================================

function calculateConfidence(observationCount) {

    const count =
        toNumber(
            observationCount
        );

    if (
        count <= 0
    ) {

        return 0;

    }

    if (
        count < 3
    ) {

        return 30;

    }

    if (
        count < 7
    ) {

        return 50;

    }

    if (
        count < 14
    ) {

        return 70;

    }

    if (
        count < 21
    ) {

        return 85;

    }

    return 95;

}

// ============================================================
// AVERAGE DAILY DEMAND
// ============================================================

function calculateAverageDailyDemand(history) {

    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        return 0;

    }

    return calculateAverage(
        history.map(
            row =>
                row.quantity
        )
    );

}

// ============================================================
// REORDER RECOMMENDATION
// ============================================================

function getReorderRecommendation(
    currentStock,
    stockoutDays
) {

    const stock =
        toNumber(
            currentStock
        );

    const days =
        stockoutDays === Infinity
            ? Infinity
            : toNumber(
                stockoutDays
            );

    if (
        stock <= 0
    ) {

        return "Reorder Immediately";

    }

    // --------------------------------------------------
    // URGENT
    // --------------------------------------------------
    //
    // Ten days or less of stock remaining means the
    // business should act quickly.
    // --------------------------------------------------

    if (
        days <= 10
    ) {

        return "Urgent";

    }

    // --------------------------------------------------
    // REORDER SOON
    // --------------------------------------------------

    if (
        days <= 14
    ) {

        return "Reorder Soon";

    }

    // --------------------------------------------------
    // MONITOR
    // --------------------------------------------------

    if (
        days <= 30
    ) {

        return "Monitor";

    }

    return "No Immediate Reorder";

}

// ============================================================
// FORECAST ONE PRODUCT
// ============================================================

function forecastProduct(
    inventoryItem,
    demandHistory
) {

    const currentStock =
        toNumber(
            inventoryItem.quantity
        );

    const averageDailyDemand =
        calculateAverageDailyDemand(
            demandHistory
        );

    const observationCount =
        demandHistory.length;

    const demandTrend =
        calculateDemandTrend(
            demandHistory
        );

    const confidence =
        calculateConfidence(
            observationCount
        );

    // --------------------------------------------------------
    // PROJECTED DEMAND
    // --------------------------------------------------------

    const next7DaysDemand =
        averageDailyDemand *
        FORECAST_DAYS_7;

    const next30DaysDemand =
        averageDailyDemand *
        FORECAST_DAYS_30;

    // --------------------------------------------------------
    // STOCKOUT ESTIMATE
    // --------------------------------------------------------

    let estimatedStockoutDays =
        Infinity;

    if (
        currentStock <= 0
    ) {

        estimatedStockoutDays =
            0;

    }

    else if (
        averageDailyDemand > 0
    ) {

        estimatedStockoutDays =
            currentStock /
            averageDailyDemand;

    }

    // --------------------------------------------------------
    // REORDER
    // --------------------------------------------------------

    const reorderRecommendation =
        getReorderRecommendation(
            currentStock,
            estimatedStockoutDays
        );

    // --------------------------------------------------------
    // DEMAND STATUS
    // --------------------------------------------------------

    let demandStatus =
        "Normal";

    if (
        averageDailyDemand <= 0
    ) {

        demandStatus =
            "No Recent Demand";

    }

    else if (
        demandTrend === "Growing"
    ) {

        demandStatus =
            "Increasing";

    }

    else if (
        demandTrend === "Declining"
    ) {

        demandStatus =
            "Declining";

    }

    return {

        productId:
            inventoryItem.id,

        productName:
            inventoryItem.product_name,

        currentStock,

        averageDailyDemand:
            round(
                averageDailyDemand
            ),

        next7DaysDemand:
            round(
                next7DaysDemand
            ),

        next30DaysDemand:
            round(
                next30DaysDemand
            ),

        demandTrend,

        demandStatus,

        estimatedStockoutDays:
            estimatedStockoutDays === Infinity
                ? null
                : round(
                    estimatedStockoutDays
                ),

        reorderRecommendation,

        confidence,

        observations:
            observationCount

    };

}

// ============================================================
// INVENTORY DEMAND FORECAST
// ============================================================

function getInventoryDemandForecast(telegramId) {

    // ========================================================
    // INTERNAL USER
    // ========================================================

    const userId =
        trendsRepository.getUserId(
            telegramId
        );

    // ========================================================
    // INVENTORY
    // ========================================================

    const inventory =
        inventoryRepository.findAll(
            userId
        );

    // ========================================================
    // NO INVENTORY
    // ========================================================

    if (
        !Array.isArray(inventory) ||
        inventory.length === 0
    ) {

        console.log(
            "📦 INVENTORY DEMAND FORECAST: No Inventory"
        );

        return {

            historyDays:
                HISTORY_DAYS,

            products:
                [],

            totalProducts:
                0,

            productsRequiringReorder:
                0,

            status:
                "No Inventory"

        };

    }

    // ========================================================
    // PRODUCT DEMAND HISTORY
    // ========================================================

    const rawDemandHistory =
        trendsRepository.getProductDailyDemand(
            telegramId,
            HISTORY_DAYS
        );

    const demandHistory =
        normalizeDemandHistory(
            rawDemandHistory
        );

    // ========================================================
    // GROUP DEMAND
    // ========================================================

    const groupedDemand =
        groupDemandByProduct(
            demandHistory
        );

    // ========================================================
    // FORECAST PRODUCTS
    // ========================================================

    const products =
        inventory.map(
            inventoryItem => {

                const productName =
                    String(
                        inventoryItem.product_name
                    ).trim();

                const productHistory =
                    groupedDemand.get(
                        productName
                    ) || [];

                return forecastProduct(
                    inventoryItem,
                    productHistory
                );

            }
        );

    // ========================================================
    // REORDER COUNT
    // ========================================================

    const productsRequiringReorder =
        products.filter(
            product =>

                product.reorderRecommendation ===
                    "Reorder Immediately"

                ||

                product.reorderRecommendation ===
                    "Urgent"

                ||

                product.reorderRecommendation ===
                    "Reorder Soon"

        ).length;

    // ========================================================
    // OVERALL STATUS
    // ========================================================

    let status =
        "Healthy";

    if (
        productsRequiringReorder > 0
    ) {

        status =
            "Reorder Required";

    }

    // ========================================================
    // DEBUG
    // ========================================================

    console.log(
        "📦 INVENTORY DEMAND FORECAST"
    );

    console.log(
        "Products:",
        products.length
    );

    console.log(
        "Products Requiring Reorder:",
        productsRequiringReorder
    );

    // ========================================================
    // RETURN
    // ========================================================

    return {

        historyDays:
            HISTORY_DAYS,

        products,

        totalProducts:
            products.length,

        productsRequiringReorder,

        status

    };

}

// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getInventoryDemandForecast

};