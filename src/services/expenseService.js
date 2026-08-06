const expenseRepository = require("../repositories/expenseRepository");

// ==========================
// SAVE EXPENSE
// ==========================
function saveExpense(telegramId, expense) {

    return expenseRepository.create(
        telegramId,
        {

            item:
                expense.description,

            category:
                expense.category,

            amount:
                Number(expense.amount),

            notes:
                expense.notes || ""

        }
    );

}

// ==========================
// TODAY'S EXPENSES
// ==========================
function getTodayExpenses(telegramId) {

    return expenseRepository.getTodayTotal(
        telegramId
    );

}

// ==========================
// MONTHLY EXPENSES
// ==========================
function getMonthlyExpenses(telegramId) {

    return expenseRepository.getMonthlyTotal(
        telegramId
    );

}

// ==========================
// EXPENSES BY CATEGORY
// ==========================
function getExpensesByCategory(telegramId) {

    return expenseRepository.getByCategory(
        telegramId
    );

}

// ==========================
// ALL EXPENSES
// ==========================
function getExpenses(telegramId) {

    return expenseRepository.findAll(
        telegramId
    );

}

module.exports = {

    saveExpense,

    getTodayExpenses,

    getMonthlyExpenses,

    getExpensesByCategory,

    getExpenses

};