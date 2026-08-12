const db = require("../database/database");

// ============================================================
// BUSINESS TRENDS REPOSITORY
// ============================================================
//
// ACCOUNT-BASED DATA ACCESS LAYER
//
// IMPORTANT:
//
// Business data belongs to an ACCOUNT.
//
// This repository does NOT know about:
//
// - Telegram
// - Web
// - Mobile
// - HTTP
// - Sessions
// - Interface users
//
// It receives accountId directly.
//
// Architecture:
//
// Interface
//     ↓
// Application Layer
//     ↓
// Account Context
//     ↓
// Business Trends Service
//     ↓
// THIS REPOSITORY
//     ↓
// SQLite
//
// ============================================================


// ============================================================
// TODAY SALES
// ============================================================
//
// Uses recognized revenue.
//
// ============================================================

function getTodaySales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(revenue),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?

        AND DATE(
            created_at,
            'localtime'
        ) =
        DATE(
            'now',
            'localtime'
        )
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// YESTERDAY SALES
// ============================================================

function getYesterdaySales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(revenue),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?

        AND DATE(
            created_at,
            'localtime'
        ) =
        DATE(
            'now',
            '-1 day',
            'localtime'
        )
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// THIS WEEK SALES
// ============================================================
//
// Current week:
//
// Sunday → Saturday
//
// Uses recognized revenue.
//
// ============================================================

function getThisWeekSales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(revenue),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?

        AND DATE(
            created_at,
            'localtime'
        )
        >=
        DATE(
            'now',
            'localtime',
            'weekday 0',
            '-6 days'
        )
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// LAST WEEK SALES
// ============================================================
//
// Uses recognized revenue.
//
// ============================================================

function getLastWeekSales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(revenue),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?

        AND DATE(
            created_at,
            'localtime'
        )
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
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// THIS MONTH SALES
// ============================================================

function getThisMonthSales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(revenue),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?

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
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// LAST MONTH SALES
// ============================================================

function getLastMonthSales(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(revenue),
                0
            ) AS total

        FROM sales

        WHERE account_id = ?

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
    `).get(accountId);

    return Number(result.total) || 0;
}


// ============================================================
// AVERAGE DAILY SALES
// ============================================================
//
// Calculates average recognized revenue
// across days where recognized sales
// actually occurred.
//
// Zero-sales days are intentionally
// excluded.
//
// ============================================================

function getAverageDailySales(accountId) {

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

                SUM(
                    CASE
                        WHEN revenue > 0
                        THEN revenue
                        ELSE 0
                    END
                ) AS daily_total

            FROM sales

            WHERE account_id = ?

            GROUP BY
                DATE(
                    created_at,
                    'localtime'
                )

            HAVING
                daily_total > 0
        )
    `).get(accountId);

    return Number(result.average) || 0;
}


// ============================================================
// AVERAGE DAILY EXPENSES
// ============================================================
//
// Calculates average expenses across
// all calendar days in the recorded
// expense history.
//
// Zero-expense days are included.
//
// ============================================================

function getAverageDailyExpenses(accountId) {

    const result = db.prepare(`
        WITH RECURSIVE calendar(date) AS (

            SELECT
                MIN(
                    DATE(
                        created_at,
                        'localtime'
                    )
                )

            FROM expenses

            WHERE account_id = ?


            UNION ALL


            SELECT
                DATE(
                    date,
                    '+1 day'
                )

            FROM calendar

            WHERE date <
                DATE(
                    'now',
                    'localtime'
                )
        )


        SELECT

            COALESCE(
                AVG(
                    daily_total
                ),
                0
            ) AS average

        FROM (

            SELECT

                calendar.date,

                COALESCE(
                    SUM(
                        expenses.amount
                    ),
                    0
                ) AS daily_total

            FROM calendar

            LEFT JOIN expenses

                ON DATE(
                    expenses.created_at,
                    'localtime'
                )
                =
                calendar.date

                AND expenses.account_id = ?

            GROUP BY
                calendar.date
        )

    `).get(
        accountId,
        accountId
    );

    return Number(result.average) || 0;
}


// ============================================================
// AVERAGE DAILY PURCHASES
// ============================================================
//
// Calculates average cash paid on
// days where purchase payments
// actually occurred.
//
// ============================================================

function getAverageDailyPurchases(accountId) {

    const result = db.prepare(`
        SELECT

            COALESCE(
                AVG(
                    daily_cash_paid
                ),
                0
            ) AS average

        FROM (

            SELECT

                DATE(
                    created_at,
                    'localtime'
                ) AS day,

                SUM(
                    amount_paid
                ) AS daily_cash_paid

            FROM purchases

            WHERE account_id = ?

            GROUP BY
                DATE(
                    created_at,
                    'localtime'
                )
        )

    `).get(accountId);

    return Number(result.average) || 0;
}


