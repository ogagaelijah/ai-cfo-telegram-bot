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
    const product = inventoryService.findProduct(

        telegramId,

        sale.product

    );

    if (!product) {

        throw new Error("Product not found in inventory.");

    }

    if (product.quantity < sale.quantity) {

        throw new Error("Insufficient stock.");

    }

    // ==========================
    // CALCULATIONS
    // ==========================
    const revenue = sale.quantity * sale.price;

    const costOfGoods = sale.quantity * product.cost_price;

    const profit = revenue - costOfGoods;

    // ==========================
    // REDUCE STOCK
    // ==========================
    inventoryService.reduceStock(

        telegramId,

        sale.product,

        sale.quantity

    );

    // ==========================
    // SAVE SALE
    // ==========================
    const savedSale = salesRepository.create({

        userId,

        customerId: customer.id,

        inventoryId: product.id,

        item: product.product_name,

        quantity: sale.quantity,

        unitPrice: sale.price,

        costPrice: product.cost_price,

        revenue,

        costOfGoods,

        profit,

        total: revenue

    });

    return {

        sale: savedSale,

        customer

    };

}

module.exports = {

    saveSale

};