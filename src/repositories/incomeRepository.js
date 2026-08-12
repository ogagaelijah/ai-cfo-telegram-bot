const db = require("../database/database");

// ======================================================
// CREATE INCOME
// ======================================================

function create(accountId, income) {

    const result = db.prepare(`
        INSERT INTO income
        (
            account_id,
            source,
            amount,
            notes
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?
        )
    `).run(

        accountId,

        income.source,

        income.amount,

        income.notes || ""

    );

    return findById(
        result.lastInsertRowid
    );
}


// ======================================================
// FIND BY ID
// ======================================================

function findById(id) {

    return db.prepare(`
        SELECT *
        FROM income
        WHERE id = ?
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

        FROM income

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

        FROM income

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
// ALL INCOME
// ======================================================

function findAll(accountId) {

    return db.prepare(`
        SELECT *
        FROM income

        WHERE
            account_id = ?

        ORDER BY
            created_at DESC
    `).all(accountId);

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    getTodayTotal,

    getMonthlyTotal

};