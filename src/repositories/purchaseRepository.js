const db = require("../database/database");

// ======================================================
// CREATE PURCHASE
// ======================================================

function create(data) {

    const stmt = db.prepare(`
        INSERT INTO purchases
        (
            account_id,
            supplier_id,
            inventory_id,
            quantity,
            unit_cost,
            total_amount,
            payment_status,
            amount_paid,
            balance
        )

        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `);

    const result = stmt.run(

        data.accountId,

        data.supplierId,

        data.inventoryId,

        data.quantity,

        data.unitCost,

        data.totalAmount,

        data.paymentStatus || "PAID",

        data.amountPaid || 0,

        data.balance || 0

    );

    return findById(
        result.lastInsertRowid
    );

}


// ======================================================
// FIND PURCHASE BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT
            p.*,

            s.name AS supplier_name,

            i.product_name

        FROM purchases p

        LEFT JOIN suppliers s
            ON p.supplier_id = s.id

        LEFT JOIN inventory i
            ON p.inventory_id = i.id

        WHERE
            p.id = ?

        LIMIT 1

    `).get(id);

}


// ======================================================
// GET ALL PURCHASES FOR ACCOUNT
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT
            p.*,

            s.name AS supplier_name,

            i.product_name

        FROM purchases p

        LEFT JOIN suppliers s
            ON p.supplier_id = s.id

        LEFT JOIN inventory i
            ON p.inventory_id = i.id

        WHERE
            p.account_id = ?

        ORDER BY
            p.created_at DESC

    `).all(accountId);

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll

};