const db = require("../database/database");

/**
 * Create a new sale
 */
function create(sale) {

    const result = db.prepare(`
        INSERT INTO sales
        (
            user_id,
            customer_id,
            item,
            quantity,
            unit_price,
            total
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        sale.userId,

        sale.customerId,

        sale.item,

        sale.quantity,

        sale.unitPrice,

        sale.total

    );

    return findById(result.lastInsertRowid);

}

/**
 * Find sale by ID
 */
function findById(id) {

    return db.prepare(`
        SELECT
            s.*,
            c.name AS customer_name
        FROM sales s
        LEFT JOIN customers c
            ON s.customer_id = c.id
        WHERE s.id = ?
    `).get(id);

}

/**
 * Get all sales for a user
 */
function findAll(userId) {

    return db.prepare(`
        SELECT
            s.*,
            c.name AS customer_name
        FROM sales s
        LEFT JOIN customers c
            ON s.customer_id = c.id
        WHERE s.user_id = ?
        ORDER BY s.created_at DESC
    `).all(userId);

}

/**
 * Get today's sales
 */
function findToday(userId) {

    return db.prepare(`
        SELECT
            s.*,
            c.name AS customer_name
        FROM sales s
        LEFT JOIN customers c
            ON s.customer_id = c.id
        WHERE s.user_id = ?
        AND DATE(s.created_at) = DATE('now')
        ORDER BY s.created_at DESC
    `).all(userId);

}

/**
 * Get total sales amount
 */
function getTotalSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total),0) AS totalSales
        FROM sales
        WHERE user_id = ?
    `).get(userId);

    return result.totalSales;

}

module.exports = {

    create,

    findById,

    findAll,

    findToday,

    getTotalSales

};