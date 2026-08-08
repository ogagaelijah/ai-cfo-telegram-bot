const inventoryRepository =
    require("../../repositories/inventoryRepository");

const db =
    require("../../database/database");


// ==========================
// GET INTERNAL USER ID
// ==========================
function getUserId(telegramId) {

    const user =
        db.prepare(`
            SELECT id
            FROM users
            WHERE telegram_id = ?
        `).get(telegramId);


    if (!user) {

        throw new Error(
            "User not found."
        );

    }


    return user.id;

}


// ==========================
// INVENTORY FORECAST ENGINE
// ==========================
function getInventoryForecast(telegramId) {

    // ==========================
    // GET INTERNAL USER ID
    // ==========================
    const userId =
        getUserId(telegramId);


    // ==========================
    // GET INVENTORY
    // ==========================
    const inventory =
        inventoryRepository.findAll(
            userId
        );


    // ==========================
    // NO INVENTORY
    // ==========================
    if (
        !inventory ||
        inventory.length === 0
    ) {

        return {

            totalItems: 0,

            inventoryValue: 0,

            lowStockItems: 0,

            outOfStockItems: 0,

            healthyItems: 0,

            restockUrgency:
                "Unknown",

            estimatedStockoutDays: 0

        };

    }


    // ==========================
    // INVENTORY METRICS
    // ==========================
    let inventoryValue = 0;

    let lowStockItems = 0;

    let outOfStockItems = 0;

    let healthyItems = 0;


    inventory.forEach(item => {

        const quantity =
            Number(item.quantity) || 0;


        const costPrice =
            Number(item.cost_price) || 0;


        inventoryValue +=
            quantity * costPrice;


        // ==========================
        // OUT OF STOCK
        // ==========================
        if (quantity <= 0) {

            outOfStockItems++;

        }


        // ==========================
        // LOW STOCK
        // ==========================
        else if (quantity <= 5) {

            lowStockItems++;

        }


        // ==========================
        // HEALTHY STOCK
        // ==========================
        else {

            healthyItems++;

        }

    });


    // ==========================
    // RESTOCK URGENCY
    // ==========================
    let restockUrgency =
        "Low";


    if (
        outOfStockItems > 0
    ) {

        restockUrgency =
            "Critical";

    }

    else if (
        lowStockItems >= 3
    ) {

        restockUrgency =
            "High";

    }

    else if (
        lowStockItems > 0
    ) {

        restockUrgency =
            "Medium";

    }


    // ==========================
    // ESTIMATED STOCKOUT
    // ==========================
    let estimatedStockoutDays =
        30;


    if (
        restockUrgency === "Critical"
    ) {

        estimatedStockoutDays =
            0;

    }

    else if (
        restockUrgency === "High"
    ) {

        estimatedStockoutDays =
            7;

    }

    else if (
        restockUrgency === "Medium"
    ) {

        estimatedStockoutDays =
            14;

    }


    // ==========================
    // RETURN FORECAST
    // ==========================
    return {

        totalItems:
            inventory.length,

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