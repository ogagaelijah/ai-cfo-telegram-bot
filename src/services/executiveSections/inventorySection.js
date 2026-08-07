// ==========================
// INVENTORY STATUS SECTION
// ==========================
function buildInventorySection(report) {

    const inventoryValue = report.snapshot.inventoryValue;
    const productCount = report.snapshot.productCount;

    let status = "🟢 Healthy";
    let assessment =
        "Your inventory level appears sufficient for normal business operations.";

    // ==========================
    // LOW INVENTORY
    // ==========================
    if (productCount < 5) {

        status = "🔴 Low Stock";

        assessment =
            "Inventory levels are running low. Consider restocking soon to avoid stockouts.";

    }

    // ==========================
    // HIGH INVENTORY
    // ==========================
    else if (productCount > 200) {

        status = "🟡 Overstocked";

        assessment =
            "Inventory appears higher than normal. Monitor stock turnover to avoid tying up cash.";

    }

    return `📦 INVENTORY STATUS

Inventory Value

₦${inventoryValue.toLocaleString()}

Products in Stock

${productCount}

Status

${status}

Assessment

${assessment}`;

}

module.exports = {

    buildInventorySection

};