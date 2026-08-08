const db =
require("../database/database");

// ============================================================
// DAILY SALES HISTORY
// ============================================================
//
// IMPORTANT:
// Daily sales history uses recognized revenue, not raw
// transaction totals.
//
// This prevents legacy/incomplete sales records where:
//     total > 0
//     revenue = 0
//
// from incorrectly inflating financial forecasts.
//
// Complete sales records use:
//     revenue
//
// ============================================================

function getDailySales(
userId,
days = 30
) {

    const rows =
        db.prepare(`
            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE(
                        'now',
                        'localtime',
                        '-29 days'
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
                            WHEN sales.revenue > 0
                                THEN sales.revenue
                            ELSE 0
                        END
                    ),
                    0
                ) AS sales

            FROM dates

            LEFT JOIN sales
                ON sales.user_id = ?

                AND DATE(
                    sales.created_at,
                    'localtime'
                ) = dates.date

            GROUP BY
                dates.date

            ORDER BY
                dates.date DESC

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


// ============================================================
// DAILY PROFITS
// ============================================================

function getDailyProfit(
userId,
days = 30
) {

    const rows =
        db.prepare(`
            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE(
                        'now',
                        'localtime',
                        '-29 days'
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
                    SUM(sales.profit),
                    0
                ) AS profit

            FROM dates

            LEFT JOIN sales
                ON sales.user_id = ?

                AND DATE(
                    sales.created_at,
                    'localtime'
                ) = dates.date

            GROUP BY
                dates.date

            ORDER BY
                dates.date DESC

            LIMIT ?

        `).all(
            userId,
            days
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
userId,
days = 30
) {

    const rows =
        db.prepare(`
            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE(
                        'now',
                        'localtime',
                        '-29 days'
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
                    SUM(expenses.amount),
                    0
                ) AS expenses

            FROM dates

            LEFT JOIN expenses
                ON expenses.user_id = ?

                AND DATE(
                    expenses.created_at,
                    'localtime'
                ) = dates.date

            GROUP BY
                dates.date

            ORDER BY
                dates.date DESC

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


// ============================================================
// PRODUCT DAILY DEMAND HISTORY
// ============================================================
//
// Returns the number of units sold for each product on each
// calendar day.
//
// This is intentionally different from getDailySales().
//
// getDailySales():
//     → business-level recognized revenue
//
// getProductDailyDemand():
//     → product-level unit demand
//
// This data will be used by the inventory demand forecasting
// engine.
//
// ============================================================

function getProductDailyDemand(
userId,
days = 30
) {

    const rows =
        db.prepare(`
            SELECT

                DATE(
                    s.created_at,
                    'localtime'
                ) AS date,

                s.inventory_id AS inventoryId,

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

                AND i.user_id =
                    s.user_id

            WHERE
                s.user_id = ?

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
            userId,
            `-${Math.max(
                Number(days) || 30,
                1
            ) - 1} days`
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