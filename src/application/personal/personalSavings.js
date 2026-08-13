const personalSavingsService =
    require("../../services/personal/personalSavingsService");


// ======================================================
// PERSONAL SAVINGS APPLICATION
// ======================================================
//
// INTERFACE-NEUTRAL APPLICATION API
//
// This module knows NOTHING about:
//
// - Telegram
// - telegramId
// - ctx
// - keyboards
// - sessions
// - HTTP
// - websites
// - mobile apps
//
// It receives an already-resolved accountId.
//
// Architecture:
//
// Telegram Adapter
//       ↓
// Application
//       ↓
// Service
//       ↓
// Repository
//       ↓
// Database
//
// ======================================================


// ======================================================
// CREATE PERSONAL SAVINGS GOAL
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


    return personalSavingsService.createSavingsGoal(

        accountId,

        savingsGoal

    );

}


// ======================================================
// GET ONE SAVINGS GOAL
// ======================================================

function getSavingsGoal(
    accountId,
    goalId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!goalId) {

        throw new Error(
            "SAVINGS_GOAL_ID_REQUIRED"
        );

    }


    return personalSavingsService.getSavingsGoal(

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

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalSavingsService.getSavingsGoals(

        accountId

    );

}


// ======================================================
// GET ACTIVE SAVINGS GOALS
// ======================================================

function getActiveSavingsGoals(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalSavingsService.getActiveSavingsGoals(

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

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!goalId) {

        throw new Error(
            "SAVINGS_GOAL_ID_REQUIRED"
        );

    }


    if (amount === undefined || amount === null) {

        throw new Error(
            "SAVINGS_AMOUNT_REQUIRED"
        );

    }


    return personalSavingsService.addSavings(

        accountId,

        goalId,

        amount

    );

}


// ======================================================
// UPDATE SAVINGS GOAL
// ======================================================

function updateSavingsGoal(
    accountId,
    goalId,
    savingsGoal
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!goalId) {

        throw new Error(
            "SAVINGS_GOAL_ID_REQUIRED"
        );

    }


    if (!savingsGoal) {

        throw new Error(
            "SAVINGS_GOAL_DATA_REQUIRED"
        );

    }


    return personalSavingsService.updateSavingsGoal(

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

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!goalId) {

        throw new Error(
            "SAVINGS_GOAL_ID_REQUIRED"
        );

    }


    return personalSavingsService.completeSavingsGoal(

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

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!goalId) {

        throw new Error(
            "SAVINGS_GOAL_ID_REQUIRED"
        );

    }


    return personalSavingsService.deleteSavingsGoal(

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

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalSavingsService.getTotalSaved(

        accountId

    );

}


// ======================================================
// GET TOTAL TARGET
// ======================================================

function getTotalTarget(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalSavingsService.getTotalTarget(

        accountId

    );

}


// ======================================================
// GET SAVINGS SUMMARY
// ======================================================

function getSavingsSummary(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalSavingsService.getSavingsSummary(

        accountId

    );

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