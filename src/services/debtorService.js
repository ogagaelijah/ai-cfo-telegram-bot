const userRepository = require("../repositories/userRepository");
const debtorRepository = require("../repositories/debtorRepository");
const customerRepository = require("../repositories/customerRepository");

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
 * Create debtor
 */
function createDebt(
    telegramId,
    customerName,
    saleId,
    totalAmount
) {

    const userId = getUserId(telegramId);

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

/**
 * View debtors
 */
function getDebtors(telegramId) {

    const userId = getUserId(telegramId);

    return debtorRepository.findAll(userId);

}

/**
 * Receive payment
 */
function receivePayment(
    telegramId,
    customerName,
    payment
) {

    const userId = getUserId(telegramId);

    // Find customer by name
    const customer =
        customerRepository.findByName(
            userId,
            customerName
        );

    if (!customer) {
        throw new Error("Customer not found.");
    }

    // Find customer's outstanding debt
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

    const status =
        balance <= 0
            ? "PAID"
            : "UNPAID";

    return debtorRepository.updatePayment(

        debt.id,

        amountPaid,

        balance <= 0 ? 0 : balance,

        status

    );

}

/**
 * Outstanding debt total
 */
function getOutstandingTotal(
    telegramId
) {

    const userId =
        getUserId(telegramId);

    return debtorRepository.getOutstandingTotal(
        userId
    );

}

module.exports = {

    createDebt,

    getDebtors,

    receivePayment,

    getOutstandingTotal

};