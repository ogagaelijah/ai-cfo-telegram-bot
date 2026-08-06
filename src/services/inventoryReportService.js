const analytics = require("./financialAnalyticsService");

// ==========================
// INVENTORY REPORT
// ==========================
function getInventoryReport(telegramId) {

    const snapshot =
        analytics.getBusinessSnapshot(telegramId);

    let inventoryStatus =
        "Healthy";

    if (snapshot.inventoryValue === 0) {

        inventoryStatus =
            "Out of Stock";

    } else if (snapshot.productCount < 5) {

        inventoryStatus =
            "Low Variety";

    }

    const averageInventoryValue =

        snapshot.productCount > 0

            ? snapshot.inventoryValue / snapshot.productCount

            : 0;

    return {

        inventoryValue:
            snapshot.inventoryValue,

        productCount:
            snapshot.productCount,

        averageInventoryValue,

        inventoryStatus

    };

}

module.exports = {

    getInventoryReport

};