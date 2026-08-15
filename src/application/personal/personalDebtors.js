const personalDebtorService =
    require("../../services/personal/personalDebtorService");


// ======================================================
// PERSONAL DEBTORS APPLICATION
// ======================================================
//
// APPLICATION LAYER
//
// Telegram
//     ↓
// Flow
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
// CREATE PERSONAL DEBTOR
// ======================================================

async function createDebtor(
    accountId,
    data
) {

    return personalDebtorService.createDebtor(
        accountId,
        data
    );

}


// ======================================================
// GET ONE PERSONAL DEBTOR
// ======================================================

async function getDebtor(
    accountId,
    debtorId
) {

    return personalDebtorService.getDebtor(
        accountId,
        debtorId
    );

}


// ======================================================
// GET ALL PERSONAL DEBTORS
// ======================================================

async function getDebtors(
    accountId
) {

    return personalDebtorService.getDebtors(
        accountId
    );

}


// ======================================================
// GET ACTIVE PERSONAL DEBTORS
// ======================================================

async function getActiveDebtors(
    accountId
) {

    return personalDebtorService.getActiveDebtors(
        accountId
    );

}


// ======================================================
// UPDATE PERSONAL DEBTOR
// ======================================================

async function updateDebtor(
    accountId,
    debtorId,
    data
) {

    return personalDebtorService.updateDebtor(
        accountId,
        debtorId,
        data
    );

}


// ======================================================
// ADD PAYMENT
// ======================================================

async function addPayment(
    accountId,
    debtorId,
    amount
) {

    return personalDebtorService.addPayment(
        accountId,
        debtorId,
        amount
    );

}


// ======================================================
// COMPLETE DEBTOR
// ======================================================

async function completeDebtor(
    accountId,
    debtorId
) {

    return personalDebtorService.completeDebtor(
        accountId,
        debtorId
    );

}


// ======================================================
// DELETE DEBTOR
// ======================================================

async function deleteDebtor(
    accountId,
    debtorId
) {

    return personalDebtorService.deleteDebtor(
        accountId,
        debtorId
    );

}


// ======================================================
// GET DEBTOR SUMMARY
// ======================================================

async function getDebtorSummary(
    accountId
) {

    return personalDebtorService.getDebtorSummary(
        accountId
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createDebtor,

    getDebtor,

    getDebtors,

    getActiveDebtors,

    updateDebtor,

    addPayment,

    completeDebtor,

    deleteDebtor,

    getDebtorSummary

};