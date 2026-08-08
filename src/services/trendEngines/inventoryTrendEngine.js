const inventoryRepository =
require("../../repositories/inventoryRepository");

// ==========================
// INVENTORY TREND ENGINE
// ==========================
function getInventoryTrend(userId) {

    const items =
        inventoryRepository.findAll(userId);

    let totalQuantity = 0;

    for (const item of items) {

        totalQuantity += item.quantity;

    }

    let direction = "Healthy";

    if (totalQuantity < 20) {

        direction = "Low Stock";

    }

    return {

        totalQuantity,

        direction

    };

}

module.exports = {

    getInventoryTrend

};