const db = require("../../database/database");


// ======================================================
// PERSONAL DEBTOR REPOSITORY
// ======================================================
//
// INTERFACE-NEUTRAL DATA ACCESS LAYER
//
// Personal Debtor means:
//
// Someone owes money to the user.
//
// Example:
//
// John owes the user ₦100,000.
//
// This repository knows NOTHING about:
//
// - Telegram
// - Website
// - Mobile App
// - API
// - ctx
// - telegramId
// - sessions
// - keyboards
// - user interface
// - business rules
//
// It only works with:
//
// accountId
// debtor data
//
// Business logic belongs in:
//
// services/personal/personalDebtorService.js
//
// Application orchestration belongs in:
//
// application/personal/personalDebtors.js
//
// ======================================================


// ======================================================
// CREATE PERSONAL DEBTOR
// ======================================================
//
// Creates a new amount owed to the user.
//
// ======================================================

function createPersonalDebtor(
    accountId,
    data
) {

    const result = db.prepare(`
        INSERT INTO personal_debtors
        (
            account_id,
            name,
            original_amount,
            paid_amount,
            remaining_amount,
            due_date,
            notes,
            status
        )

        VALUES
        (
            @accountId,
            @name,
            @originalAmount,
            @paidAmount,
            @remainingAmount,
            @dueDate,
            @notes,
            @status
        )
    `).run({

        accountId,

        name:
            data.name,

        originalAmount:
            data.originalAmount,

        paidAmount:
            data.paidAmount ?? 0,

        remainingAmount:
            data.remainingAmount,

        dueDate:
            data.dueDate ?? null,

        notes:
            data.notes ?? "",

        status:
            data.status ?? "ACTIVE"

    });


    return getPersonalDebtorById(
        accountId,
        result.lastInsertRowid
    );

}


// ======================================================
// GET DEBTOR BY ID
// ======================================================
//
// IMPORTANT:
//
// accountId is always included.
//
// This prevents accidentally retrieving a debtor
// belonging to another account.
//
// ======================================================

function getPersonalDebtorById(
    accountId,
    debtorId
) {

    return db.prepare(`
        SELECT
            id,
            account_id,
            name,
            original_amount,
            paid_amount,
            remaining_amount,
            due_date,
            notes,
            status,
            created_at,
            updated_at

        FROM personal_debtors

        WHERE
            id = ?

            AND account_id = ?

        LIMIT 1
    `).get(

        debtorId,
        accountId

    );

}


// ======================================================
// GET ALL PERSONAL DEBTORS
// ======================================================

function getPersonalDebtors(
    accountId
) {

    return db.prepare(`
        SELECT
            id,
            account_id,
            name,
            original_amount,
            paid_amount,
            remaining_amount,
            due_date,
            notes,
            status,
            created_at,
            updated_at

        FROM personal_debtors

        WHERE
            account_id = ?

        ORDER BY
            created_at DESC
    `).all(

        accountId

    );

}


// ======================================================
// GET ACTIVE PERSONAL DEBTORS
// ======================================================

function getActivePersonalDebtors(
    accountId
) {

    return db.prepare(`
        SELECT
            id,
            account_id,
            name,
            original_amount,
            paid_amount,
            remaining_amount,
            due_date,
            notes,
            status,
            created_at,
            updated_at

        FROM personal_debtors

        WHERE
            account_id = ?

            AND status = 'ACTIVE'

        ORDER BY
            created_at DESC
    `).all(

        accountId

    );

}


// ======================================================
// SEARCH PERSONAL DEBTORS
// ======================================================
//
// Searches by debtor name.
//
// accountId is mandatory for account isolation.
//
// ======================================================

function searchPersonalDebtors(
    accountId,
    searchTerm
) {

    return db.prepare(`
        SELECT
            id,
            account_id,
            name,
            original_amount,
            paid_amount,
            remaining_amount,
            due_date,
            notes,
            status,
            created_at,
            updated_at

        FROM personal_debtors

        WHERE
            account_id = ?

            AND name LIKE ?

        ORDER BY
            name ASC
    `).all(

        accountId,
        `%${searchTerm}%`

    );

}


// ======================================================
// RECORD PAYMENT
// ======================================================
//
// This repository operation records a payment against
// an existing personal debtor.
//
// The service layer is responsible for deciding:
//
// - whether the amount is valid
// - whether the debtor is active
// - whether payment exceeds the balance
// - what status should result
//
// The repository simply persists the calculated values.
//
// ======================================================

