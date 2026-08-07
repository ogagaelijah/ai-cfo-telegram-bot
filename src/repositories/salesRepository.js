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
            inventory_id,
            item,
            quantity,
            unit_price,
            cost_price,
            revenue,
            cost_of_goods,
            profit,
            total
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
            ?,
            ?,
            ?
        )
    `).run(

        sale.userId,

        sale.customerId,

        sale.inventoryId,

        sale.item,

        sale.quantity,

        sale.unitPrice,

        sale.costPrice,

        sale.revenue,

        sale.costOfGoods,

        sale.profit,

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
        AND DATE(s.created_at, 'localtime') =
            DATE('now', 'localtime')
        ORDER BY s.created_at DESC
    `).all(userId);

}

/**
 * Get total sales amount
 */
function getTotalSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS totalSales
        FROM sales
        WHERE user_id = ?
    `).get(userId);

    return Number(result.totalSales) || 0;

}

/**
 * Get complete sales history
 */
function getSalesHistory(userId) {

    return db.prepare(`
        SELECT
            *
        FROM sales
        WHERE user_id = ?
        ORDER BY created_at ASC
    `).all(userId);

}

/**
 * Get last 30 days sales
 */
function getLast30DaysSales(userId) {

    return db.prepare(`
        SELECT
            *
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at) >= DATE('now', '-30 days')
        ORDER BY created_at ASC
    `).all(userId);

}

module.exports = {

    create,

    findById,

    findAll,

    findToday,

    getTotalSales,

    getSalesHistory,

    getLast30DaysSales

};