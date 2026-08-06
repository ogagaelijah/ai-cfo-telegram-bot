const userRepository = require("../repositories/userRepository");
const debtorRepository = require("../repositories/debtorRepository");
const customerRepository = require("../repositories/customerRepository");

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
// CREATE DEBT
// ==========================
function createDebt(
    telegramId,
    customerName,
    saleId,
    totalAmount
) {

    const userId =
        getUserId(telegramId);

    const customer =
        customerRepository.findByName(
            userId,
            customerName
        );

    if (!customer) {

        throw new Error("Customer not found.");

    }

    return debtorRepository.create({

        userId,

        customerId: customer.id,

        saleId,

        totalAmount,

        amountPaid: 0,

        balance: totalAmount,

        status: "UNPAID"

    });

}

// ==========================
// GET DEBTORS
// ==========================
function getDebtors(telegramId) {

    const userId =
        getUserId(telegramId);

    return debtorRepository.findAll(userId);

}

// ==========================
// RECEIVE PAYMENT
// ==========================
function receivePayment(
    telegramId,
    customerName,
    payment
) {

    const userId =
        getUserId(telegramId);

    const customer =
        customerRepository.findByName(
            userId,
            customerName
        );

    if (!customer) {

        throw new Error("Customer not found.");

    }

    const debt =
        debtorRepository.findByCustomer(
            userId,
            customer.id
        );

    if (!debt) {

        throw new Error("Customer has no outstanding debt.");

    }

    if (payment > debt.balance) {

        throw new Error(
            "Payment exceeds outstanding balance."
        );

    }

    const amountPaid =
        Number(debt.amount_paid) + payment;

    const balance =
        Number(debt.balance) - payment;

    let status;

    if (balance <= 0) {

        status = "PAID";

    } else if (amountPaid === 0) {

        status = "UNPAID";

    } else {

        status = "PARTIAL";

    }

    return debtorRepository.updatePayment(

        debt.id,

        amountPaid,

        balance <= 0 ? 0 : balance,

        status

    );

}

// ==========================
// OUTSTANDING TOTAL
// ==========================
function getOutstandingTotal(telegramId) {

    const userId =
        getUserId(telegramId);

    return debtorRepository.getOutstandingTotal(userId);

}

module.exports = {

    createDebt,

    getDebtors,

    receivePayment,

    getOutstandingTotal

};