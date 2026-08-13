const db =
    require("../../database/database");


// ======================================================
// PERSONAL SAVINGS REPOSITORY
// ======================================================
//
// INTERFACE-NEUTRAL DATABASE ACCESS
//
// This repository knows NOTHING about:
//
// - Telegram
// - telegramId
// - ctx
// - keyboards
// - sessions
// - HTTP
// - application logic
// - service logic
//
// It works directly with the
// personal_savings_goals table.
//
// ======================================================


// ======================================================
// CREATE SAVINGS GOAL
// ======================================================

function create(
    accountId,
    savingsGoal
) {

    const result =
        db.prepare(`
            INSERT INTO personal_savings_goals (

                account_id,

                name,

                target_amount,

                saved_amount,

                deadline,

                notes,

                status

            )

            VALUES (

                @accountId,

                @name,

                @targetAmount,

                @savedAmount,

                @deadline,

                @notes,

                @status

            )
        `).run({

            accountId,

            name:
                savingsGoal.name,

            targetAmount:
                Number(
                    savingsGoal.targetAmount
                ),

            savedAmount:
                Number(
                    savingsGoal.savedAmount || 0
                ),

            deadline:
                savingsGoal.deadline || null,

            notes:
                savingsGoal.notes || "",

            status:
                savingsGoal.status || "ACTIVE"

        });


    return findById(
        accountId,
        result.lastInsertRowid
    );

}


// ======================================================
// FIND SAVINGS GOAL BY ID
// ======================================================

function findById(
    accountId,
    goalId
) {

    return db.prepare(`
        SELECT

            id,

            account_id,

            name,

            target_amount,

            saved_amount,

            deadline,

            notes,

            status,

            created_at

        FROM personal_savings_goals

        WHERE id = ?

        AND account_id = ?

        LIMIT 1
    `).get(

        goalId,

        accountId

    );

}


// ======================================================
// GET ALL SAVINGS GOALS
// ======================================================

function findAll(
    accountId
) {

    return db.prepare(`
        SELECT

            id,

            account_id,

            name,

            target_amount,

            saved_amount,

            deadline,

            notes,

            status,

            created_at

        FROM personal_savings_goals

        WHERE account_id = ?

        ORDER BY created_at DESC
    `).all(

        accountId

    );

}


// ======================================================
// GET ACTIVE SAVINGS GOALS
// ======================================================

function findActive(
    accountId
) {

    return db.prepare(`
        SELECT

            id,

            account_id,

            name,

            target_amount,

            saved_amount,

            deadline,

            notes,

            status,

            created_at

        FROM personal_savings_goals

        WHERE account_id = ?

        AND status = 'ACTIVE'

        ORDER BY created_at DESC
    `).all(

        accountId

    );

}


// ======================================================
// ADD MONEY TO SAVINGS GOAL
// ======================================================

function addSavings(
    accountId,
    goalId,
    amount
) {

    const result =
        db.prepare(`
            UPDATE personal_savings_goals

            SET saved_amount =
                saved_amount + ?

            WHERE id = ?

            AND account_id = ?
        `).run(

            Number(amount),

            goalId,

            accountId

        );


    if (
        result.changes === 0
    ) {

        return null;

    }


    return findById(
        accountId,
        goalId
    );

}


// ======================================================
// UPDATE SAVINGS GOAL
// ======================================================

function update(
    accountId,
    goalId,
    savingsGoal
) {

    const existing =
        findById(
            accountId,
            goalId
        );


    if (!existing) {

        return null;

    }


    db.prepare(`
        UPDATE personal_savings_goals

        SET

            name = @name,

            target_amount = @targetAmount,

            deadline = @deadline,

            notes = @notes

        WHERE id = @goalId

        AND account_id = @accountId
    `).run({

        name:
            savingsGoal.name ??
            existing.name,

        targetAmount:
            savingsGoal.targetAmount !== undefined
                ? Number(
                    savingsGoal.targetAmount
                )
                : existing.target_amount,

        deadline:
            savingsGoal.deadline !== undefined
                ? savingsGoal.deadline
                : existing.deadline,

        notes:
            savingsGoal.notes !== undefined
                ? savingsGoal.notes
                : existing.notes,

        goalId,

        accountId

    });


    return findById(
        accountId,
        goalId
    );

}


// ======================================================
// COMPLETE SAVINGS GOAL
// ======================================================

function complete(
    accountId,
    goalId
) {

    const result =
        db.prepare(`
            UPDATE personal_savings_goals

            SET status = 'COMPLETED'

            WHERE id = ?

            AND account_id = ?
        `).run(

            goalId,

            accountId

        );


    if (
        result.changes === 0
    ) {

        return null;

    }


    return findById(
        accountId,
        goalId
    );

}


// ======================================================
// DELETE SAVINGS GOAL
// ======================================================

function remove(
    accountId,
    goalId
) {

    const result =
        db.prepare(`
            DELETE FROM personal_savings_goals

            WHERE id = ?

            AND account_id = ?
        `).run(

            goalId,

            accountId

        );


    return result.changes > 0;

}


// ======================================================
// GET TOTAL SAVED
// ======================================================

function getTotalSaved(
    accountId
) {

    const result =
        db.prepare(`
            SELECT

                COALESCE(
                    SUM(saved_amount),
                    0
                ) AS total_saved

            FROM personal_savings_goals

            WHERE account_id = ?

            AND status = 'ACTIVE'
        `).get(

            accountId

        );


    return Number(
        result.total_saved || 0
    );

}


// ======================================================
// GET TOTAL TARGET
// ======================================================

function getTotalTarget(
    accountId
) {

    const result =
        db.prepare(`
            SELECT

                COALESCE(
                    SUM(target_amount),
                    0
                ) AS total_target

            FROM personal_savings_goals

            WHERE account_id = ?

            AND status = 'ACTIVE'
        `).get(

            accountId

        );


    return Number(
        result.total_target || 0
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    create,

    findById,

    findAll,

    findActive,

    addSavings,

    update,

    complete,

    remove,

    getTotalSaved,

    getTotalTarget

};