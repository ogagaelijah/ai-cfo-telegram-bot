const purchaseRepository =
    require("../repositories/purchaseRepository");

const supplierRepository =
    require("../repositories/supplierRepository");

const inventoryRepository =
    require("../repositories/inventoryRepository");

const creditorRepository =
    require("../repositories/creditorRepository");

const accountContext =
    require("./accountContext");

// ======================================================
// RECORD PURCHASE
// ======================================================

function recordPurchase(
    telegramId,
    data
) {

    if (!data) {

        throw new Error(
            "Purchase data is required."
        );

    }

    if (
        Number(data.quantity) <= 0
    ) {

        throw new Error(
            "Quantity must be greater than zero."
        );

    }

    if (
        Number(data.unitCost) < 0
    ) {

        throw new Error(
            "Unit cost cannot be negative."
        );

    }

    if (
        Number(data.totalAmount) < 0
    ) {

        throw new Error(
            "Total amount cannot be negative."
        );

    }

    if (
        Number(data.amountPaid) < 0
    ) {

        throw new Error(
            "Amount paid cannot be negative."
        );

    }

    if (
        Number(data.balance) < 0
    ) {

        throw new Error(
            "Balance cannot be negative."
        );

    }

    // ==================================================
    // CURRENT ACCOUNT
    // ==================================================

    const account =
        accountContext.requireAccount(
            telegramId
        );

    const accountId =
        account.accountId;

    // ==================================================
    // SUPPLIER
    // ==================================================

    const supplier =
        supplierRepository.findByName(

            accountId,

            data.supplierName.trim()

        );

    if (!supplier) {

        throw new Error(
            "Supplier not found."
        );

    }

    // ==================================================
    // INVENTORY
    // ==================================================

    const inventory =
        inventoryRepository.findByProductName(

            accountId,

            data.productName.trim()

        );

    if (!inventory) {

        throw new Error(
            "Inventory item not found."
        );

    }

    // ==================================================
    // CREATE PURCHASE
    // ==================================================

    const purchase =
        purchaseRepository.create({

            accountId,

            supplierId:
                supplier.id,

            inventoryId:
                inventory.id,

            quantity:
                Number(data.quantity),

            unitCost:
                Number(data.unitCost),

            totalAmount:
                Number(data.totalAmount),

            paymentStatus:
                data.paymentStatus,

            amountPaid:
                Number(data.amountPaid),

            balance:
                Number(data.balance)

        });

    // ==================================================
    // INCREASE INVENTORY
    // ==================================================

    inventoryRepository.increaseStock(

        accountId,

        inventory.id,

        Number(data.quantity)

    );

    // ==================================================
    // CREATE CREDITOR
    // ==================================================

    if (
        Number(data.balance) > 0
    ) {

        creditorRepository.create({

            accountId,

            supplierId:
                supplier.id,

            purchaseId:
                purchase.id,

            totalAmount:
                Number(data.totalAmount),

            amountPaid:
                Number(data.amountPaid),

            balance:
                Number(data.balance),

            status:

                Number(data.balance) ===
                Number(data.totalAmount)

                    ? "UNPAID"

                    : "PARTIAL"

        });

    }

    return purchase;

}

// ======================================================
// GET PURCHASES
// ======================================================

function getPurchases(
    telegramId
) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return purchaseRepository.findAll(
        account.accountId
    );

}

// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    recordPurchase,

    getPurchases

};