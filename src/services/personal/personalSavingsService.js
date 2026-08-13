const personalSavingsRepository =
    require("../../repositories/personal/personalSavingsRepository");


// ======================================================
// PERSONAL SAVINGS SERVICE
// ======================================================
//
// INTERFACE-NEUTRAL BUSINESS LOGIC
//
// This service knows NOTHING about:
//
// - Telegram
// - telegramId
// - ctx
// - keyboards
// - sessions
// - HTTP
// - UI
//
// It receives an already-resolved accountId.
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
// ======================================================


// ======================================================
// CREATE SAVINGS GOAL
// ======================================================

function createSavingsGoal(
    accountId,
    savingsGoal
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!savingsGoal) {

        throw new Error(
            "SAVINGS_GOAL_DATA_REQUIRED"
        );

    }


    if (
        !savingsGoal.name ||
        !String(
            savingsGoal.name
        ).trim()
    ) {

        throw new Error(
            "SAVINGS_GOAL_NAME_REQUIRED"
        );

    }


    const targetAmount =
        Number(
            savingsGoal.targetAmount
        );


    if (
        !Number.isFinite(
            targetAmount
        ) ||
        targetAmount <= 0
    ) {

        throw new Error(
            "INVALID_SAVINGS_TARGET"
        );

    }


    const savedAmount =
        savingsGoal.savedAmount === undefined
            ? 0
            : Number(
                savingsGoal.savedAmount
            );


    if (
        !Number.isFinite(
            savedAmount
        ) ||
        savedAmount < 0
    ) {

        throw new Error(
            "INVALID_SAVED_AMOUNT"
        );

    }


    if (
        savedAmount > targetAmount
    ) {

        throw new Error(
            "SAVED_AMOUNT_EXCEEDS_TARGET"
        );

    }


    return personalSavingsRepository.create(

        accountId,

        {

            name:
                String(
                    savingsGoal.name
                ).trim(),

            targetAmount,

            savedAmount,

            deadline:
                savingsGoal.deadline || null,

            notes:
                savingsGoal.notes || "",

            status:
                savedAmount >= targetAmount
                    ? "COMPLETED"
                    : "ACTIVE"

        }

    );

}


// ======================================================
// GET SAVINGS GOAL
// ======================================================

function getSavingsGoal(
    accountId,
    goalId
) {

    validateAccount(
        accountId
    );


    validateGoalId(
        goalId
    );


    return personalSavingsRepository.findById(

        accountId,

        goalId

    );

}


// ======================================================
// GET ALL SAVINGS GOALS
// ======================================================

function getSavingsGoals(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalSavingsRepository.findAll(

        accountId

    );

}


// ======================================================
// GET ACTIVE SAVINGS GOALS
// ======================================================

