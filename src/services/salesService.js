const accountContext = require("./accountContext");
const salesRepository = require("../repositories/salesRepository");
const customerService = require("./customerService");
const inventoryService = require("./inventoryService");

/**
 * Save a sale.
 *
 * Telegram remains the interface identifier.
 * The service resolves it to the current account.
 *
 * Financial data belongs to the ACCOUNT, not directly
 * to the Telegram user.
 */
function saveSale(telegramId, sale) {

    if (!sale) {
        throw new Error("Sale data is required.");
    }

    if (Number(sale.quantity) <= 0) {
        throw new Error(
            "Quantity must be greater than zero."
        );
    }

    if (Number(sale.price) < 0) {
        throw new Error(
            "Price cannot be negative."
        );
    }

    if (
        !sale.customer ||
        !String(sale.customer).trim()
    ) {
        throw new Error(
            "Customer name is required."
        );
    }

    if (
        !sale.product ||
        !String(sale.product).trim()
    ) {
        throw new Error(
            "Product name is required."
        );
    }

    // ======================================================
    // CURRENT ACCOUNT
    // ======================================================

    const account =
        accountContext.requireAccount(
            telegramId
        );

    const accountId =
        account.accountId;

    // ======================================================
    // CUSTOMER
    // ======================================================

    const customer =
        customerService.findOrCreateCustomer(
            telegramId,
            String(
                sale.customer
            ).trim()
        );

    // ======================================================
    // INVENTORY
    // ======================================================

    const product =
        inventoryService.findProduct(
            accountId,
            String(
                sale.product
            ).trim()
        );

    if (!product) {
        throw new Error(
            "Product not found in inventory."
        );
    }

    if (
        Number(product.quantity) <
        Number(sale.quantity)
    ) {
        throw new Error(
            "Insufficient stock."
        );
    }

    // ======================================================
    // CALCULATIONS
    // ======================================================

    const quantity =
        Number(sale.quantity);

    const unitPrice =
        Number(sale.price);

    const costPrice =
        Number(product.cost_price) || 0;

    const revenue =
        quantity *
        unitPrice;

    const costOfGoods =
        quantity *
        costPrice;

    const profit =
        revenue -
        costOfGoods;

    // ======================================================
    // SAVE SALE
    // ======================================================

    const savedSale =
        salesRepository.create({
            accountId,

            customerId:
                customer.id,

            inventoryId:
                product.id,

            item:
                product.product_name,

            quantity,

            unitPrice,

            costPrice,

            revenue,

            costOfGoods,

            profit,

            total:
                revenue
        });

    // ======================================================
    // REDUCE STOCK
    // ======================================================

    inventoryService.reduceStock(
        accountId,
        product.product_name,
        quantity
    );

    return {
        sale:
            savedSale,

        customer
    };
}

module.exports = {
    saveSale
};