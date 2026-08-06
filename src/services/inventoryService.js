const inventoryRepository = require("../repositories/inventoryRepository");
const userRepository = require("../repositories/userRepository");

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
// ADD OR RESTOCK PRODUCT
// ==========================
function addStock(telegramId, item) {

    if (Number(item.quantity) <= 0) {

        throw new Error("Quantity must be greater than zero.");

    }

    const userId =
        getUserId(telegramId);

    const productName =
        item.productName.trim();

    let product =
        inventoryRepository.findByProductName(

            userId,

            productName

        );

    if (!product) {

        return inventoryRepository.create({

            userId,

            productName,

            quantity: Number(item.quantity),

            costPrice: Number(item.costPrice),

            sellingPrice: Number(item.sellingPrice)

        });

    }

    inventoryRepository.updatePrices(

        product.id,

        Number(item.costPrice),

        Number(item.sellingPrice)

    );

    return inventoryRepository.increaseStock(

        product.id,

        Number(item.quantity)

    );

}

// ==========================
// REDUCE STOCK
// ==========================
function reduceStock(
    telegramId,
    productName,
    quantity
) {

    if (Number(quantity) <= 0) {

        throw new Error("Quantity must be greater than zero.");

    }

    const userId =
        getUserId(telegramId);

    const product =
        inventoryRepository.findByProductName(

            userId,

            productName.trim()

        );

    if (!product) {

        throw new Error(
            "Product not found in inventory."
        );

    }

    if (product.quantity < quantity) {

        throw new Error(
            "Insufficient stock."
        );

    }

    return inventoryRepository.decreaseStock(

        product.id,

        Number(quantity)

    );

}

// ==========================
// GET INVENTORY
// ==========================
function getInventory(telegramId) {

    return inventoryRepository.findAll(

        getUserId(telegramId)

    );

}

// ==========================
// LOW STOCK
// ==========================
function getLowStock(
    telegramId,
    threshold = 5
) {

    return inventoryRepository.findLowStock(

        getUserId(telegramId),

        threshold

    );

}

// ==========================
// FIND PRODUCT
// ==========================
function findProduct(
    telegramId,
    productName
) {

    return inventoryRepository.findByProductName(

        getUserId(telegramId),

        productName.trim()

    );

}

module.exports = {

    addStock,

    reduceStock,

    findProduct,

    getInventory,

    getLowStock

};