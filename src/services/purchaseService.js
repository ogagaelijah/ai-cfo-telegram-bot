const purchaseRepository = require("../repositories/purchaseRepository");
const userRepository = require("../repositories/userRepository");
const supplierRepository = require("../repositories/supplierRepository");
const inventoryRepository = require("../repositories/inventoryRepository");
const creditorRepository = require("../repositories/creditorRepository");

// ==========================
// INTERNAL USER ID
// ==========================
function getUserId(telegramId) {

    const user = userRepository.findByTelegramId(telegramId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user.id;

}

// ==========================
// RECORD PURCHASE
// ==========================
function recordPurchase(telegramId, data) {

    const userId = getUserId(telegramId);

    // Find supplier
    const supplier = supplierRepository.findByName(
        userId,
        data.supplierName
    );

    if (!supplier) {
        throw new Error("Supplier not found.");
    }

    // Find inventory item
    const inventory = inventoryRepository.findByProductName(
        userId,
        data.productName
    );

    if (!inventory) {
        throw new Error("Inventory item not found.");
    }

    // Save purchase
    const purchase = purchaseRepository.create({

        userId,

        supplierId: supplier.id,

        inventoryId: inventory.id,

        quantity: data.quantity,

        unitCost: data.unitCost,

        totalAmount: data.totalAmount,

        paymentStatus: data.paymentStatus,

        amountPaid: data.amountPaid,

        balance: data.balance

    });

    // Increase stock
    inventoryRepository.increaseStock(

    inventory.id,

    data.quantity

);

    // Create creditor if balance exists
    if (data.balance > 0) {

        creditorRepository.create({

            userId,

            supplierId: supplier.id,

            purchaseId: purchase.id,

            totalAmount: data.totalAmount,

            amountPaid: data.amountPaid,

            balance: data.balance,

            status:
                data.balance === data.totalAmount
                    ? "UNPAID"
                    : "PARTIAL"

        });

    }

    return purchase;

}

// ==========================
// GET PURCHASES
// ==========================
function getPurchases(telegramId) {

    const userId = getUserId(telegramId);

    return purchaseRepository.findAll(userId);

}

module.exports = {

    recordPurchase,

    getPurchases

};