const creditorRepository = require("../repositories/creditorRepository");
const supplierService = require("./supplierService");
const accountContext = require("./accountContext");

// ==========================
// CREATE CREDITOR
// ==========================
function createCreditor(telegramId, creditor) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    const accountId =
        account.accountId;

    const supplier =
        supplierService.findOrCreateSupplier(
            telegramId,
            creditor.supplier
        );

    return creditorRepository.create({

        accountId,

        supplierId:
            supplier.id,

        purchaseId:
            creditor.purchaseId || null,

        totalAmount:
            creditor.totalAmount,

        amountPaid:
            creditor.amountPaid,

        balance:
            creditor.balance,

        status:
            creditor.status

    });

}

// ==========================
// GET ALL CREDITORS
// ==========================
function getCreditors(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return creditorRepository.findAll(
        account.accountId
    );

}

// ==========================
// GET OUTSTANDING CREDITORS
// ==========================
function getOutstandingCreditors(
    telegramId
) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return creditorRepository.findOutstanding(
        account.accountId
    );

}

// ==========================
// FIND SUPPLIER DEBT
// ==========================
function findSupplierDebt(
    telegramId,
    supplierName
) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    const supplier =
        supplierService.findSupplierByName(
            telegramId,
            supplierName
        );

    if (!supplier) {

        throw new Error(
            "Supplier not found."
        );

    }

    return creditorRepository.findBySupplier(

        account.accountId,

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

        throw new Error(
            "No outstanding balance."
        );

    }

    const paymentAmount =
        Number(payment);

    if (paymentAmount <= 0) {

        throw new Error(
            "Payment must be greater than zero."
        );

    }

    if (
        paymentAmount >
        Number(debt.balance)
    ) {

        throw new Error(
            "Payment exceeds outstanding balance."
        );

    }

    const amountPaid =
        Number(debt.amount_paid) +
        paymentAmount;

    const balance =
        Number(debt.balance) -
        paymentAmount;

    let status;

    if (balance <= 0) {

        status = "PAID";

    } else if (amountPaid === 0) {

        status = "UNPAID";

    } else {

        status = "PARTIAL";

    }

    return creditorRepository.updatePayment(

        debt.id,

        amountPaid,

        balance <= 0
            ? 0
            : balance,

        status

    );

}

// ==========================
// GET OUTSTANDING TOTAL
// ==========================
function getOutstandingTotal(
    telegramId
) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return creditorRepository.getOutstandingTotal(
        account.accountId
    );

}

module.exports = {

    createCreditor,

    getCreditors,

    getOutstandingCreditors,

    findSupplierDebt,

    recordPayment,

    getOutstandingTotal

};