const db = require("../database/database");

// ==========================
// GET INTERNAL USER ID
// ==========================
function getUserId(telegramId) {

    const user = db.prepare(`
        SELECT id
        FROM users
        WHERE telegram_id = ?
    `).get(telegramId);

    if (!user) {
        throw new Error("User not found.");
    }

    return user.id;
}


// ==========================
// TODAY SALES
// ==========================
function getTodaySales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// YESTERDAY SALES
// ==========================
function getYesterdaySales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime') =
            DATE('now', '-1 day', 'localtime')
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// THIS WEEK SALES
// ==========================
function getThisWeekSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime')
            >= DATE(
                'now',
                'localtime',
                'weekday 0',
                '-6 days'
            )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// LAST WEEK SALES
// ==========================
function getLastWeekSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND DATE(created_at, 'localtime')
        BETWEEN
            DATE(
                'now',
                'localtime',
                'weekday 0',
                '-13 days'
            )
        AND
            DATE(
                'now',
                'localtime',
                'weekday 0',
                '-7 days'
            )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// THIS MONTH SALES
// ==========================
function getThisMonthSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND strftime(
            '%Y-%m',
            created_at,
            'localtime'
        )
        =
        strftime(
            '%Y-%m',
            'now',
            'localtime'
        )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// LAST MONTH SALES
// ==========================
function getLastMonthSales(userId) {

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(total), 0) AS total
        FROM sales
        WHERE user_id = ?
        AND strftime(
            '%Y-%m',
            created_at,
            'localtime'
        )
        =
        strftime(
            '%Y-%m',
            'now',
            'localtime',
            '-1 month'
        )
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// AVERAGE DAILY SALES
// ==========================
function getAverageDailySales(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(
                AVG(daily_total),
                0
            ) AS average
        FROM (
            SELECT
                DATE(
                    created_at,
                    'localtime'
                ) AS day,

                SUM(total) AS daily_total

            FROM sales

            WHERE user_id = ?

            GROUP BY
                DATE(
                    created_at,
                    'localtime'
                )
        )
    `).get(userId);

    return Number(result.average) || 0;
}


// ==========================
// AVERAGE DAILY EXPENSES
// ==========================
function getAverageDailyExpenses(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(
                AVG(daily_total),
                0
            ) AS average
        FROM (
            SELECT
                DATE(
                    created_at,
                    'localtime'
                ) AS day,

                SUM(amount) AS daily_total

            FROM expenses

            WHERE user_id = ?

            GROUP BY
                DATE(
                    created_at,
                    'localtime'
                )
        )
    `).get(userId);

    return Number(result.average) || 0;
}


// ==========================
// AVERAGE DAILY PURCHASES
// ==========================
function getAverageDailyPurchases(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(
                AVG(daily_total),
                0
            ) AS average
        FROM (
            SELECT
                DATE(
                    created_at,
                    'localtime'
                ) AS day,

                SUM(total_amount) AS daily_total

            FROM purchases

            WHERE user_id = ?

            GROUP BY
                DATE(
                    created_at,
                    'localtime'
                )
        )
    `).get(userId);

    return Number(result.average) || 0;
}


// ==========================
// DAILY PURCHASE HISTORY
// ==========================
function getDailyPurchases(
    userId,
    days = 30
) {

    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(total_amount),
                0
            ) AS purchases

        FROM purchases

        WHERE user_id = ?

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) DESC

        LIMIT ?

    `).all(
        userId,
        days
    );

    return rows.map(
        row => ({

            date:
                row.date,

            purchases:
                Number(
                    row.purchases
                ) || 0

        })
    );
}


// ==========================
// DAILY SALES HISTORY
// ==========================
function getDailySales(
    userId,
    days = 30
) {

    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(total),
                0
            ) AS sales

        FROM sales

        WHERE user_id = ?

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) DESC

        LIMIT ?

    `).all(
        userId,
        days
    );

    return rows.map(
        row => ({

            date:
                row.date,

            sales:
                Number(
                    row.sales
                ) || 0

        })
    );
}


// ==========================
// DAILY EXPENSE HISTORY
// ==========================
function getDailyExpenses(
    userId,
    days = 30
) {

    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(amount),
                0
            ) AS expenses

        FROM expenses

        WHERE user_id = ?

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) DESC

        LIMIT ?

    `).all(
        userId,
        days
    );

    return rows.map(
        row => ({

            date:
                row.date,

            expenses:
                Number(
                    row.expenses
                ) || 0

        })
    );
}


// ==========================
// PRODUCT DAILY DEMAND HISTORY
// ==========================
//
// Returns product-level daily quantities sold.
//
// IMPORTANT:
// A sale does NOT always have an inventory_id.
//
// Therefore:
// 1. LEFT JOIN is used instead of INNER JOIN.
// 2. inventory.product_name is preferred.
// 3. sales.item is used as the fallback product name.
//
// This ensures sales without an inventory link
// are still included in demand calculations.
//
// Used by the Inventory Demand Forecast service.
// ==========================

function getProductDailyDemand(
    telegramId,
    days = 30
) {

    const userId =
        getUserId(telegramId);


    const rows =
        db.prepare(`
            SELECT

                COALESCE(
                    inventory.product_name,
                    sales.item
                ) AS product_name,

                DATE(
                    sales.created_at,
                    'localtime'
                ) AS date,

                COALESCE(
                    SUM(sales.quantity),
                    0
                ) AS quantity

            FROM sales

            LEFT JOIN inventory
                ON inventory.id =
                   sales.inventory_id

            WHERE sales.user_id = ?

            AND DATE(
                sales.created_at,
                'localtime'
            ) >= DATE(
                'now',
                'localtime',
                '-29 days'
            )

            GROUP BY

                COALESCE(
                    inventory.product_name,
                    sales.item
                ),

                DATE(
                    sales.created_at,
                    'localtime'
                )

            ORDER BY

                date ASC,

                product_name ASC

            LIMIT ?

        `).all(

            userId,

            days * 100
        );


    return rows.map(
        row => ({

            product_name:
                row.product_name,

            date:
                row.date,

            quantity:
                Number(
                    row.quantity
                ) || 0

        })
    );
}


// ==========================
// EXPORT
// ==========================
module.exports = {

    getUserId,

    getTodaySales,

    getYesterdaySales,

    getThisWeekSales,

    getLastWeekSales,

    getThisMonthSales,

    getLastMonthSales,

    getAverageDailySales,

    getAverageDailyExpenses,

    getAverageDailyPurchases,

    getDailyPurchases,

    getDailySales,

    getDailyExpenses,

    getProductDailyDemand

};