const customerRepository = require("../repositories/customerRepository");
const userRepository = require("../repositories/userRepository");

// ==========================
// GET INTERNAL USER ID
// ==========================
function getUserId(telegramId) {

    const user = userRepository.findByTelegramId(telegramId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user.id;

}

// ==========================
// SAVE CUSTOMER
// ==========================
function saveCustomer(telegramId, customer) {

    const userId = getUserId(telegramId);

    return customerRepository.create({

        userId,

        name: customer.name,

        phone: customer.phone,

        email: customer.email,

        address: customer.address

    });

}

// ==========================
// FIND OR CREATE CUSTOMER
// ==========================
function findOrCreateCustomer(telegramId, customerName) {

    const userId = getUserId(telegramId);

    return customerRepository.findOrCreate(

        userId,

        customerName

    );

}

// ==========================
// SEARCH CUSTOMERS
// ==========================
function searchCustomers(telegramId, keyword) {

    const userId = getUserId(telegramId);

    return customerRepository.search(

        userId,

        keyword

    );

}

// ==========================
// GET ALL CUSTOMERS
// ==========================
function getCustomers(telegramId) {

    const userId = getUserId(telegramId);

    return customerRepository.findAll(userId);

}

module.exports = {

    saveCustomer,

    findOrCreateCustomer,

    searchCustomers,

    getCustomers

};