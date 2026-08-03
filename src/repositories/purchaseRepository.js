const db = require("../database/database");

// ==========================
// CREATE PURCHASE
// ==========================
function create(data) {

    const stmt = db.prepare(`
        INSERT INTO purchases (
            user_id,
            supplier_id,
            inventory_id,
            quantity,
            unit_cost,
            total_amount,
            payment_status,
            amount_paid,
            balance
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        data.userId,
        data.supplierId,
        data.inventoryId,
        data.quantity,
        data.unitCost,
        data.totalAmount,
        data.paymentStatus,
        data.amountPaid,
        data.balance
    );

    return findById(result.lastInsertRowid);

}

// ==========================
// FIND PURCHASE
// ==========================
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM purchases
        WHERE id = ?
    `).get(id);

}

// ==========================
// ALL PURCHASES
// ==========================
function findAll(userId) {

    return db.prepare(`
        SELECT
            p.*,
            s.name AS supplier_name,
            i.product_name
        FROM purchases p
        JOIN suppliers s
            ON p.supplier_id = s.id
        JOIN inventory i
            ON p.inventory_id = i.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
    `).all(userId);

}

module.exports = {

    create,
    findById,
    findAll

};