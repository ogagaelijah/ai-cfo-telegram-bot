const accountContext = require("./accountContext");
const incomeRepository = require("../repositories/incomeRepository");

// ==========================
// SAVE INCOME
// ==========================
function saveIncome(telegramId, income) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return incomeRepository.create(
        account.accountId,
        {
            source:
                income.source,

            amount:
                Number(income.amount),

            notes:
                income.notes || ""
        }
    );
}

// ==========================
// TODAY'S INCOME
// ==========================
function getTodayIncome(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return incomeRepository.getTodayTotal(
        account.accountId
    );
}

// ==========================
// MONTHLY INCOME
// ==========================
function getMonthlyIncome(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return incomeRepository.getMonthlyTotal(
        account.accountId
    );
}

// ==========================
// ALL INCOME
// ==========================
function getIncome(telegramId) {

    const account =
        accountContext.requireAccount(
            telegramId
        );

    return incomeRepository.findAll(
        account.accountId
    );
}

module.exports = {
    saveIncome,
    getTodayIncome,
    getMonthlyIncome,
    getIncome
};