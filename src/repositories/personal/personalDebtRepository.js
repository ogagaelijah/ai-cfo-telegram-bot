const db =
    require("../../database/database");


// ======================================================
// PERSONAL DEBT REPOSITORY
// ======================================================
//
// DATABASE ACCESS ONLY
//
// This repository knows about:
//
// - SQLite
// - personal_debts table
// - accountId
// - debt records
//
// It does NOT know about:
//
// - Telegram
// - telegramId
// - ctx
// - keyboards
// - sessions
// - UI
//
// Architecture:
//
// Interface
//     ↓
// Application
//     ↓
// Service
//     ↓
// Repository
//     ↓
// Database
//
// IMPORTANT:
//
// Every database operation is scoped by accountId.
//
// This is essential for the multi-account architecture
// and our long-term 10,000+ user target.
// ======================================================



// ======================================================
// CREATE DEBT
// ======================================================

function create(
    accountId,
    debt
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debt) {

        throw new Error(
            "DEBT_DATA_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            INSERT INTO personal_debts
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

            debt.name,

            debt.originalAmount,

            debt.paidAmount || 0,

            debt.remainingAmount,

            debt.dueDate || null,

            debt.notes || "",

            debt.status || "ACTIVE"

        );


    return findById(

        accountId,

        result.lastInsertRowid

    );

}



// ======================================================
// FIND ONE DEBT
// ======================================================

function findById(
    accountId,
    debtId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
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

        FROM personal_debts

        WHERE

            id = ?

            AND account_id = ?

        LIMIT 1

    `).get(

        debtId,

        accountId

    );

}



// ======================================================
// FIND ALL DEBTS
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

        FROM personal_debts

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
// FIND ACTIVE DEBTS
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

        FROM personal_debts

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
// UPDATE DEBT
// ======================================================

function update(
    accountId,
    debtId,
    debt
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    if (!debt) {

        throw new Error(
            "DEBT_DATA_REQUIRED"
        );

    }


    const existing =
        findById(

            accountId,

            debtId

        );


    if (!existing) {

        return null;

    }


    const name =
        debt.name !== undefined
            ? debt.name
            : existing.name;


    const originalAmount =
        debt.originalAmount !== undefined
            ? debt.originalAmount
            : existing.original_amount;


    const paidAmount =
        debt.paidAmount !== undefined
            ? debt.paidAmount
            : existing.paid_amount;


    const remainingAmount =
        debt.remainingAmount !== undefined
            ? debt.remainingAmount
            : existing.remaining_amount;


    const dueDate =
        debt.dueDate !== undefined
            ? debt.dueDate
            : existing.due_date;


    const notes =
        debt.notes !== undefined
            ? debt.notes
            : existing.notes;


    const status =
        debt.status !== undefined
            ? debt.status
            : existing.status;


    db.prepare(`

        UPDATE personal_debts

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

        debtId,

        accountId

    );


    return findById(

        accountId,

        debtId

    );

}



// ======================================================
// ADD PAYMENT
// ======================================================

function addPayment(
    accountId,
    debtId,
    amount
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
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


    const debt =
        findById(

            accountId,

            debtId

        );


    if (!debt) {

        return null;

    }


    const newPaidAmount =
        Number(
            debt.paid_amount
        ) +
        paymentAmount;


    const newRemainingAmount =
        Math.max(

            Number(
                debt.original_amount
            ) -
            newPaidAmount,

            0

        );


    const newStatus =
        newRemainingAmount <= 0

            ? "PAID"

            : "ACTIVE";


    db.prepare(`

        UPDATE personal_debts

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

        debtId,

        accountId

    );


    return findById(

        accountId,

        debtId

    );

}



// ======================================================
// MARK DEBT AS PAID
// ======================================================

function complete(
    accountId,
    debtId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    const debt =
        findById(

            accountId,

            debtId

        );


    if (!debt) {

        return null;

    }


    db.prepare(`

        UPDATE personal_debts

        SET

            paid_amount = original_amount,

            remaining_amount = 0,

            status = 'PAID',

            updated_at = CURRENT_TIMESTAMP

        WHERE

            id = ?

            AND account_id = ?

    `).run(

        debtId,

        accountId

    );


    return findById(

        accountId,

        debtId

    );

}



// ======================================================
// DELETE DEBT
// ======================================================

function remove(
    accountId,
    debtId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    const result =
        db.prepare(`

            DELETE FROM personal_debts

            WHERE

                id = ?

                AND account_id = ?

        `).run(

            debtId,

            accountId

        );


    return {

        success:
            result.changes > 0,

        deletedId:
            debtId

    };

}



// ======================================================
// GET TOTAL ORIGINAL DEBT
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
                    SUM(original_amount),
                    0
                ) AS total

            FROM personal_debts

            WHERE

                account_id = ?

                AND status != 'PAID'

        `).get(

            accountId

        );


    return Number(
        result.total
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

        FROM personal_debts

        WHERE

            account_id = ?

    `).get(

        accountId

    );


    return Number(
        result.total
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

            FROM personal_debts

            WHERE

                account_id = ?

                AND status != 'PAID'

        `).get(

            accountId

        );


    return Number(
        result.total
    );

}



// ======================================================
// GET DEBT SUMMARY
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

                COUNT(*) AS total_debts,

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
                ) AS total_remaining

            FROM personal_debts

            WHERE

                account_id = ?

    `).get(

        accountId

    );


    return {

        totalDebts:
            Number(
                result.total_debts
            ),

        totalAmount:
            Number(
                result.total_amount
            ),

        totalPaid:
            Number(
                result.total_paid
            ),

        totalRemaining:
            Number(
                result.total_remaining
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