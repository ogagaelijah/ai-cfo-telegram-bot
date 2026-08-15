const personalDebtRepository =
    require("../../repositories/personal/personalDebtRepository");


// ======================================================
// PERSONAL DEBT SERVICE
// ======================================================
//
// INTERFACE-NEUTRAL BUSINESS LOGIC
//
// This service knows NOTHING about:
//
// - Telegram
// - telegramId
// - ctx
// - keyboards
// - sessions
// - UI
// - HTTP
//
// It receives an already-resolved accountId.
//
// Architecture:
//
// Interface
//      ↓
// Application
//      ↓
// Service
//      ↓
// Repository
//      ↓
// Database
//
// IMPORTANT:
//
// Every operation is scoped by accountId.
//
// This keeps the personal debt system safe for:
// - multiple users
// - multiple accounts
// - multiple interfaces
// - future web/mobile/API clients
//
// ======================================================


// ======================================================
// CREATE DEBT
// ======================================================

function createDebt(
    accountId,
    debt
) {

    validateAccount(
        accountId
    );


    if (!debt) {

        throw new Error(
            "DEBT_DATA_REQUIRED"
        );

    }


    if (
        !debt.name ||
        !String(
            debt.name
        ).trim()
    ) {

        throw new Error(
            "DEBT_NAME_REQUIRED"
        );

    }


    const originalAmount =
        Number(
            debt.originalAmount
        );


    if (
        !Number.isFinite(
            originalAmount
        ) ||
        originalAmount <= 0
    ) {

        throw new Error(
            "INVALID_DEBT_AMOUNT"
        );

    }


    const paidAmount =
        debt.paidAmount === undefined
            ? 0
            : Number(
                debt.paidAmount
            );


    if (
        !Number.isFinite(
            paidAmount
        ) ||
        paidAmount < 0
    ) {

        throw new Error(
            "INVALID_PAID_AMOUNT"
        );

    }


    if (
        paidAmount > originalAmount
    ) {

        throw new Error(
            "PAID_AMOUNT_EXCEEDS_DEBT"
        );

    }


    const remainingAmount =
        Math.max(
            originalAmount - paidAmount,
            0
        );


    const status =
        remainingAmount <= 0
            ? "PAID"
            : "ACTIVE";


    return personalDebtRepository.create(

        accountId,

        {

            name:
                String(
                    debt.name
                ).trim(),

            originalAmount,

            paidAmount,

            remainingAmount,

            dueDate:
                debt.dueDate || null,

            notes:
                debt.notes || "",

            status

        }

    );

}


// ======================================================
// GET ONE DEBT
// ======================================================

function getDebt(
    accountId,
    debtId
) {

    validateAccount(
        accountId
    );


    validateDebtId(
        debtId
    );


    return personalDebtRepository.findById(

        accountId,

        debtId

    );

}


// ======================================================
// GET ALL DEBTS
// ======================================================

function getDebts(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalDebtRepository.findAll(

        accountId

    );

}


// ======================================================
// GET ACTIVE DEBTS
// ======================================================

function getActiveDebts(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalDebtRepository.findActive(

        accountId

    );

}


// ======================================================
// ADD PAYMENT
// ======================================================

function addPayment(
    accountId,
    debtId,
    amount
) {

    validateAccount(
        accountId
    );


    validateDebtId(
        debtId
    );


    const paymentAmount =
        Number(
            amount
        );


    if (
        !Number.isFinite(
            paymentAmount
        ) ||
        paymentAmount <= 0
    ) {

        throw new Error(
            "INVALID_PAYMENT_AMOUNT"
        );

    }


    const debt =
        personalDebtRepository.findById(

            accountId,

            debtId

        );


    if (!debt) {

        throw new Error(
            "DEBT_NOT_FOUND"
        );

    }


    if (
        debt.status === "PAID"
    ) {

        throw new Error(
            "DEBT_ALREADY_PAID"
        );

    }


    const remainingAmount =
        Number(
            debt.remaining_amount
        );


    if (
        paymentAmount > remainingAmount
    ) {

        throw new Error(
            "PAYMENT_EXCEEDS_REMAINING_DEBT"
        );

    }


    const updatedDebt =
        personalDebtRepository.addPayment(

            accountId,

            debtId,

            paymentAmount

        );


    if (!updatedDebt) {

        throw new Error(
            "DEBT_PAYMENT_FAILED"
        );

    }


    return updatedDebt;

}


// ======================================================
// UPDATE DEBT
// ======================================================

