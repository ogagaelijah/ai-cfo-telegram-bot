const db = require("../database/database");

/**
 * Create a debt record
 */
function create(debt) {

    const result = db.prepare(`
        INSERT INTO debtors
        (
            user_id,
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

        debt.userId,
        debt.customerId,
        debt.saleId,
        debt.totalAmount,
        debt.amountPaid,
        debt.balance,
        debt.status

    );

    return findById(result.lastInsertRowid);

}

/**
 * Find debt by ID
 */
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM debtors
        WHERE id = ?
    `).get(id);

}

/**
 * Get all debtor records
 */
function findAll(userId) {

    return db.prepare(`
        SELECT
            d.*,
            c.name AS customer_name,
            s.item,
            s.quantity,
            s.unit_price
        FROM debtors d

        JOIN customers c
            ON c.id = d.customer_id

        LEFT JOIN sales s
            ON s.id = d.sale_id

        WHERE d.user_id = ?

        ORDER BY d.created_at DESC
    `).all(userId);

}

/**
 * Find customer's unpaid debt
 */
function findByCustomer(userId, customerId) {

    return db.prepare(`
        SELECT *
        FROM debtors
        WHERE
            user_id = ?
        AND
            customer_id = ?
        AND
            status = 'UNPAID'
        LIMIT 1
    `).get(

        userId,
        customerId

    );

}

/**
 * Update payment
 */
function updatePayment(id, amountPaid, balance, status) {

    db.prepare(`
        UPDATE debtors
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

/**
 * Total outstanding balance
 */
function getOutstandingTotal(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(balance), 0) AS total
        FROM debtors
        WHERE
            user_id = ?
        AND
            status = 'UNPAID'
    `).get(userId);

    return result.total;

}

module.exports = {

    create,

    findById,

    findAll,

    findByCustomer,

    updatePayment,

    getOutstandingTotal

};