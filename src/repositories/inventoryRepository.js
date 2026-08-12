const db = require("../database/database");

// ============================================================
// INVENTORY REPOSITORY
// ============================================================
//
// ACCOUNT-BASED DATA ACCESS LAYER
//
// Inventory belongs to an ACCOUNT.
//
// This repository does NOT know about:
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
// CREATE INVENTORY ITEM
// ============================================================

function create(item) {

    if (
        item.accountId === undefined ||
        item.accountId === null ||
        item.accountId === ""
    ) {

        throw new Error(
            "Account ID is required."
        );

    }


    const result =
        db.prepare(`
            INSERT INTO inventory
            (
                account_id,
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

            item.accountId,

            item.productName,

            item.quantity,

            item.costPrice,

            item.sellingPrice

        );


    return findById(
        result.lastInsertRowid
    );

}


// ============================================================
// FIND INVENTORY ITEM BY ID
// ============================================================
//
// This is a general lookup by database ID.
//
// ============================================================

function findById(id) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE id = ?
    `).get(id);

}


// ============================================================
// FIND INVENTORY ITEM BY ID
// WITH ACCOUNT SECURITY
// ============================================================

function findByIdForAccount(
    accountId,
    id
) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE
            id = ?
        AND
            account_id = ?
    `).get(

        id,

        accountId

    );

}


// ============================================================
// FIND INVENTORY ITEM BY PRODUCT NAME
// ============================================================

function findByProductName(
    accountId,
    productName
) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE
            account_id = ?
        AND
            LOWER(product_name) =
            LOWER(?)
        LIMIT 1
    `).get(

        accountId,

        productName.trim()

    );

}


// ============================================================
// FIND EXISTING PRODUCT OR CREATE NEW
// ============================================================

function findOrCreate(
    accountId,
    productName
) {

    const item =
        findByProductName(
            accountId,
            productName
        );


    if (item) {

        return item;

    }


    return create({

        accountId,

        productName,

        quantity: 0,

        costPrice: 0,

        sellingPrice: 0

    });

}


// ============================================================
// INCREASE STOCK
// ============================================================

function increaseStock(
    accountId,
    id,
    quantity
) {

    const item =
        findByIdForAccount(
            accountId,
            id
        );


    if (!item) {

        throw new Error(
            "Inventory item not found."
        );

    }


    db.prepare(`
        UPDATE inventory
        SET
            quantity = quantity + ?
        WHERE
            id = ?
        AND
            account_id = ?
    `).run(

        quantity,

        id,

        accountId

    );


    return findByIdForAccount(
        accountId,
        id
    );

}


// ============================================================
// DECREASE STOCK
// ============================================================

function decreaseStock(
    accountId,
    id,
    quantity
) {

    const item =
        findByIdForAccount(
            accountId,
            id
        );


    if (!item) {

        throw new Error(
            "Inventory item not found."
        );

    }


    db.prepare(`
        UPDATE inventory
        SET
            quantity =
                MAX(
                    quantity - ?,
                    0
                )
        WHERE
            id = ?
        AND
            account_id = ?
    `).run(

        quantity,

        id,

        accountId

    );


    return findByIdForAccount(
        accountId,
        id
    );

}


// ============================================================
// UPDATE PRICES
// ============================================================

function updatePrices(
    accountId,
    id,
    costPrice,
    sellingPrice
) {

    const item =
        findByIdForAccount(
            accountId,
            id
        );


    if (!item) {

        throw new Error(
            "Inventory item not found."
        );

    }


    db.prepare(`
        UPDATE inventory
        SET
            cost_price = ?,
            selling_price = ?
        WHERE
            id = ?
        AND
            account_id = ?
    `).run(

        costPrice,

        sellingPrice,

        id,

        accountId

    );


    return findByIdForAccount(
        accountId,
        id
    );

}


// ============================================================
// GET ALL INVENTORY
// ============================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE account_id = ?
        ORDER BY product_name
    `).all(accountId);

}


// ============================================================
// FIND LOW-STOCK ITEMS
// ============================================================

function findLowStock(
    accountId,
    threshold = 5
) {

    return db.prepare(`
        SELECT *
        FROM inventory
        WHERE
            account_id = ?
        AND
            quantity <= ?
        ORDER BY
            quantity ASC,
            product_name ASC
    `).all(

        accountId,

        threshold

    );

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    create,

    findById,

    findByIdForAccount,

    findByProductName,

    findOrCreate,

    increaseStock,

    decreaseStock,

    updatePrices,

    findAll,

    findLowStock

};