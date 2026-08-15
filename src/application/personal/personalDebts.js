const personalDebtsService =
    require("../../services/personal/personalDebtsService");


// ======================================================
// PERSONAL DEBTS APPLICATION
// ======================================================
//
// INTERFACE-NEUTRAL APPLICATION API
//
// This module knows NOTHING about:
//
// - Telegram
// - telegramId
// - ctx
// - keyboards
// - sessions
// - HTTP
// - websites
// - mobile apps
//
// It receives an already-resolved accountId.
//
// Architecture:
//
// Interface
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
// CREATE PERSONAL DEBT
// ======================================================

function createDebt(
    accountId,
    debt
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debt) {

        throw new Error(
            "DEBT_DATA_REQUIRED"
        );

    }


    return personalDebtsService.createDebt(

        accountId,

        debt

    );

}


// ======================================================
// GET ONE PERSONAL DEBT
// ======================================================

function getDebt(
    accountId,
    debtId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    return personalDebtsService.getDebt(

        accountId,

        debtId

    );

}


// ======================================================
// GET ALL PERSONAL DEBTS
// ======================================================

function getDebts(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalDebtsService.getDebts(

        accountId

    );

}


// ======================================================
// GET ACTIVE PERSONAL DEBTS
// ======================================================

function getActiveDebts(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalDebtsService.getActiveDebts(

        accountId

    );

}


// ======================================================
// ADD PAYMENT TO PERSONAL DEBT
// ======================================================

function addPayment(
    accountId,
    debtId,
    amount
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    if (
        amount === undefined ||
        amount === null
    ) {

        throw new Error(
            "PAYMENT_AMOUNT_REQUIRED"
        );

    }


    return personalDebtsService.addPayment(

        accountId,

        debtId,

        amount

    );

}


// ======================================================
// UPDATE PERSONAL DEBT
// ======================================================

function updateDebt(
    accountId,
    debtId,
    debt
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    if (!debt) {

        throw new Error(
            "DEBT_DATA_REQUIRED"
        );

    }


    return personalDebtsService.updateDebt(

        accountId,

        debtId,

        debt

    );

}


// ======================================================
// COMPLETE PERSONAL DEBT
// ======================================================

function completeDebt(
    accountId,
    debtId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    return personalDebtsService.completeDebt(

        accountId,

        debtId

    );

}


// ======================================================
// DELETE PERSONAL DEBT
// ======================================================

function deleteDebt(
    accountId,
    debtId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    if (!debtId) {

        throw new Error(
            "DEBT_ID_REQUIRED"
        );

    }


    return personalDebtsService.deleteDebt(

        accountId,

        debtId

    );

}


// ======================================================
// GET TOTAL ORIGINAL DEBT
// ======================================================

function getTotalOriginal(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalDebtsService.getTotalOriginal(

        accountId

    );

}


// ======================================================
// GET TOTAL PAID
// ======================================================

function getTotalPaid(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalDebtsService.getTotalPaid(

        accountId

    );

}


// ======================================================
// GET TOTAL REMAINING
// ======================================================

function getTotalRemaining(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalDebtsService.getTotalRemaining(

        accountId

    );

}


// ======================================================
// GET PERSONAL DEBT SUMMARY
// ======================================================

function getDebtSummary(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }


    return personalDebtsService.getDebtSummary(

        accountId

    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createDebt,

    getDebt,

    getDebts,

    getActiveDebts,

    addPayment,

    updateDebt,

    completeDebt,

    deleteDebt,

    getTotalOriginal,

    getTotalPaid,

    getTotalRemaining,

    getDebtSummary

};