function updateDebt(
    accountId,
    debtId,
    debt
) {

    validateAccount(
        accountId
    );


    validateDebtId(
        debtId
    );


    if (!debt) {

        throw new Error(
            "DEBT_DATA_REQUIRED"
        );

    }


    const existingDebt =
        personalDebtRepository.findById(

            accountId,

            debtId

        );


    if (!existingDebt) {

        throw new Error(
            "DEBT_NOT_FOUND"
        );

    }


    // ----------------------------------------------
    // NAME
    // ----------------------------------------------

    if (
        debt.name !== undefined
    ) {

        if (
            !String(
                debt.name
            ).trim()
        ) {

            throw new Error(
                "DEBT_NAME_REQUIRED"
            );

        }

    }


    // ----------------------------------------------
    // ORIGINAL AMOUNT
    // ----------------------------------------------

    let originalAmount =
        Number(
            existingDebt.original_amount
        );


    if (
        debt.originalAmount !== undefined
    ) {

        originalAmount =
            Number(
                debt.originalAmount
            );


        if (
            !Number.isFinite(
                originalAmount
            ) ||
            originalAmount <= 0
        ) {

            throw new Error(
                "INVALID_DEBT_AMOUNT"
            );

        }

    }


    // ----------------------------------------------
    // PAID AMOUNT
    // ----------------------------------------------

    let paidAmount =
        Number(
            existingDebt.paid_amount
        );


    if (
        debt.paidAmount !== undefined
    ) {

        paidAmount =
            Number(
                debt.paidAmount
            );


        if (
            !Number.isFinite(
                paidAmount
            ) ||
            paidAmount < 0
        ) {

            throw new Error(
                "INVALID_PAID_AMOUNT"
            );

        }

    }


    if (
        paidAmount > originalAmount
    ) {

        throw new Error(
            "PAID_AMOUNT_EXCEEDS_DEBT"
        );

    }


    // ----------------------------------------------
    // REMAINING AMOUNT
    // ----------------------------------------------

    const remainingAmount =
        Math.max(

            originalAmount -
            paidAmount,

            0

        );


    // ----------------------------------------------
    // STATUS
    // ----------------------------------------------

    let status =
        debt.status !== undefined
            ? debt.status
            : existingDebt.status;


    if (
        remainingAmount <= 0
    ) {

        status = "PAID";

    } else if (
        status === "PAID"
    ) {

        status = "ACTIVE";

    }


    return personalDebtRepository.update(

        accountId,

        debtId,

        {

            name:
                debt.name !== undefined
                    ? String(
                        debt.name
                    ).trim()
                    : existingDebt.name,

            originalAmount,

            paidAmount,

            remainingAmount,

            dueDate:
                debt.dueDate !== undefined
                    ? debt.dueDate
                    : existingDebt.due_date,

            notes:
                debt.notes !== undefined
                    ? debt.notes
                    : existingDebt.notes,

            status

        }

    );

}


// ======================================================
// MARK DEBT AS PAID
// ======================================================

function completeDebt(
    accountId,
    debtId
) {

    validateAccount(
        accountId
    );


    validateDebtId(
        debtId
    );


    const debt =
        personalDebtRepository.findById(

            accountId,

            debtId

        );


    if (!debt) {

        throw new Error(
            "DEBT_NOT_FOUND"
        );

    }


    if (
        debt.status === "PAID"
    ) {

        return debt;

    }


    return personalDebtRepository.complete(

        accountId,

        debtId

    );

}


// ======================================================
// DELETE DEBT
// ======================================================

function deleteDebt(
    accountId,
    debtId
) {

    validateAccount(
        accountId
    );


    validateDebtId(
        debtId
    );


    const debt =
        personalDebtRepository.findById(

            accountId,

            debtId

        );


    if (!debt) {

        throw new Error(
            "DEBT_NOT_FOUND"
        );

    }


    return personalDebtRepository.remove(

        accountId,

        debtId

    );

}


// ======================================================
// GET TOTAL DEBT
// ======================================================

function getTotalDebt(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalDebtRepository.getTotalDebt(

        accountId

    );

}


// ======================================================
// GET TOTAL PAID
// ======================================================

function getTotalPaid(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalDebtRepository.getTotalPaid(

        accountId

    );

}


// ======================================================
// GET TOTAL REMAINING
// ======================================================

function getTotalRemaining(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalDebtRepository.getTotalRemaining(

        accountId

    );

}


// ======================================================
// GET DEBT SUMMARY
// ======================================================

function getDebtSummary(
    accountId
) {

    validateAccount(
        accountId
    );


    return personalDebtRepository.getSummary(

        accountId

    );

}


// ======================================================
// VALIDATION HELPERS
// ======================================================

function validateAccount(
    accountId
) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

}


// ======================================================
// VALIDATE DEBT ID
// ======================================================

function validateDebtId(
    debtId
) {

    const id =
        Number(
            debtId
        );


    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        throw new Error(
            "INVALID_DEBT_ID"
        );

    }

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

    getTotalDebt,

    getTotalPaid,

    getTotalRemaining,

    getDebtSummary

};