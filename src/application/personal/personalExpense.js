const personalExpenseService =
    require("../../services/personal/personalExpenseService");


// ======================================================
// PERSONAL EXPENSE APPLICATION
// ======================================================
//
// INTERFACE-NEUTRAL APPLICATION API
//
// This module knows NOTHING about:
//
// - Telegram
// - Website
// - Mobile App
// - ctx
// - telegramId
// - keyboards
// - sessions
// - HTTP
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
// RECORD PERSONAL EXPENSE
// ======================================================

function recordPersonalExpense(
    accountId,
    expense
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!expense) {

        throw new Error(
            "EXPENSE_DATA_REQUIRED"
        );

    }


    return personalExpenseService.recordPersonalExpense(

        accountId,

        expense

    );

}


// ======================================================
// TODAY'S PERSONAL EXPENSES
// ======================================================

function getTodayPersonalExpenses(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalExpenseService.getTodayPersonalExpenses(

        accountId

    );

}


// ======================================================
// MONTHLY PERSONAL EXPENSES
// ======================================================

function getMonthlyPersonalExpenses(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalExpenseService.getMonthlyPersonalExpenses(

        accountId

    );

}


// ======================================================
// PERSONAL EXPENSES BY CATEGORY
// ======================================================

function getPersonalExpensesByCategory(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalExpenseService.getPersonalExpensesByCategory(

        accountId

    );

}


// ======================================================
// ALL PERSONAL EXPENSES
// ======================================================

function getPersonalExpenses(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalExpenseService.getPersonalExpenses(

        accountId

    );

}


// ======================================================
// DAILY PERSONAL EXPENSE HISTORY
// ======================================================

function getPersonalExpenseDailyHistory(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalExpenseService.getPersonalExpenseDailyHistory(

        accountId

    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    recordPersonalExpense,

    getTodayPersonalExpenses,

    getMonthlyPersonalExpenses,

    getPersonalExpensesByCategory,

    getPersonalExpenses,

    getPersonalExpenseDailyHistory

};