const db = require("../database/database");

// ==========================
// CREATE CREDITOR
// ==========================
function create(creditor) {

    const result = db.prepare(`
        INSERT INTO creditors
        (
            user_id,
            supplier_id,
            purchase_id,
            total_amount,
            amount_paid,
            balance,
            status
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        creditor.userId,

        creditor.supplierId,

        creditor.purchaseId,

        creditor.totalAmount,

        creditor.amountPaid,

        creditor.balance,

        creditor.status

    );

    return findById(result.lastInsertRowid);

}

// ==========================
// FIND CREDITOR BY ID
// ==========================
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM creditors
        WHERE id = ?
    `).get(id);

}

// ==========================
// GET ALL CREDITORS
// ==========================
function findAll(userId) {

    return db.prepare(`
        SELECT
            cr.*,
            s.name AS supplier_name
        FROM creditors cr

        LEFT JOIN suppliers s
            ON s.id = cr.supplier_id

        WHERE
            cr.user_id = ?

        ORDER BY cr.created_at DESC
    `).all(userId);

}

// ==========================
// FIND SUPPLIER'S OUTSTANDING DEBT
// ==========================
function findBySupplier(userId, supplierId) {

    return db.prepare(`
        SELECT *
        FROM creditors
        WHERE
            user_id = ?
        AND
            supplier_id = ?
        AND
            balance > 0
        LIMIT 1
    `).get(

        userId,

        supplierId

    );

}

// ==========================
// UPDATE PAYMENT
// ==========================
function updatePayment(id, amountPaid, balance, status) {

    db.prepare(`
        UPDATE creditors
        SET
            amount_paid = ?,
            balance = ?,
            status = ?
        WHERE id = ?
    `).run(

        amountPaid,

        balance,

        status,

        id

    );

    return findById(id);

}

// ==========================
// TOTAL OUTSTANDING BALANCE
// ==========================
function getOutstandingTotal(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(balance), 0) AS total
        FROM creditors
        WHERE
            user_id = ?
        AND
            balance > 0
    `).get(userId);

    return Number(result.total) || 0;

}

// ==========================
// GET OUTSTANDING CREDITORS
// ==========================
function findOutstanding(userId) {

    return db.prepare(`
        SELECT
            cr.*,
            s.name AS supplier_name
        FROM creditors cr

        LEFT JOIN suppliers s
            ON s.id = cr.supplier_id

        WHERE
            cr.user_id = ?
        AND
            cr.balance > 0

        ORDER BY cr.created_at DESC
    `).all(userId);

}

module.exports = {

    create,

    findById,

    findAll,

    findBySupplier,

    updatePayment,

    getOutstandingTotal,

    findOutstanding

};