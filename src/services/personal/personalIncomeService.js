const incomeService =
    require("../incomeService");


// ======================================================
// PERSONAL INCOME SERVICE
// ======================================================
//
// INTERFACE-NEUTRAL APPLICATION SERVICE
//
// This service contains PERSONAL INCOME business logic.
//
// It does NOT know about:
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
// The caller must provide the active accountId.
//
// Architecture:
//
// Interface
//      ↓
// Personal Income Adapter
//      ↓
// personalIncomeService
//      ↓
// incomeService
//      ↓
// incomeRepository
//      ↓
// Database
//
// ======================================================


// ======================================================
// RECORD PERSONAL INCOME
// ======================================================

function recordPersonalIncome(
    accountId,
    income
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    if (!income) {

        throw new Error(
            "Personal income data is required."
        );

    }


    if (!income.source) {

        throw new Error(
            "Personal income source is required."
        );

    }


    const amount =
        Number(
            income.amount
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        throw new Error(
            "Personal income amount must be greater than zero."
        );

    }


    return incomeService.saveIncome(

        accountId,

        {
            source:
                income.source,

            amount:
                amount,

            notes:
                income.note ||
                income.notes ||
                ""
        }

    );

}


// ======================================================
// TODAY'S PERSONAL INCOME
// ======================================================

function getTodayPersonalIncome(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return incomeService.getTodayIncome(
        accountId
    );

}


// ======================================================
// MONTHLY PERSONAL INCOME
// ======================================================

function getMonthlyPersonalIncome(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return incomeService.getMonthlyIncome(
        accountId
    );

}


// ======================================================
// ALL PERSONAL INCOME
// ======================================================

function getPersonalIncome(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    return incomeService.getIncome(
        accountId
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    recordPersonalIncome,

    getTodayPersonalIncome,

    getMonthlyPersonalIncome,

    getPersonalIncome

};