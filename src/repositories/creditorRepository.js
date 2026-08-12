const db = require("../database/database");

// ======================================================
// CREATE CREDITOR
// ======================================================

function create(creditor) {

    const result = db.prepare(`
        INSERT INTO creditors
        (
            account_id,
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

        creditor.accountId,

        creditor.supplierId,

        creditor.purchaseId,

        creditor.totalAmount,

        creditor.amountPaid || 0,

        creditor.balance,

        creditor.status || "UNPAID"

    );

    return findById(
        result.lastInsertRowid
    );

}


// ======================================================
// FIND CREDITOR BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT
            cr.*,

            s.name AS supplier_name

        FROM creditors cr

        LEFT JOIN suppliers s
            ON s.id = cr.supplier_id

        WHERE
            cr.id = ?

        LIMIT 1
    `).get(id);

}


// ======================================================
// GET ALL CREDITORS FOR ACCOUNT
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT
            cr.*,

            s.name AS supplier_name

        FROM creditors cr

        LEFT JOIN suppliers s
            ON s.id = cr.supplier_id

        WHERE
            cr.account_id = ?

        ORDER BY
            cr.created_at DESC

    `).all(accountId);

}


// ======================================================
// FIND SUPPLIER'S OUTSTANDING DEBT
// ======================================================

function findBySupplier(
    accountId,
    supplierId
) {

    return db.prepare(`
        SELECT *
        FROM creditors

        WHERE
            account_id = ?

            AND supplier_id = ?

            AND balance > 0

        ORDER BY
            created_at ASC

        LIMIT 1

    `).get(

        accountId,

        supplierId

    );

}


// ======================================================
// UPDATE PAYMENT
// ======================================================

function updatePayment(
    id,
    amountPaid,
    balance,
    status
) {

    db.prepare(`
        UPDATE creditors

        SET
            amount_paid = ?,

            balance = ?,

            status = ?

        WHERE
            id = ?

    `).run(

        amountPaid,

        balance,

        status,

        id

    );

    return findById(id);

}


// ======================================================
// TOTAL OUTSTANDING BALANCE
// ======================================================

function getOutstandingTotal(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(balance),
                0
            ) AS total

        FROM creditors

        WHERE
            account_id = ?

            AND balance > 0

    `).get(accountId);

    return Number(
        result.total
    ) || 0;

}


// ======================================================
// GET OUTSTANDING CREDITORS
// ======================================================

function findOutstanding(accountId) {

    return db.prepare(`
        SELECT
            cr.*,

            s.name AS supplier_name

        FROM creditors cr

        LEFT JOIN suppliers s
            ON s.id = cr.supplier_id

        WHERE
            cr.account_id = ?

            AND cr.balance > 0

        ORDER BY
            cr.created_at DESC

    `).all(accountId);

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    findBySupplier,

    updatePayment,

    getOutstandingTotal,

    findOutstanding

};