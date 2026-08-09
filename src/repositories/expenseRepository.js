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
// CREATE EXPENSE
// ==========================
function create(telegramId, expense) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        INSERT INTO expenses
        (
            user_id,
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

        userId,

        expense.item,

        expense.category,

        expense.amount,

        expense.notes || ""

    );

    return findById(
        result.lastInsertRowid
    );
}


// ==========================
// FIND BY ID
// ==========================
function findById(id) {

    return db.prepare(`
        SELECT *
        FROM expenses
        WHERE id = ?
    `).get(id);

}


// ==========================
// TODAY TOTAL
// ==========================
function getTodayTotal(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount), 0) AS total
        FROM expenses
        WHERE user_id = ?
        AND DATE(created_at,'localtime')
            = DATE('now','localtime')
    `).get(userId);

    return Number(result.total) || 0;
}


// ==========================
// MONTHLY TOTAL
// ==========================
function getMonthlyTotal(telegramId) {

    const userId =
        getUserId(telegramId);

    const result = db.prepare(`
        SELECT
            COALESCE(SUM(amount),0) AS total
        FROM expenses
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
// BY CATEGORY
// ==========================
function getByCategory(telegramId) {

    const userId =
        getUserId(telegramId);

    return db.prepare(`
        SELECT
            category,
            SUM(amount) AS total
        FROM expenses
        WHERE user_id = ?
        GROUP BY category
        ORDER BY total DESC
    `).all(userId);
}


// ==========================
// GET ALL EXPENSES
// ==========================
function findAll(telegramId) {

    const userId =
        getUserId(telegramId);

    return db.prepare(`
        SELECT *
        FROM expenses
        WHERE user_id = ?
        ORDER BY created_at DESC
    `).all(userId);
}


// ==========================================================
// GET DAILY EXPENSE HISTORY
// ==========================================================
//
// Returns one row per calendar day from the first recorded
// expense through today.
//
// Zero-expense days are intentionally included.
//
// ==========================================================
function getDailyHistory(telegramId) {

    const userId =
        getUserId(telegramId);

    const firstExpense =
        db.prepare(`
            SELECT
                MIN(
                    DATE(
                        created_at,
                        'localtime'
                    )
                ) AS first_date
            FROM expenses
            WHERE user_id = ?
        `).get(userId);


    // No expense history.
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
            WHERE date <
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

            AND expenses.user_id = ?

        GROUP BY
            calendar.date

        ORDER BY
            calendar.date ASC

    `).all(
        firstExpense.first_date,
        userId
    ).map(day => ({

        date:
            day.date,

        expenses:
            Number(
                day.expenses
            ) || 0

    }));

}


// ==========================
// EXPORT
// ==========================
module.exports = {

    create,

    findById,

    findAll,

    getTodayTotal,

    getMonthlyTotal,

    getByCategory,

    getDailyHistory

};