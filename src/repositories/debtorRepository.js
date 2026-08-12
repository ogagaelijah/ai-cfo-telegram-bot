const db = require("../database/database");

// ======================================================
// CREATE DEBTOR
// ======================================================

function create(debtor) {

    const result = db.prepare(`
        INSERT INTO debtors
        (
            account_id,
            customer_id,
            sale_id,
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

        debtor.accountId,

        debtor.customerId,

        debtor.saleId,

        debtor.totalAmount,

        debtor.amountPaid || 0,

        debtor.balance,

        debtor.status || "UNPAID"

    );

    return findById(
        result.lastInsertRowid
    );

}


// ======================================================
// FIND DEBTOR BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT
            d.*,

            c.name AS customer_name

        FROM debtors d

        LEFT JOIN customers c
            ON c.id = d.customer_id

        WHERE
            d.id = ?

        LIMIT 1
    `).get(id);

}


// ======================================================
// GET ALL DEBTORS FOR ACCOUNT
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT
            d.*,

            c.name AS customer_name

        FROM debtors d

        LEFT JOIN customers c
            ON c.id = d.customer_id

        WHERE
            d.account_id = ?

        ORDER BY
            d.created_at DESC

    `).all(accountId);

}


// ======================================================
// FIND CUSTOMER'S OUTSTANDING DEBT
// ======================================================

function findByCustomer(
    accountId,
    customerId
) {

    return db.prepare(`
        SELECT *
        FROM debtors

        WHERE
            account_id = ?

            AND customer_id = ?

            AND balance > 0

        ORDER BY
            created_at ASC

        LIMIT 1

    `).get(

        accountId,

        customerId

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
        UPDATE debtors

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

        FROM debtors

        WHERE
            account_id = ?

            AND balance > 0

    `).get(accountId);

    return Number(
        result.total
    ) || 0;

}


// ======================================================
// GET OUTSTANDING DEBTORS
// ======================================================

function findOutstanding(accountId) {

    return db.prepare(`
        SELECT
            d.*,

            c.name AS customer_name

        FROM debtors d

        LEFT JOIN customers c
            ON c.id = d.customer_id

        WHERE
            d.account_id = ?

            AND d.balance > 0

        ORDER BY
            d.created_at DESC

    `).all(accountId);

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    findByCustomer,

    updatePayment,

    getOutstandingTotal,

    findOutstanding

};