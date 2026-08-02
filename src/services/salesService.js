const userRepository = require("../repositories/userRepository");
const salesRepository = require("../repositories/salesRepository");
const customerService = require("./customerService");

/**
 * Returns the internal database user ID
 */
function getUserId(telegramId) {

    const user = userRepository.findByTelegramId(telegramId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user.id;

}

/**
 * Save a sale
 */
function saveSale(telegramId, sale) {

    const userId = getUserId(telegramId);

    const customer = customerService.findOrCreateCustomer(
        telegramId,
        sale.customer
    );

    return salesRepository.create({

        userId,

        customerId: customer.id,

        item: sale.product,

        quantity: sale.quantity,

        unitPrice: sale.price,

        total: sale.quantity * sale.price

    });

}

module.exports = {

    saveSale

};