const personalIncomeService =
    require("../../services/personal/personalIncomeService");


// ======================================================
// PERSONAL INCOME APPLICATION
// ======================================================
//
// INTERFACE-NEUTRAL APPLICATION API
//
// This module contains application-level operations for
// Personal Income.
//
// It knows NOTHING about:
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
// Interface Adapter
//        ↓
// Personal Income Application
//        ↓
// Personal Income Service
//        ↓
// Income Service
//        ↓
// Income Repository
//        ↓
// Database
//
// ======================================================


// ======================================================
// RECORD PERSONAL INCOME
// ======================================================

function recordPersonalIncome(
    accountId,
    data
) {

    if (!data) {

        throw new Error(
            "Personal income data is required."
        );

    }


    return personalIncomeService.recordPersonalIncome(

        accountId,

        {
            source:
                data.source,

            amount:
                data.amount,

            notes:
                data.notes ||
                data.note ||
                ""
        }

    );

}


// ======================================================
// GET TODAY'S PERSONAL INCOME
// ======================================================

function getTodayPersonalIncome(
    accountId
) {

    return personalIncomeService.getTodayPersonalIncome(
        accountId
    );

}


// ======================================================
// GET MONTHLY PERSONAL INCOME
// ======================================================

function getMonthlyPersonalIncome(
    accountId
) {

    return personalIncomeService.getMonthlyPersonalIncome(
        accountId
    );

}


// ======================================================
// GET ALL PERSONAL INCOME
// ======================================================

function getPersonalIncome(
    accountId
) {

    return personalIncomeService.getPersonalIncome(
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