const inventoryRepository = require("../../repositories/inventoryRepository");

// ==========================
// INVENTORY FORECAST ENGINE
// ==========================
function getInventoryForecast(userId) {

    const inventory =
        inventoryRepository.findAll(userId);

    if (!inventory.length) {

        return {

            totalItems: 0,

            inventoryValue: 0,

            lowStockItems: 0,

            outOfStockItems: 0,

            healthyItems: 0,

            restockUrgency: "Unknown",

            estimatedStockoutDays: 0

        };

    }

    let inventoryValue = 0;

    let lowStockItems = 0;

    let outOfStockItems = 0;

    let healthyItems = 0;

    inventory.forEach(item => {

        inventoryValue +=
            Number(item.quantity || 0) *
            Number(item.cost_price || 0);

        if (item.quantity <= 0) {

            outOfStockItems++;

        }

        else if (item.quantity <= 5) {

            lowStockItems++;

        }

        else {

            healthyItems++;

        }

    });

    // ==========================
    // RESTOCK URGENCY
    // ==========================
    let restockUrgency = "Low";

    if (outOfStockItems > 0) {

        restockUrgency = "Critical";

    }

    else if (lowStockItems >= 3) {

        restockUrgency = "High";

    }

    else if (lowStockItems > 0) {

        restockUrgency = "Medium";

    }

    // ==========================
    // ESTIMATED STOCKOUT
    // ==========================
    let estimatedStockoutDays = 30;

    if (restockUrgency === "Critical") {

        estimatedStockoutDays = 0;

    }

    else if (restockUrgency === "High") {

        estimatedStockoutDays = 7;

    }

    else if (restockUrgency === "Medium") {

        estimatedStockoutDays = 14;

    }

    return {

        totalItems: inventory.length,

        inventoryValue,

        lowStockItems,

        outOfStockItems,

        healthyItems,

        restockUrgency,

        estimatedStockoutDays

    };

}

module.exports = {

    getInventoryForecast

};