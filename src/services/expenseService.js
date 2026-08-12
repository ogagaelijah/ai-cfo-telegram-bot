const accountContext = require("./accountContext");
const expenseRepository = require("../repositories/expenseRepository");

// ==========================
// SAVE EXPENSE
// ==========================
function saveExpense(telegramId, expense) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return expenseRepository.create(
        account.accountId,
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

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return expenseRepository.getTodayTotal(
        account.accountId
    );
}

// ==========================
// MONTHLY EXPENSES
// ==========================
function getMonthlyExpenses(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return expenseRepository.getMonthlyTotal(
        account.accountId
    );
}

// ==========================
// EXPENSES BY CATEGORY
// ==========================
function getExpensesByCategory(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return expenseRepository.getByCategory(
        account.accountId
    );
}

// ==========================
// ALL EXPENSES
// ==========================
function getExpenses(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return expenseRepository.findAll(
        account.accountId
    );
}

module.exports = {
    saveExpense,
    getTodayExpenses,
    getMonthlyExpenses,
    getExpensesByCategory,
    getExpenses
};