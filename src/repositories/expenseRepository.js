const db = require("../database/database");

// ======================================================
// CREATE EXPENSE
// ======================================================

function create(accountId, expense) {

    const result = db.prepare(`
        INSERT INTO expenses
        (
            account_id,
            item,
            category,
            amount,
            notes
        )

        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        accountId,

        expense.item,

        expense.category || null,

        expense.amount,

        expense.notes || ""

    );

    return findById(
        result.lastInsertRowid
    );

}


// ======================================================
// FIND EXPENSE BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT
            *

        FROM expenses

        WHERE
            id = ?

        LIMIT 1

    `).get(id);

}


// ======================================================
// TODAY TOTAL
// ======================================================

function getTodayTotal(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(amount),
                0
            ) AS total

        FROM expenses

        WHERE
            account_id = ?

            AND DATE(
                created_at,
                'localtime'
            )
            =
            DATE(
                'now',
                'localtime'
            )

    `).get(accountId);

    return Number(
        result.total
    ) || 0;

}


// ======================================================
// MONTHLY TOTAL
// ======================================================

function getMonthlyTotal(accountId) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(amount),
                0
            ) AS total

        FROM expenses

        WHERE
            account_id = ?

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

    return Number(
        result.total
    ) || 0;

}


// ======================================================
// BY CATEGORY
// ======================================================

function getByCategory(accountId) {

    return db.prepare(`
        SELECT
            category,

            COALESCE(
                SUM(amount),
                0
            ) AS total

        FROM expenses

        WHERE
            account_id = ?

        GROUP BY
            category

        ORDER BY
            total DESC

    `).all(accountId);

}


// ======================================================
// GET ALL EXPENSES
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT
            *

        FROM expenses

        WHERE
            account_id = ?

        ORDER BY
            created_at DESC

    `).all(accountId);

}


// ======================================================
// GET DAILY EXPENSE HISTORY
// ======================================================
//
// Returns one row per calendar day from the first
// recorded expense through today.
//
// Zero-expense days are included.
//
// ======================================================

function getDailyHistory(accountId) {

    const firstExpense = db.prepare(`
        SELECT
            MIN(
                DATE(
                    created_at,
                    'localtime'
                )
            ) AS first_date

        FROM expenses

        WHERE
            account_id = ?

    `).get(accountId);


    if (
        !firstExpense ||
        !firstExpense.first_date
    ) {

        return [];

    }


    return db.prepare(`
        WITH RECURSIVE calendar(date) AS (

            SELECT
                ?

            UNION ALL

            SELECT
                DATE(
                    date,
                    '+1 day'
                )

            FROM calendar

            WHERE
                date <
                DATE(
                    'now',
                    'localtime'
                )

        )

        SELECT

            calendar.date AS date,

            COALESCE(
                SUM(expenses.amount),
                0
            ) AS expenses

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

        ORDER BY
            calendar.date ASC

    `).all(

        firstExpense.first_date,

        accountId

    ).map(day => ({

        date:
            day.date,

        expenses:
            Number(
                day.expenses
            ) || 0

    }));

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    getTodayTotal,

    getMonthlyTotal,

    getByCategory,

    getDailyHistory

};