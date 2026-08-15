const db =
    require("../../database/database");


// ======================================================
// PERSONAL DEBTOR REPOSITORY
// ======================================================
//
// DATABASE ACCESS ONLY
//
// Personal debtor means:
//
// Someone owes money TO the user.
//
// This repository handles ONLY:
//
// - SQLite
// - personal_debtors table
// - account scoped queries
// - database CRUD operations
//
// It does NOT handle:
//
// - Telegram
// - ctx
// - sessions
// - keyboards
// - user interaction
// - application logic
//
// ======================================================


// ======================================================
// CREATE DEBTOR
// ======================================================

function create(
    accountId,
    debtor
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

    if (!debtor) {

        throw new Error(
            "DEBTOR_DATA_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            INSERT INTO personal_debtors
            (
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
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )

        `).run(

            accountId,

            debtor.name,

            debtor.originalAmount,

            debtor.paidAmount,

            debtor.remainingAmount,

            debtor.dueDate || null,

            debtor.notes || "",

            debtor.status

        );


    return findById(

        accountId,

        result.lastInsertRowid

    );

}


// ======================================================
// FIND ONE DEBTOR
// ======================================================

function findById(
    accountId,
    debtorId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

    if (!debtorId) {

        throw new Error(
            "DEBTOR_ID_REQUIRED"
        );

    }


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
// FIND ALL DEBTORS
// ======================================================

function findAll(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


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

            created_at DESC,

            id DESC

    `).all(

        accountId

    );

}


// ======================================================
// FIND ACTIVE DEBTORS
// ======================================================

function findActive(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


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

            created_at DESC,

            id DESC

    `).all(

        accountId

    );

}


// ======================================================
// UPDATE DEBTOR
// ======================================================

function update(
    accountId,
    debtorId,
    debtor
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

    if (!debtorId) {

        throw new Error(
            "DEBTOR_ID_REQUIRED"
        );

    }

    if (!debtor) {

        throw new Error(
            "DEBTOR_DATA_REQUIRED"
        );

    }


    const existing =
        findById(

            accountId,

            debtorId

        );


    if (!existing) {

        return null;

    }


    const name =
        debtor.name !== undefined
            ? debtor.name
            : existing.name;


    const originalAmount =
        debtor.originalAmount !== undefined
            ? debtor.originalAmount
            : existing.original_amount;


    const paidAmount =
        debtor.paidAmount !== undefined
            ? debtor.paidAmount
            : existing.paid_amount;


    const remainingAmount =
        debtor.remainingAmount !== undefined
            ? debtor.remainingAmount
            : existing.remaining_amount;


    const dueDate =
        debtor.dueDate !== undefined
            ? debtor.dueDate
            : existing.due_date;


    const notes =
        debtor.notes !== undefined
            ? debtor.notes
            : existing.notes;


    const status =
        debtor.status !== undefined
            ? debtor.status
            : existing.status;


    db.prepare(`

        UPDATE personal_debtors

        SET

            name = ?,

            original_amount = ?,

            paid_amount = ?,

            remaining_amount = ?,

            due_date = ?,

            notes = ?,

            status = ?,

            updated_at = CURRENT_TIMESTAMP

        WHERE

            id = ?

            AND account_id = ?

    `).run(

        name,

        originalAmount,

        paidAmount,

        remainingAmount,

        dueDate,

        notes,

        status,

        debtorId,

        accountId

    );


    return findById(

        accountId,

        debtorId

    );

}


// ======================================================
// ADD PAYMENT
// ======================================================

function addPayment(
    accountId,
    debtorId,
    amount
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

    if (!debtorId) {

        throw new Error(
            "DEBTOR_ID_REQUIRED"
        );

    }

    if (
        amount === undefined ||
        amount === null
    ) {

        throw new Error(
            "PAYMENT_AMOUNT_REQUIRED"
        );

    }


    const paymentAmount =
        Number(
            amount
        );


    if (
        !Number.isFinite(
            paymentAmount
        ) ||
        paymentAmount <= 0
    ) {

        throw new Error(
            "INVALID_PAYMENT_AMOUNT"
        );

    }


    const debtor =
        findById(

            accountId,

            debtorId

        );


    if (!debtor) {

        return null;

    }


    const currentRemaining =
        Number(
            debtor.remaining_amount
        );


    if (
        paymentAmount >
        currentRemaining
    ) {

        throw new Error(
            "PAYMENT_EXCEEDS_BALANCE"
        );

    }


    const newPaidAmount =
        Number(
            debtor.paid_amount
        ) +
        paymentAmount;


    const newRemainingAmount =
        Math.max(

            Number(
                debtor.original_amount
            ) -
            newPaidAmount,

            0

        );


    const newStatus =
        newRemainingAmount <= 0
            ? "PAID"
            : "ACTIVE";


    db.prepare(`

        UPDATE personal_debtors

        SET

            paid_amount = ?,

            remaining_amount = ?,

            status = ?,

            updated_at = CURRENT_TIMESTAMP

        WHERE

            id = ?

            AND account_id = ?

    `).run(

        newPaidAmount,

        newRemainingAmount,

        newStatus,

        debtorId,

        accountId

    );


    return findById(

        accountId,

        debtorId

    );

}


// ======================================================
// COMPLETE DEBTOR
// ======================================================

function complete(
    accountId,
    debtorId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

    if (!debtorId) {

        throw new Error(
            "DEBTOR_ID_REQUIRED"
        );

    }


    const debtor =
        findById(

            accountId,

            debtorId

        );


    if (!debtor) {

        return null;

    }


    db.prepare(`

        UPDATE personal_debtors

        SET

            paid_amount = original_amount,

            remaining_amount = 0,

            status = 'PAID',

            updated_at = CURRENT_TIMESTAMP

        WHERE

            id = ?

            AND account_id = ?

    `).run(

        debtorId,

        accountId

    );


    return findById(

        accountId,

        debtorId

    );

}


// ======================================================
// DELETE DEBTOR
// ======================================================

function remove(
    accountId,
    debtorId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

    if (!debtorId) {

        throw new Error(
            "DEBTOR_ID_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            DELETE FROM personal_debtors

            WHERE

                id = ?

                AND account_id = ?

        `).run(

            debtorId,

            accountId

        );


    return {

        success:
            result.changes > 0,

        deletedId:
            debtorId

    };

}


