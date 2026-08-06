const purchaseRepository = require("../repositories/purchaseRepository");
const userRepository = require("../repositories/userRepository");
const supplierRepository = require("../repositories/supplierRepository");
const inventoryRepository = require("../repositories/inventoryRepository");
const creditorRepository = require("../repositories/creditorRepository");

// ==========================
// INTERNAL USER ID
// ==========================
function getUserId(telegramId) {

    const user =
        userRepository.findByTelegramId(telegramId);

    if (!user) {

        throw new Error("User not found.");

    }

    return user.id;

}

// ==========================
// RECORD PURCHASE
// ==========================
function recordPurchase(telegramId, data) {

    if (Number(data.quantity) <= 0) {

        throw new Error("Quantity must be greater than zero.");

    }

    if (Number(data.unitCost) < 0) {

        throw new Error("Unit cost cannot be negative.");

    }

    if (Number(data.totalAmount) < 0) {

        throw new Error("Total amount cannot be negative.");

    }

    if (Number(data.amountPaid) < 0) {

        throw new Error("Amount paid cannot be negative.");

    }

    if (Number(data.balance) < 0) {

        throw new Error("Balance cannot be negative.");

    }

    const userId =
        getUserId(telegramId);

    const supplier =
        supplierRepository.findByName(

            userId,

            data.supplierName.trim()

        );

    if (!supplier) {

        throw new Error("Supplier not found.");

    }

    const inventory =
        inventoryRepository.findByProductName(

            userId,

            data.productName.trim()

        );

    if (!inventory) {

        throw new Error("Inventory item not found.");

    }

    const purchase =
        purchaseRepository.create({

            userId,

            supplierId: supplier.id,

            inventoryId: inventory.id,

            quantity: Number(data.quantity),

            unitCost: Number(data.unitCost),

            totalAmount: Number(data.totalAmount),

            paymentStatus: data.paymentStatus,

            amountPaid: Number(data.amountPaid),

            balance: Number(data.balance)

        });

    inventoryRepository.increaseStock(

        inventory.id,

        Number(data.quantity)

    );

    if (Number(data.balance) > 0) {

        creditorRepository.create({

            userId,

            supplierId: supplier.id,

            purchaseId: purchase.id,

            totalAmount: Number(data.totalAmount),

            amountPaid: Number(data.amountPaid),

            balance: Number(data.balance),

            status:

                Number(data.balance) === Number(data.totalAmount)

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

    return purchaseRepository.findAll(

        getUserId(telegramId)

    );

}

module.exports = {

    recordPurchase,

    getPurchases

};