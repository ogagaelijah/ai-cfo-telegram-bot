const userRepository = require("../repositories/userRepository");
const salesRepository = require("../repositories/salesRepository");
const customerService = require("./customerService");
const inventoryService = require("./inventoryService");

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

    // ==========================
    // CUSTOMER
    // ==========================
    const customer = customerService.findOrCreateCustomer(

        telegramId,

        sale.customer

    );

    // ==========================
    // INVENTORY
    // ==========================
    inventoryService.reduceStock(

        telegramId,

        sale.product,

        sale.quantity

    );

    // ==========================
    // SAVE SALE
    // ==========================
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