// ======================================================
// GET TOTAL DEBT
// ======================================================
//
// Total amount currently outstanding.
//
// ======================================================

function getTotalDebt(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            SELECT

                COALESCE(
                    SUM(remaining_amount),
                    0
                ) AS total

            FROM personal_debtors

            WHERE

                account_id = ?

                AND status = 'ACTIVE'

        `).get(

            accountId

        );


    return Number(
        result.total || 0
    );

}


// ======================================================
// GET TOTAL PAID
// ======================================================

function getTotalPaid(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            SELECT

                COALESCE(
                    SUM(paid_amount),
                    0
                ) AS total

            FROM personal_debtors

            WHERE

                account_id = ?

        `).get(

            accountId

        );


    return Number(
        result.total || 0
    );

}


// ======================================================
// GET TOTAL REMAINING
// ======================================================

function getTotalRemaining(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            SELECT

                COALESCE(
                    SUM(remaining_amount),
                    0
                ) AS total

            FROM personal_debtors

            WHERE

                account_id = ?

                AND status = 'ACTIVE'

        `).get(

            accountId

        );


    return Number(
        result.total || 0
    );

}


// ======================================================
// GET SUMMARY
// ======================================================

function getSummary(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            SELECT

                COUNT(*) AS total_debtors,

                COALESCE(
                    SUM(original_amount),
                    0
                ) AS total_amount,

                COALESCE(
                    SUM(paid_amount),
                    0
                ) AS total_paid,

                COALESCE(
                    SUM(remaining_amount),
                    0
                ) AS total_remaining,

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


    return {

        totalDebtors:
            Number(
                result.total_debtors || 0
            ),

        totalAmount:
            Number(
                result.total_amount || 0
            ),

        totalPaid:
            Number(
                result.total_paid || 0
            ),

        totalRemaining:
            Number(
                result.total_remaining || 0
            ),

        activeDebtors:
            Number(
                result.active_debtors || 0
            ),

        paidDebtors:
            Number(
                result.paid_debtors || 0
            )

    };

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    findActive,

    update,

    addPayment,

    complete,

    remove,

    getTotalDebt,

    getTotalPaid,

    getTotalRemaining,

    getSummary

};