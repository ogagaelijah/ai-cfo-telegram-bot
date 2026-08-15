const personalDebtorService =
    require("../../services/personal/personalDebtorService");


// ======================================================
// PERSONAL DEBTORS APPLICATION
// ======================================================
//
// INTERFACE-NEUTRAL APPLICATION API
//
// This module knows NOTHING about:
//
// - Telegram
// - Website
// - Mobile App
// - API
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
// Personal Debtors Application
//        ↓
// Personal Debtor Service
//        ↓
// Personal Debtor Repository
//        ↓
// Database
//
// ======================================================


// ======================================================
// CREATE PERSONAL DEBTOR
// ======================================================

function createPersonalDebtor(
    accountId,
    data
) {

    return personalDebtorService.createPersonalDebtor(
        accountId,
        data
    );

}


// ======================================================
// GET PERSONAL DEBTOR
// ======================================================

function getPersonalDebtor(
    accountId,
    debtorId
) {

    return personalDebtorService.getPersonalDebtorById(
        accountId,
        debtorId
    );

}


// ======================================================
// GET ALL PERSONAL DEBTORS
// ======================================================

function getPersonalDebtors(
    accountId
) {

    return personalDebtorService.getPersonalDebtors(
        accountId
    );

}


// ======================================================
// GET ACTIVE PERSONAL DEBTORS
// ======================================================

function getActivePersonalDebtors(
    accountId
) {

    return personalDebtorService.getActivePersonalDebtors(
        accountId
    );

}


// ======================================================
// SEARCH PERSONAL DEBTORS
// ======================================================

function searchPersonalDebtors(
    accountId,
    searchTerm
) {

    return personalDebtorService.searchPersonalDebtors(
        accountId,
        searchTerm
    );

}


// ======================================================
// RECORD PAYMENT
// ======================================================

function recordPersonalDebtorPayment(
    accountId,
    debtorId,
    paymentAmount
) {

    return personalDebtorService.recordPayment(
        accountId,
        debtorId,
        paymentAmount
    );

}


// ======================================================
// UPDATE PERSONAL DEBTOR
// ======================================================

function updatePersonalDebtor(
    accountId,
    debtorId,
    data
) {

    return personalDebtorService.updatePersonalDebtor(
        accountId,
        debtorId,
        data
    );

}


// ======================================================
// UPDATE STATUS
// ======================================================

function updatePersonalDebtorStatus(
    accountId,
    debtorId,
    status
) {

    return personalDebtorService.updatePersonalDebtorStatus(
        accountId,
        debtorId,
        status
    );

}


// ======================================================
// DELETE PERSONAL DEBTOR
// ======================================================

function deletePersonalDebtor(
    accountId,
    debtorId
) {

    return personalDebtorService.deletePersonalDebtor(
        accountId,
        debtorId
    );

}


// ======================================================
// GET TOTAL OUTSTANDING
// ======================================================

function getTotalOutstanding(
    accountId
) {

    return personalDebtorService.getTotalOutstanding(
        accountId
    );

}


// ======================================================
// GET SUMMARY
// ======================================================

function getSummary(
    accountId
) {

    return personalDebtorService.getSummary(
        accountId
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createPersonalDebtor,

    getPersonalDebtor,

    getPersonalDebtors,

    getActivePersonalDebtors,

    searchPersonalDebtors,

    recordPersonalDebtorPayment,

    updatePersonalDebtor,

    updatePersonalDebtorStatus,

    deletePersonalDebtor,

    getTotalOutstanding,

    getSummary

};