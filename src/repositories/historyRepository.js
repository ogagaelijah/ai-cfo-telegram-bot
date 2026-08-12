const db = require("../database/database");

// ============================================================
// DAILY SALES HISTORY
// ============================================================
//
// Revenue history includes all valid sales.
//
// COMPLETE SALE
//     revenue > 0
//     → use revenue
//
// LEGACY SALE
//     revenue = 0 AND total > 0
//     → use total
//
// INVALID / EMPTY SALE
//     total <= 0 AND revenue <= 0
//     → contributes 0
//
// ============================================================

function getDailySales(
    accountId,
    days = 30
) {

    const safeDays =
        Math.max(
            Number(days) || 30,
            1
        );

    const startOffset =
        `-${safeDays - 1} days`;

    const rows =
        db.prepare(`

            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE(
                        'now',
                        'localtime',
                        ?
                    )

                UNION ALL

                SELECT
                    DATE(
                        date,
                        '+1 day'
                    )

                FROM dates

                WHERE date <
                    DATE(
                        'now',
                        'localtime'
                    )

            )

            SELECT

                dates.date AS date,

                COALESCE(

                    SUM(

                        CASE

                            WHEN
                                COALESCE(
                                    sales.revenue,
                                    0
                                ) > 0

                            THEN
                                sales.revenue

                            WHEN
                                COALESCE(
                                    sales.total,
                                    0
                                ) > 0

                            THEN
                                sales.total

                            ELSE
                                0

                        END

                    ),

                    0

                ) AS sales

            FROM dates

            LEFT JOIN sales

                ON sales.account_id = ?

                AND DATE(
                    sales.created_at,
                    'localtime'
                ) = dates.date

            GROUP BY
                dates.date

            ORDER BY
                dates.date DESC

        `).all(
            startOffset,
            accountId
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
// DAILY PROFITS
// ============================================================

function getDailyProfit(
    accountId,
    days = 30
) {

    const safeDays =
        Math.max(
            Number(days) || 30,
            1
        );

    const startOffset =
        `-${safeDays - 1} days`;

    const rows =
        db.prepare(`

            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE(
                        'now',
                        'localtime',
                        ?
                    )

                UNION ALL

                SELECT
                    DATE(
                        date,
                        '+1 day'
                    )

                FROM dates

                WHERE date <
                    DATE(
                        'now',
                        'localtime'
                    )

            )

            SELECT

                dates.date AS date,

                COALESCE(

                    SUM(
                        sales.profit
                    ),

                    0

                ) AS profit

            FROM dates

            LEFT JOIN sales

                ON sales.account_id = ?

                AND DATE(
                    sales.created_at,
                    'localtime'
                ) = dates.date

            GROUP BY
                dates.date

            ORDER BY
                dates.date DESC

        `).all(
            startOffset,
            accountId
        );

    return rows.map(
        row => ({

            date:
                row.date,

            profit:
                Number(
                    row.profit
                ) || 0

        })
    );
}


// ============================================================
// DAILY EXPENSES
// ============================================================

function getDailyExpenses(
    accountId,
    days = 30
) {

    const safeDays =
        Math.max(
            Number(days) || 30,
            1
        );

    const startOffset =
        `-${safeDays - 1} days`;

    const rows =
        db.prepare(`

            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE(
                        'now',
                        'localtime',
                        ?
                    )

                UNION ALL

                SELECT
                    DATE(
                        date,
                        '+1 day'
                    )

                FROM dates

                WHERE date <
                    DATE(
                        'now',
                        'localtime'
                    )

            )

            SELECT

                dates.date AS date,

                COALESCE(

                    SUM(
                        expenses.amount
                    ),

                    0

                ) AS expenses

            FROM dates

            LEFT JOIN expenses

                ON expenses.account_id = ?

                AND DATE(
                    expenses.created_at,
                    'localtime'
                ) = dates.date

            GROUP BY
                dates.date

            ORDER BY
                dates.date DESC

        `).all(
            startOffset,
            accountId
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
// Returns units sold for each product on each calendar day.
//
// ============================================================

function getProductDailyDemand(
    accountId,
    days = 30
) {

    const safeDays =
        Math.max(
            Number(days) || 30,
            1
        );

    const startOffset =
        `-${safeDays - 1} days`;

    const rows =
        db.prepare(`

            SELECT

                DATE(
                    s.created_at,
                    'localtime'
                ) AS date,

                s.inventory_id
                    AS inventoryId,

                COALESCE(
                    i.product_name,
                    s.item
                ) AS productName,

                SUM(
                    COALESCE(
                        s.quantity,
                        0
                    )
                ) AS unitsSold

            FROM sales s

            LEFT JOIN inventory i

                ON i.id =
                    s.inventory_id

                AND i.account_id =
                    s.account_id

            WHERE

                s.account_id = ?

                AND DATE(
                    s.created_at,
                    'localtime'
                ) >= DATE(
                    'now',
                    'localtime',
                    ?
                )

            GROUP BY

                DATE(
                    s.created_at,
                    'localtime'
                ),

                s.inventory_id,

                COALESCE(
                    i.product_name,
                    s.item
                )

            ORDER BY

                date ASC,

                productName ASC

        `).all(
            accountId,
            startOffset
        );

    return rows.map(
        row => ({

            date:
                row.date,

            inventoryId:

                row.inventoryId !== null

                    ? Number(
                        row.inventoryId
                    )

                    : null,

            productName:

                row.productName ||
                "Unknown Product",

            unitsSold:
                Number(
                    row.unitsSold
                ) || 0

        })
    );
}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    getDailySales,

    getDailyProfit,

    getDailyExpenses,

    getProductDailyDemand

};