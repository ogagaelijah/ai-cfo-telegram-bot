const inventoryRepository = require("../repositories/inventoryRepository");
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
 * Add a new product or restock an existing one
 */
function addStock(telegramId, item) {

    const userId = getUserId(telegramId);

    let product = inventoryRepository.findByProductName(
        userId,
        item.productName
    );

    if (!product) {

        product = inventoryRepository.create({

            userId,

            productName: item.productName,

            quantity: item.quantity,

            costPrice: item.costPrice,

            sellingPrice: item.sellingPrice

        });

        return product;

    }

    inventoryRepository.updatePrices(

        product.id,

        item.costPrice,

        item.sellingPrice

    );

    return inventoryRepository.increaseStock(

        product.id,

        item.quantity

    );

}

/**
 * Reduce stock after a sale
 */
function reduceStock(telegramId, productName, quantity) {

    const userId = getUserId(telegramId);

    const product = inventoryRepository.findByProductName(

        userId,

        productName

    );

    if (!product) {
        throw new Error("Product not found in inventory.");
    }

    if (product.quantity < quantity) {
        throw new Error("Insufficient stock.");
    }

    return inventoryRepository.decreaseStock(

        product.id,

        quantity

    );

}

/**
 * Get inventory list
 */
function getInventory(telegramId) {

    const userId = getUserId(telegramId);

    return inventoryRepository.findAll(userId);

}

/**
 * Get low-stock products
 */
function getLowStock(telegramId, threshold = 5) {

    const userId = getUserId(telegramId);

    return inventoryRepository.findLowStock(

        userId,

        threshold

    );

}

/**
 * Find product
 */
function findProduct(telegramId, productName) {

    const userId = getUserId(telegramId);

    return inventoryRepository.findByProductName(

        userId,

        productName

    );

}

module.exports = {

    addStock,

    reduceStock,

    findProduct,

    getInventory,

    getLowStock

};