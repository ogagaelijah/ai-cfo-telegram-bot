const db = require("../database/database");

/**
 * Create a new inventory item
 */
function create(item) {

    const result = db.prepare(`
        INSERT INTO inventory
        (
            user_id,
            product_name,
            quantity,
            cost_price,
            selling_price
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        item.userId,
        item.productName,
        item.quantity,
        item.costPrice,
        item.sellingPrice

    );

    return findById(result.lastInsertRowid);

}

/**
 * Find inventory item by ID
 */
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE id = ?
    `).get(id);

}

/**
 * Find inventory item by product name
 */
function findByProductName(userId, productName) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE user_id = ?
        AND LOWER(product_name) = LOWER(?)
        LIMIT 1
    `).get(

        userId,
        productName.trim()

    );

}

/**
 * Find existing product or create a new one
 */
function findOrCreate(userId, productName) {

    let item = findByProductName(userId, productName);

    if (item) {
        return item;
    }

    return create({

        userId,

        productName,

        quantity: 0,

        costPrice: 0,

        sellingPrice: 0

    });

}

/**
 * Increase stock
 */
function increaseStock(id, quantity) {

    db.prepare(`
        UPDATE inventory
        SET quantity = quantity + ?
        WHERE id = ?
    `).run(

        quantity,
        id

    );

    return findById(id);

}

/**
 * Decrease stock
 */
function decreaseStock(id, quantity) {

    db.prepare(`
        UPDATE inventory
        SET quantity = quantity - ?
        WHERE id = ?
    `).run(

        quantity,
        id

    );

    return findById(id);

}

/**
 * Update prices
 */
function updatePrices(id, costPrice, sellingPrice) {

    db.prepare(`
        UPDATE inventory
        SET
            cost_price = ?,
            selling_price = ?
        WHERE id = ?
    `).run(

        costPrice,
        sellingPrice,
        id

    );

    return findById(id);

}

/**
 * Get all inventory
 */
function findAll(userId) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE user_id = ?
        ORDER BY product_name
    `).all(userId);

}

/**
 * Find low-stock items
 */
function findLowStock(userId, threshold = 5) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE user_id = ?
        AND quantity <= ?
        ORDER BY quantity ASC
    `).all(

        userId,
        threshold

    );

}

module.exports = {

    create,

    findById,

    findByProductName,

    findOrCreate,

    increaseStock,

    decreaseStock,

    updatePrices,

    findAll,

    findLowStock

};