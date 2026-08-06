const creditorRepository = require("../repositories/creditorRepository");
const supplierService = require("./supplierService");
const userRepository = require("../repositories/userRepository");

// ==========================
// GET INTERNAL USER ID
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
// CREATE CREDITOR
// ==========================
function createCreditor(telegramId, creditor) {

    const userId =
        getUserId(telegramId);

    const supplier =
        supplierService.findOrCreateSupplier(
            telegramId,
            creditor.supplier
        );

    return creditorRepository.create({

        userId,

        supplierId: supplier.id,

        purchaseId: creditor.purchaseId || null,

        totalAmount: creditor.totalAmount,

        amountPaid: creditor.amountPaid,

        balance: creditor.balance,

        status: creditor.status

    });

}

// ==========================
// GET ALL CREDITORS
// ==========================
function getCreditors(telegramId) {

    const userId =
        getUserId(telegramId);

    return creditorRepository.findAll(userId);

}

// ==========================
// GET OUTSTANDING CREDITORS
// ==========================
function getOutstandingCreditors(telegramId) {

    const userId =
        getUserId(telegramId);

    return creditorRepository.findOutstanding(userId);

}

// ==========================
// FIND SUPPLIER DEBT
// ==========================
function findSupplierDebt(telegramId, supplierName) {

    const userId =
        getUserId(telegramId);

    const supplier =
        supplierService.findSupplierByName(
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

// ==========================
// RECORD PAYMENT
// ==========================
function recordPayment(
    telegramId,
    supplierName,
    payment
) {

    const debt =
        findSupplierDebt(
            telegramId,
            supplierName
        );

    if (!debt) {

        throw new Error("No outstanding balance.");

    }

    if (payment > debt.balance) {

        throw new Error("Payment exceeds outstanding balance.");

    }

    const amountPaid =
        debt.amount_paid + payment;

    const balance =
        debt.balance - payment;

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

// ==========================
// GET OUTSTANDING TOTAL
// ==========================
function getOutstandingTotal(telegramId) {

    const userId =
        getUserId(telegramId);

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