function recordPayment(
    accountId,
    debtorId,
    paidAmount,
    remainingAmount,
    status
) {

    const result = db.prepare(`
        UPDATE personal_debtors

        SET
            paid_amount = paid_amount + @paidAmount,

            remaining_amount =
                @remainingAmount,

            status =
                @status,

            updated_at =
                CURRENT_TIMESTAMP

        WHERE
            id = @debtorId

            AND account_id = @accountId
    `).run({

        paidAmount,

        remainingAmount,

        status,

        debtorId,

        accountId

    });


    if (result.changes === 0) {

        return null;

    }


    return getPersonalDebtorById(
        accountId,
        debtorId
    );

}


// ======================================================
// UPDATE PERSONAL DEBTOR
// ======================================================
//
// The service layer determines what fields are allowed
// to change.
//
// This repository persists those already-validated values.
//
// ======================================================

function updatePersonalDebtor(
    accountId,
    debtorId,
    data
) {

    const result = db.prepare(`
        UPDATE personal_debtors

        SET
            name =
                @name,

            due_date =
                @dueDate,

            notes =
                @notes,

            updated_at =
                CURRENT_TIMESTAMP

        WHERE
            id = @debtorId

            AND account_id = @accountId
    `).run({

        name:
            data.name,

        dueDate:
            data.dueDate ?? null,

        notes:
            data.notes ?? "",

        debtorId,

        accountId

    });


    if (result.changes === 0) {

        return null;

    }


    return getPersonalDebtorById(
        accountId,
        debtorId
    );

}


// ======================================================
// UPDATE STATUS
// ======================================================

function updatePersonalDebtorStatus(
    accountId,
    debtorId,
    status
) {

    const result = db.prepare(`
        UPDATE personal_debtors

        SET
            status = ?,

            updated_at =
                CURRENT_TIMESTAMP

        WHERE
            id = ?

            AND account_id = ?
    `).run(

        status,
        debtorId,
        accountId

    );


    if (result.changes === 0) {

        return null;

    }


    return getPersonalDebtorById(
        accountId,
        debtorId
    );

}


// ======================================================
// DELETE PERSONAL DEBTOR
// ======================================================
//
// Hard deletion is deliberately kept at repository
// level.
//
// The service/application layer decides whether the
// operation is permitted.
//
// ======================================================

function deletePersonalDebtor(
    accountId,
    debtorId
) {

    const result = db.prepare(`
        DELETE FROM personal_debtors

        WHERE
            id = ?

            AND account_id = ?
    `).run(

        debtorId,
        accountId

    );


    return {

        deleted:
            result.changes > 0,

        changes:
            result.changes

    };

}


// ======================================================
// GET TOTAL OUTSTANDING PERSONAL DEBTORS
// ======================================================
//
// Returns the total amount currently owed to the user.
//
// ======================================================

function getTotalOutstanding(
    accountId
) {

    const result = db.prepare(`
        SELECT
            COALESCE(
                SUM(remaining_amount),
                0
            ) AS total

        FROM personal_debtors

        WHERE
            account_id = ?

            AND remaining_amount > 0
    `).get(

        accountId

    );


    return Number(
        result.total
    );

}


// ======================================================
// GET PERSONAL DEBTOR SUMMARY
// ======================================================
//
// Provides aggregate information for dashboards,
// reports and future AI intelligence.
//
// ======================================================

function getSummary(
    accountId
) {

    return db.prepare(`
        SELECT

            COUNT(*) AS total_debtors,

            COALESCE(
                SUM(original_amount),
                0
            ) AS total_original_amount,

            COALESCE(
                SUM(paid_amount),
                0
            ) AS total_paid_amount,

            COALESCE(
                SUM(remaining_amount),
                0
            ) AS total_remaining_amount,

            SUM(
                CASE
                    WHEN status = 'ACTIVE'
                    THEN 1
                    ELSE 0
                END
            ) AS active_debtors,

            SUM(
                CASE
                    WHEN status = 'PAID'
                    THEN 1
                    ELSE 0
                END
            ) AS paid_debtors

        FROM personal_debtors

        WHERE
            account_id = ?
    `).get(

        accountId

    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createPersonalDebtor,

    getPersonalDebtorById,

    getPersonalDebtors,

    getActivePersonalDebtors,

    searchPersonalDebtors,

    recordPayment,

    updatePersonalDebtor,

    updatePersonalDebtorStatus,

    deletePersonalDebtor,

    getTotalOutstanding,

    getSummary

};