function getActiveSavingsGoals(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalSavingsRepository.findActive(

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

    validateAccount(
        accountId
    );


    validateGoalId(
        goalId
    );


    const savingsAmount =
        Number(
            amount
        );


    if (
        !Number.isFinite(
            savingsAmount
        ) ||
        savingsAmount <= 0
    ) {

        throw new Error(
            "INVALID_SAVINGS_AMOUNT"
        );

    }


    const goal =
        personalSavingsRepository.findById(

            accountId,

            goalId

        );


    if (!goal) {

        throw new Error(
            "SAVINGS_GOAL_NOT_FOUND"
        );

    }


    if (
        goal.status === "COMPLETED"
    ) {

        throw new Error(
            "SAVINGS_GOAL_ALREADY_COMPLETED"
        );

    }


    const remaining =
        Math.max(

            Number(
                goal.target_amount
            ) -
            Number(
                goal.saved_amount
            ),

            0

        );


    if (
        savingsAmount > remaining
    ) {

        throw new Error(
            "SAVINGS_AMOUNT_EXCEEDS_REMAINING"
        );

    }


    const updatedGoal =
        personalSavingsRepository.addSavings(

            accountId,

            goalId,

            savingsAmount

        );


    if (!updatedGoal) {

        throw new Error(
            "SAVINGS_UPDATE_FAILED"
        );

    }


    // Automatically mark the goal completed
    // when the target has been reached.

    if (
        Number(
            updatedGoal.saved_amount
        ) >=
        Number(
            updatedGoal.target_amount
        )
    ) {

        return personalSavingsRepository.complete(

            accountId,

            goalId

        );

    }


    return updatedGoal;

}


// ======================================================
// UPDATE SAVINGS GOAL
// ======================================================

function updateSavingsGoal(
    accountId,
    goalId,
    savingsGoal
) {

    validateAccount(
        accountId
    );


    validateGoalId(
        goalId
    );


    if (!savingsGoal) {

        throw new Error(
            "SAVINGS_GOAL_DATA_REQUIRED"
        );

    }


    const existingGoal =
        personalSavingsRepository.findById(

            accountId,

            goalId

        );


    if (!existingGoal) {

        throw new Error(
            "SAVINGS_GOAL_NOT_FOUND"
        );

    }


    if (
        savingsGoal.targetAmount !== undefined
    ) {

        const targetAmount =
            Number(
                savingsGoal.targetAmount
            );


        if (
            !Number.isFinite(
                targetAmount
            ) ||
            targetAmount <= 0
        ) {

            throw new Error(
                "INVALID_SAVINGS_TARGET"
            );

        }


        if (
            Number(
                existingGoal.saved_amount
            ) >
            targetAmount
        ) {

            throw new Error(
                "TARGET_BELOW_CURRENT_SAVINGS"
            );

        }

    }


    return personalSavingsRepository.update(

        accountId,

        goalId,

        savingsGoal

    );

}


// ======================================================
// COMPLETE SAVINGS GOAL
// ======================================================

function completeSavingsGoal(
    accountId,
    goalId
) {

    validateAccount(
        accountId
    );


    validateGoalId(
        goalId
    );


    const goal =
        personalSavingsRepository.findById(

            accountId,

            goalId

        );


    if (!goal) {

        throw new Error(
            "SAVINGS_GOAL_NOT_FOUND"
        );

    }


    if (
        Number(
            goal.saved_amount
        ) <
        Number(
            goal.target_amount
        )
    ) {

        throw new Error(
            "SAVINGS_TARGET_NOT_REACHED"
        );

    }


    return personalSavingsRepository.complete(

        accountId,

        goalId

    );

}


// ======================================================
// DELETE SAVINGS GOAL
// ======================================================

function deleteSavingsGoal(
    accountId,
    goalId
) {

    validateAccount(
        accountId
    );


    validateGoalId(
        goalId
    );


    const goal =
        personalSavingsRepository.findById(

            accountId,

            goalId

        );


    if (!goal) {

        throw new Error(
            "SAVINGS_GOAL_NOT_FOUND"
        );

    }


    return personalSavingsRepository.remove(

        accountId,

        goalId

    );

}


// ======================================================
// GET TOTAL SAVED
// ======================================================

function getTotalSaved(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalSavingsRepository.getTotalSaved(

        accountId

    );

}


// ======================================================
// GET TOTAL TARGET
// ======================================================

function getTotalTarget(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalSavingsRepository.getTotalTarget(

        accountId

    );

}


// ======================================================
// GET SAVINGS SUMMARY
// ======================================================

function getSavingsSummary(
    accountId
) {

    validateAccount(
        accountId
    );


    const totalSaved =
        personalSavingsRepository.getTotalSaved(

            accountId

        );


    const totalTarget =
        personalSavingsRepository.getTotalTarget(

            accountId

        );


    const remaining =
        Math.max(

            totalTarget -
            totalSaved,

            0

        );


    const progress =
        totalTarget > 0

            ? (
                totalSaved /
                totalTarget
            ) * 100

            : 0;


    return {

        totalSaved,

        totalTarget,

        remaining,

        progress:
            Number(
                progress.toFixed(2)
            )

    };

}


// ======================================================
// VALIDATION HELPERS
// ======================================================

function validateAccount(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

}


function validateGoalId(
    goalId
) {

    const id =
        Number(
            goalId
        );


    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        throw new Error(
            "INVALID_SAVINGS_GOAL_ID"
        );

    }

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createSavingsGoal,

    getSavingsGoal,

    getSavingsGoals,

    getActiveSavingsGoals,

    addSavings,

    updateSavingsGoal,

    completeSavingsGoal,

    deleteSavingsGoal,

    getTotalSaved,

    getTotalTarget,

    getSavingsSummary

};