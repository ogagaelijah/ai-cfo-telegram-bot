const accountContext = require("./accountContext");
const customerRepository = require("../repositories/customerRepository");

// ======================================================
// GET CURRENT ACCOUNT
// ======================================================

function getAccount(telegramId) {

    return accountContext.requireAccount(
        telegramId
    );

}

// ======================================================
// SAVE CUSTOMER
// ======================================================

function saveCustomer(
    telegramId,
    customer
) {

    const account =
        getAccount(telegramId);

    return customerRepository.create({

        accountId:
            account.accountId,

        name:
            customer.name,

        phone:
            customer.phone,

        email:
            customer.email,

        address:
            customer.address

    });

}

// ======================================================
// FIND OR CREATE CUSTOMER
// ======================================================

function findOrCreateCustomer(
    telegramId,
    customerName
) {

    const account =
        getAccount(telegramId);

    const name =
        String(customerName || "").trim();

    if (!name) {

        throw new Error(
            "Customer name is required."
        );

    }

    const existing =
        customerRepository.findByName(

            account.accountId,

            name

        );

    if (existing) {

        return existing;

    }

    return customerRepository.create({

        accountId:
            account.accountId,

        name,

        phone: null,

        email: null,

        address: null

    });

}

// ======================================================
// SEARCH CUSTOMERS
// ======================================================

function searchCustomers(
    telegramId,
    keyword
) {

    const account =
        getAccount(telegramId);

    return customerRepository.search(

        account.accountId,

        keyword

    );

}

// ======================================================
// GET ALL CUSTOMERS
// ======================================================

function getCustomers(
    telegramId
) {

    const account =
        getAccount(telegramId);

    return customerRepository.findAll(
        account.accountId
    );

}

// ======================================================
// EXPORT
// ======================================================

module.exports = {

    saveCustomer,

    findOrCreateCustomer,

    searchCustomers,

    getCustomers

};