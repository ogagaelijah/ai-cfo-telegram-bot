const expenseRepository =
    require("../../repositories/expenseRepository");


// ======================================================
// PERSONAL EXPENSE SERVICE
// ======================================================
//
// INTERFACE-NEUTRAL SERVICE
//
// This service knows NOTHING about:
//
// - Telegram
// - telegramId
// - ctx
// - HTTP
// - keyboards
// - sessions
// - websites
// - mobile apps
//
// It receives an already-resolved accountId.
//
// Telegram / Web / Mobile / API
//              ↓
//       Application Layer
//              ↓
//    personalExpenseService
//              ↓
//      expenseRepository
//              ↓
//           Database
//
// ======================================================


// ======================================================
// RECORD PERSONAL EXPENSE
// ======================================================

function recordPersonalExpense(
    accountId,
    expense
) {

    return expenseRepository.create(

        accountId,

        {

            item:
                expense.description,

            category:
                expense.category,

            amount:
                Number(
                    expense.amount
                ),

            notes:
                expense.notes || ""

        }

    );

}


// ======================================================
// GET TODAY'S PERSONAL EXPENSES
// ======================================================

function getTodayPersonalExpenses(
    accountId
) {

    return expenseRepository.getTodayTotal(
        accountId
    );

}


// ======================================================
// GET MONTHLY PERSONAL EXPENSES
// ======================================================

function getMonthlyPersonalExpenses(
    accountId
) {

    return expenseRepository.getMonthlyTotal(
        accountId
    );

}


// ======================================================
// GET PERSONAL EXPENSES BY CATEGORY
// ======================================================

function getPersonalExpensesByCategory(
    accountId
) {

    return expenseRepository.getByCategory(
        accountId
    );

}


// ======================================================
// GET ALL PERSONAL EXPENSES
// ======================================================

function getPersonalExpenses(
    accountId
) {

    return expenseRepository.findAll(
        accountId
    );

}


// ======================================================
// GET PERSONAL EXPENSE DAILY HISTORY
// ======================================================

function getPersonalExpenseDailyHistory(
    accountId
) {

    return expenseRepository.getDailyHistory(
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