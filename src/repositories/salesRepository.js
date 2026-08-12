const db = require("../database/database");

// ======================================================
// CREATE SALE
// ======================================================

function create(sale) {

    const result = db.prepare(`
        INSERT INTO sales
        (
            account_id,
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

        sale.accountId,

        sale.customerId || null,

        sale.inventoryId || null,

        sale.item,

        sale.quantity,

        sale.unitPrice,

        sale.costPrice || 0,

        sale.revenue || sale.total || 0,

        sale.costOfGoods || 0,

        sale.profit || 0,

        sale.total

    );

    return findById(
        result.lastInsertRowid
    );

}


// ======================================================
// FIND SALE BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT
            s.*,

            c.name AS customer_name

        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id

        WHERE
            s.id = ?

        LIMIT 1

    `).get(id);

}


// ======================================================
// GET ALL SALES FOR ACCOUNT
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT
            s.*,

            c.name AS customer_name

        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id

        WHERE
            s.account_id = ?

        ORDER BY
            s.created_at DESC

    `).all(accountId);

}


// ======================================================
// GET TODAY'S SALES
// ======================================================

function findToday(accountId) {

    return db.prepare(`
        SELECT
            s.*,

            c.name AS customer_name

        FROM sales s

        LEFT JOIN customers c
            ON s.customer_id = c.id

        WHERE
            s.account_id = ?

            AND DATE(
                s.created_at,
                'localtime'
            )
            =
            DATE(
                'now',
                'localtime'
            )

        ORDER BY
            s.created_at DESC

    `).all(accountId);

}


// ======================================================
// GET TOTAL SALES AMOUNT
// ======================================================

function getTotalSales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(
                    CASE

                        WHEN COALESCE(
                            revenue,
                            0
                        ) > 0

                        THEN revenue

                        WHEN COALESCE(
                            total,
                            0
                        ) > 0

                        THEN total

                        ELSE 0

                    END
                ),
                0
            ) AS totalSales

        FROM sales

        WHERE
            account_id = ?

    `).get(accountId);

    return Number(
        result.totalSales
    ) || 0;

}


// ======================================================
// GET COMPLETE SALES HISTORY
// ======================================================

function getSalesHistory(accountId) {

    return db.prepare(`
        SELECT *
        FROM sales

        WHERE
            account_id = ?

        ORDER BY
            created_at ASC

    `).all(accountId);

}


// ======================================================
// GET LAST 30 DAYS SALES
// ======================================================

function getLast30DaysSales(accountId) {

    return db.prepare(`
        SELECT *
        FROM sales

        WHERE
            account_id = ?

            AND DATE(
                created_at,
                'localtime'
            )
            >= DATE(
                'now',
                'localtime',
                '-30 days'
            )

        ORDER BY
            created_at ASC

    `).all(accountId);

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    findToday,

    getTotalSales,

    getSalesHistory,

    getLast30DaysSales

};