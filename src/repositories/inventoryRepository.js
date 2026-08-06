const db = require("../database/database");

// ==========================
// CREATE INVENTORY ITEM
// ==========================
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

// ==========================
// FIND INVENTORY ITEM BY ID
// ==========================
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE id = ?
    `).get(id);

}

// ==========================
// FIND INVENTORY ITEM BY PRODUCT NAME
// ==========================
function findByProductName(userId, productName) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE
            user_id = ?
        AND
            LOWER(product_name) = LOWER(?)
        LIMIT 1
    `).get(

        userId,

        productName.trim()

    );

}

// ==========================
// FIND EXISTING PRODUCT OR CREATE NEW
// ==========================
function findOrCreate(userId, productName) {

    const item =
        findByProductName(userId, productName);

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

// ==========================
// INCREASE STOCK
// ==========================
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

// ==========================
// DECREASE STOCK
// ==========================
function decreaseStock(id, quantity) {

    db.prepare(`
        UPDATE inventory
        SET quantity = MAX(quantity - ?, 0)
        WHERE id = ?
    `).run(

        quantity,

        id

    );

    return findById(id);

}

// ==========================
// UPDATE PRICES
// ==========================
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

// ==========================
// GET ALL INVENTORY
// ==========================
function findAll(userId) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE user_id = ?
        ORDER BY product_name
    `).all(userId);

}

// ==========================
// FIND LOW-STOCK ITEMS
// ==========================
function findLowStock(userId, threshold = 5) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE
            user_id = ?
        AND
            quantity <= ?
        ORDER BY
            quantity ASC,
            product_name ASC
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