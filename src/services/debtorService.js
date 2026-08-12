const accountContext = require("./accountContext");
const debtorRepository = require("../repositories/debtorRepository");
const customerRepository = require("../repositories/customerRepository");

// ======================================================
// GET ACCOUNT CONTEXT
// ======================================================

function getAccount(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return account;
}

// ======================================================
// CREATE DEBT
// ======================================================

function createDebt(
    telegramId,
    customerName,
    saleId,
    totalAmount
) {

    const account =
        getAccount(telegramId);

    const customer =
        customerRepository.findByName(
            account.accountId,
            customerName
        );

    if (!customer) {

        throw new Error(
            "Customer not found."
        );

    }

    return debtorRepository.create({

        accountId:
            account.accountId,

        customerId:
            customer.id,

        saleId,

        totalAmount:
            Number(totalAmount),

        amountPaid:
            0,

        balance:
            Number(totalAmount),

        status:
            "UNPAID"

    });

}

// ======================================================
// GET DEBTORS
// ======================================================

function getDebtors(telegramId) {

    const account =
        getAccount(telegramId);

    return debtorRepository.findAll(
        account.accountId
    );

}

// ======================================================
// RECEIVE PAYMENT
// ======================================================

function receivePayment(
    telegramId,
    customerName,
    payment
) {

    const account =
        getAccount(telegramId);

    const amount =
        Number(payment);

    if (!Number.isFinite(amount) || amount <= 0) {

        throw new Error(
            "Payment must be greater than zero."
        );

    }

    const customer =
        customerRepository.findByName(
            account.accountId,
            customerName
        );

    if (!customer) {

        throw new Error(
            "Customer not found."
        );

    }

    const debt =
        debtorRepository.findByCustomer(
            account.accountId,
            customer.id
        );

    if (!debt) {

        throw new Error(
            "Customer has no outstanding debt."
        );

    }

    if (amount > Number(debt.balance)) {

        throw new Error(
            "Payment exceeds outstanding balance."
        );

    }

    const amountPaid =
        Number(debt.amount_paid) + amount;

    const balance =
        Number(debt.balance) - amount;

    let status;

    if (balance <= 0) {

        status = "PAID";

    } else if (amountPaid === 0) {

        status = "UNPAID";

    } else {

        status = "PARTIAL";

    }

    return debtorRepository.updatePayment(

        account.accountId,

        debt.id,

        amountPaid,

        balance <= 0
            ? 0
            : balance,

        status

    );

}

// ======================================================
// OUTSTANDING TOTAL
// ======================================================

function getOutstandingTotal(
    telegramId
) {

    const account =
        getAccount(telegramId);

    return debtorRepository.getOutstandingTotal(
        account.accountId
    );

}

// ======================================================
// OUTSTANDING DEBTORS
// ======================================================

function getOutstandingDebtors(
    telegramId
) {

    const account =
        getAccount(telegramId);

    return debtorRepository.findOutstanding(
        account.accountId
    );

}

// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createDebt,

    getDebtors,

    receivePayment,

    getOutstandingTotal,

    getOutstandingDebtors

};