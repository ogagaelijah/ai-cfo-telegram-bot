const supplierRepository = require("../repositories/supplierRepository");
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
 * Save supplier
 */
function saveSupplier(telegramId, supplier) {

    const userId = getUserId(telegramId);

    return supplierRepository.create({

        userId,

        name: supplier.name,

        phone: supplier.phone,

        email: supplier.email,

        address: supplier.address

    });

}

/**
 * Get all suppliers
 */
function getSuppliers(telegramId) {

    const userId = getUserId(telegramId);

    return supplierRepository.findAll(userId);

}

/**
 * Search suppliers
 */
function searchSuppliers(telegramId, keyword) {

    const userId = getUserId(telegramId);

    return supplierRepository.search(

        userId,

        keyword

    );

}

/**
 * Find supplier by name
 */
function findSupplierByName(telegramId, name) {

    const userId = getUserId(telegramId);

    return supplierRepository.findByName(

        userId,

        name

    );

}

/**
 * Find existing supplier or create one
 */
function findOrCreateSupplier(telegramId, name) {

    let supplier = findSupplierByName(

        telegramId,

        name

    );

    if (supplier) {

        return supplier;

    }

    return saveSupplier(telegramId, {

        name,

        phone: "",

        email: "",

        address: ""

    });

}

module.exports = {

    saveSupplier,

    getSuppliers,

    searchSuppliers,

    findSupplierByName,

    findOrCreateSupplier

};