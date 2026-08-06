const incomeRepository = require("../repositories/incomeRepository");

// ==========================
// SAVE INCOME
// ==========================
function saveIncome(telegramId, income) {

    return incomeRepository.create(
        telegramId,
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

    return incomeRepository.getTodayTotal(
        telegramId
    );

}

// ==========================
// MONTHLY INCOME
// ==========================
function getMonthlyIncome(telegramId) {

    return incomeRepository.getMonthlyTotal(
        telegramId
    );

}

// ==========================
// ALL INCOME
// ==========================
function getIncome(telegramId) {

    return incomeRepository.findAll(
        telegramId
    );

}

module.exports = {

    saveIncome,

    getTodayIncome,

    getMonthlyIncome,

    getIncome

};