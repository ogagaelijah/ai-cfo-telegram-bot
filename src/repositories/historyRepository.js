const db = require("../database/database");


// ==========================
// DAILY SALES HISTORY
// ==========================
function getDailySales(userId, days = 30) {

    const rows =
        db.prepare(`
            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE('now', 'localtime', '-29 days')

                UNION ALL

                SELECT
                    DATE(date, '+1 day')

                FROM dates

                WHERE date <
                    DATE('now', 'localtime')

            )

            SELECT

                dates.date AS date,

                COALESCE(
                    SUM(sales.total),
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


    return rows.map(row => ({

        date:
            row.date,

        sales:
            Number(row.sales) || 0

    }));

}


// ==========================
// DAILY PROFITS
// ==========================
function getDailyProfit(userId, days = 30) {

    const rows =
        db.prepare(`
            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE('now', 'localtime', '-29 days')

                UNION ALL

                SELECT
                    DATE(date, '+1 day')

                FROM dates

                WHERE date <
                    DATE('now', 'localtime')

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


    return rows.map(row => ({

        date:
            row.date,

        profit:
            Number(row.profit) || 0

    }));

}


// ==========================
// DAILY EXPENSES
// ==========================
function getDailyExpenses(
    userId,
    days = 30
) {

    const rows =
        db.prepare(`
            WITH RECURSIVE dates(date) AS (

                SELECT
                    DATE('now', 'localtime', '-29 days')

                UNION ALL

                SELECT
                    DATE(date, '+1 day')

                FROM dates

                WHERE date <
                    DATE('now', 'localtime')

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


    return rows.map(row => ({

        date:
            row.date,

        expenses:
            Number(row.expenses) || 0

    }));

}


// ==========================
// EXPORT
// ==========================
module.exports = {

    getDailySales,

    getDailyProfit,

    getDailyExpenses

};