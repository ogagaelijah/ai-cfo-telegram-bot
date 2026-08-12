const inventoryRepository =
    require("../../repositories/inventoryRepository");

// ============================================================
// INVENTORY TREND ENGINE
// ============================================================
//
// ACCOUNT-BASED INTELLIGENCE
//
// Receives accountId directly.
//
// It does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - Sessions
//
// ============================================================

function getInventoryTrend(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    const items =
        inventoryRepository.findAll(
            accountId
        );


    let totalQuantity = 0;


    for (
        const item of items
    ) {

        totalQuantity +=
            Number(item.quantity) || 0;

    }


    let direction =
        "Healthy";


    if (
        totalQuantity < 20
    ) {

        direction =
            "Low Stock";

    }


    return {

        totalQuantity,

        direction

    };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getInventoryTrend

};