// ============================================================
// AVERAGE DAILY PURCHASE CASH OUTFLOW
// ============================================================
//
// Measures actual supplier cash payments
// across the complete forecasting period.
//
// This is different from:
//
// PURCHASE VALUE
//     → total_amount
//
// COGS
//     → cost_of_goods from sales
//
// PURCHASE-DAY PAYMENT AVERAGE
//     → getAverageDailyPurchases()
//
// SUPPLIER BALANCE
//     → outstanding amount owed
//
// ============================================================

function getAverageDailyPurchaseCashOutflow(
    accountId,
    days = 30
) {

    const safeDays =
        Number(days) > 0
            ? Math.floor(Number(days))
            : 30;


    const result = db.prepare(`
        SELECT

            COALESCE(
                SUM(
                    amount_paid
                ),
                0
            ) AS total_cash_paid

        FROM purchases

        WHERE account_id = ?

        AND DATE(
            created_at,
            'localtime'
        )
        >=
        DATE(
            'now',
            'localtime',
            ?
        )

    `).get(
        accountId,
        `-${safeDays} days`
    );


    const totalCashPaid =
        Number(
            result.total_cash_paid
        ) || 0;


    return (
        totalCashPaid /
        safeDays
    );
}


// ============================================================
// DAILY PURCHASE HISTORY
// ============================================================

function getDailyPurchases(
    accountId,
    days = 30
) {

    const safeDays =
        Number(days) > 0
            ? Math.floor(Number(days))
            : 30;


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

        WHERE account_id = ?

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
        accountId,
        safeDays
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


// ============================================================
// DAILY SALES HISTORY
// ============================================================
//
// Uses recognized revenue rather than
// raw transaction total.
//
// ============================================================

function getDailySales(
    accountId,
    days = 30
) {

    const safeDays =
        Number(days) > 0
            ? Math.floor(Number(days))
            : 30;


    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(revenue),
                0
            ) AS sales

        FROM sales

        WHERE account_id = ?

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
        accountId,
        safeDays
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


// ============================================================
// DAILY EXPENSE HISTORY
// ============================================================

function getDailyExpenses(
    accountId,
    days = 30
) {

    const safeDays =
        Number(days) > 0
            ? Math.floor(Number(days))
            : 30;


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

        WHERE account_id = ?

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
        accountId,
        safeDays
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


// ============================================================
// PRODUCT DAILY DEMAND HISTORY
// ============================================================
//
// Returns product-level daily
// quantities sold.
//
// A sale does not always have an
// inventory_id.
//
// Therefore:
//
// 1. LEFT JOIN is used.
// 2. inventory.product_name is preferred.
// 3. sales.item is used as fallback.
//
// ============================================================

function getProductDailyDemand(
    accountId,
    days = 30
) {

    const safeDays =
        Number(days) > 0
            ? Math.floor(Number(days))
            : 30;


    const rows = db.prepare(`
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
                SUM(
                    sales.quantity
                ),
                0
            ) AS quantity

        FROM sales

        LEFT JOIN inventory

            ON inventory.id =
               sales.inventory_id

            AND inventory.account_id = ?

        WHERE sales.account_id = ?

        AND DATE(
            sales.created_at,
            'localtime'
        )
        >=
        DATE(
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
        accountId,
        accountId,
        safeDays * 100
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


// ============================================================
// DAILY COGS HISTORY
// ============================================================
//
// COGS represents the cost of inventory
// actually sold.
//
// It does NOT represent purchases.
//
// ============================================================

function getDailyCOGS(
    accountId,
    days = 30
) {

    const safeDays =
        Number(days) > 0
            ? Math.floor(Number(days))
            : 30;


    const rows = db.prepare(`
        SELECT

            DATE(
                created_at,
                'localtime'
            ) AS date,

            COALESCE(
                SUM(revenue),
                0
            ) AS revenue,

            COALESCE(
                SUM(cost_of_goods),
                0
            ) AS costOfGoods

        FROM sales

        WHERE account_id = ?

        AND DATE(
            created_at,
            'localtime'
        )
        >=
        DATE(
            'now',
            'localtime',
            '-29 days'
        )

        GROUP BY
            DATE(
                created_at,
                'localtime'
            )

        ORDER BY
            DATE(
                created_at,
                'localtime'
            ) ASC

        LIMIT ?
    `).all(
        accountId,
        safeDays
    );


    return rows.map(
        row => ({

            date:
                row.date,

            revenue:
                Number(
                    row.revenue
                ) || 0,

            costOfGoods:
                Number(
                    row.costOfGoods
                ) || 0

        })
    );
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getTodaySales,

    getYesterdaySales,

    getThisWeekSales,

    getLastWeekSales,

    getThisMonthSales,

    getLastMonthSales,

    getAverageDailySales,

    getAverageDailyExpenses,

    getAverageDailyPurchases,

    getAverageDailyPurchaseCashOutflow,

    getDailyPurchases,

    getDailySales,

    getDailyExpenses,

    getProductDailyDemand,

    getDailyCOGS

};