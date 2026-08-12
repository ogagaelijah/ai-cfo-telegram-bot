const inventoryRepository =
    require("../repositories/inventoryRepository");

// ============================================================
// INVENTORY SERVICE
// ============================================================
//
// ACCOUNT-BASED DOMAIN SERVICE
//
// This service does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - Sessions
// - Interface users
//
// It receives accountId directly.
//
// ============================================================


// ============================================================
// ADD OR RESTOCK PRODUCT
// ============================================================

function addStock(
    accountId,
    item
) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    if (
        Number(item.quantity) <= 0
    ) {

        throw new Error(
            "Quantity must be greater than zero."
        );

    }


    const productName =
        item.productName.trim();


    let product =
        inventoryRepository.findByProductName(

            accountId,

            productName

        );


    // ========================================================
    // CREATE NEW PRODUCT
    // ========================================================

    if (!product) {

        return inventoryRepository.create({

            accountId,

            productName,

            quantity:
                Number(item.quantity),

            costPrice:
                Number(item.costPrice),

            sellingPrice:
                Number(item.sellingPrice)

        });

    }


    // ========================================================
    // UPDATE EXISTING PRODUCT PRICES
    // ========================================================

    inventoryRepository.updatePrices(

        accountId,

        product.id,

        Number(item.costPrice),

        Number(item.sellingPrice)

    );


    // ========================================================
    // ADD STOCK
    // ========================================================

    return inventoryRepository.increaseStock(

        accountId,

        product.id,

        Number(item.quantity)

    );

}


// ============================================================
// REDUCE STOCK
// ============================================================

function reduceStock(
    accountId,
    productName,
    quantity
) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    if (
        Number(quantity) <= 0
    ) {

        throw new Error(
            "Quantity must be greater than zero."
        );

    }


    const product =
        inventoryRepository.findByProductName(

            accountId,

            productName.trim()

        );


    if (!product) {

        throw new Error(
            "Product not found in inventory."
        );

    }


    if (
        Number(product.quantity) <
        Number(quantity)
    ) {

        throw new Error(
            "Insufficient stock."
        );

    }


    return inventoryRepository.decreaseStock(

        accountId,

        product.id,

        Number(quantity)

    );

}


// ============================================================
// GET INVENTORY
// ============================================================

function getInventory(accountId) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    return inventoryRepository.findAll(

        accountId

    );

}


// ============================================================
// LOW STOCK
// ============================================================

function getLowStock(
    accountId,
    threshold = 5
) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    return inventoryRepository.findLowStock(

        accountId,

        threshold

    );

}


// ============================================================
// FIND PRODUCT
// ============================================================

function findProduct(
    accountId,
    productName
) {

    if (
        accountId === undefined ||
        accountId === null ||
        accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    return inventoryRepository.findByProductName(

        accountId,

        productName.trim()

    );

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    addStock,

    reduceStock,

    findProduct,

    getInventory,

    getLowStock

};