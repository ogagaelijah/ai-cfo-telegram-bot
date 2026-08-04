const creditorRepository = require("../repositories/creditorRepository");
const supplierService = require("./supplierService");
const userRepository = require("../repositories/userRepository");

/**
 * Get internal user ID
 */
function getUserId(telegramId) {

    const user = userRepository.findByTelegramId(telegramId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user.id;

}

/**
 * Create a creditor record
 */
function createCreditor(telegramId, creditor) {

    const userId = getUserId(telegramId);

    const supplier = supplierService.findOrCreateSupplier(
        telegramId,
        creditor.supplier
    );

    return creditorRepository.create({

        userId,

        supplierId: supplier.id,

        totalAmount: creditor.totalAmount,

        amountPaid: creditor.amountPaid,

        balance: creditor.balance,

        status: creditor.status

    });

}

/**
 * Get all creditors
 */
function getCreditors(telegramId) {

    const userId = getUserId(telegramId);

    return creditorRepository.findAll(userId);

}

/**
 * Get only outstanding creditors
 */
function getOutstandingCreditors(telegramId) {

    const userId = getUserId(telegramId);

    return creditorRepository.findOutstanding(userId);

}

/**
 * Find supplier unpaid balance
 */
function findSupplierDebt(telegramId, supplierName) {

    const userId = getUserId(telegramId);

    const supplier = supplierService.findSupplierByName(
        telegramId,
        supplierName
    );

    if (!supplier) {

        throw new Error("Supplier not found.");

    }

    return creditorRepository.findBySupplier(
        userId,
        supplier.id
    );

}

/**
 * Record supplier payment
 */
function recordPayment(
    telegramId,
    supplierName,
    payment
) {

    const debt = findSupplierDebt(
        telegramId,
        supplierName
    );

    if (!debt) {

        throw new Error("No outstanding balance.");

    }

    if (payment > debt.balance) {

        throw new Error("Payment exceeds outstanding balance.");

    }

    const amountPaid = debt.amount_paid + payment;

    const balance = debt.balance - payment;

    let status;

    if (balance === 0) {
        status = "PAID";
    } else if (amountPaid === 0) {
        status = "UNPAID";
    } else {
        status = "PARTIAL";
    }

    return creditorRepository.updatePayment(

        debt.id,

        amountPaid,

        balance,

        status

    );

}

/**
 * Outstanding creditors total
 */
function getOutstandingTotal(telegramId) {

    const userId = getUserId(telegramId);

    return creditorRepository.getOutstandingTotal(userId);

}

module.exports = {

    createCreditor,

    getCreditors,

    getOutstandingCreditors,

    findSupplierDebt,

    recordPayment,

    getOutstandingTotal

};