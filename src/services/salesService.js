const userRepository = require("../repositories/userRepository");
const salesRepository = require("../repositories/salesRepository");
const customerService = require("./customerService");
const inventoryService = require("./inventoryService");

/**
 * Returns the internal database user ID
 */
function getUserId(telegramId) {

    const user =
        userRepository.findByTelegramId(telegramId);

    if (!user) {

        throw new Error("User not found.");

    }

    return user.id;

}

/**
 * Save a sale
 */
function saveSale(telegramId, sale) {

    if (Number(sale.quantity) <= 0) {

        throw new Error("Quantity must be greater than zero.");

    }

    if (Number(sale.price) < 0) {

        throw new Error("Price cannot be negative.");

    }

    const userId =
        getUserId(telegramId);

    // ==========================
    // CUSTOMER
    // ==========================
    const customer =
        customerService.findOrCreateCustomer(

            telegramId,

            sale.customer.trim()

        );

    // ==========================
    // INVENTORY
    // ==========================
    const product =
        inventoryService.findProduct(

            telegramId,

            sale.product.trim()

        );

    if (!product) {

        throw new Error(
            "Product not found in inventory."
        );

    }

    if (product.quantity < Number(sale.quantity)) {

        throw new Error(
            "Insufficient stock."
        );

    }

    // ==========================
    // CALCULATIONS
    // ==========================
    const revenue =
        Number(sale.quantity) *
        Number(sale.price);

    const costOfGoods =
        Number(sale.quantity) *
        Number(product.cost_price);

    const profit =
        revenue - costOfGoods;

    // ==========================
    // SAVE SALE
    // ==========================
    const savedSale =
        salesRepository.create({

            userId,

            customerId: customer.id,

            inventoryId: product.id,

            item: product.product_name,

            quantity: Number(sale.quantity),

            unitPrice: Number(sale.price),

            costPrice: Number(product.cost_price),

            revenue,

            costOfGoods,

            profit,

            total: revenue

        });

    // ==========================
    // REDUCE STOCK
    // ==========================
    inventoryService.reduceStock(

        telegramId,

        sale.product,

        Number(sale.quantity)

    );

    return {

        sale: savedSale,

        customer

    };

}

module.exports = {

    saveSale

};