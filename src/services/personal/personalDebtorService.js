const personalDebtorRepository =
    require("../../repositories/personal/personalDebtorRepository");


// ======================================================
// PERSONAL DEBTOR SERVICE
// ======================================================
//
// INTERFACE-NEUTRAL BUSINESS LOGIC LAYER
//
// Personal Debtor means:
//
// Someone owes money to the user.
//
// Example:
//
// John owes the user ₦100,000.
//
// This service knows NOTHING about:
//
// - Telegram
// - Website
// - Mobile App
// - API
// - ctx
// - telegramId
// - keyboards
// - sessions
//
// It receives an accountId and applies business rules.
//
// Architecture:
//
// Interface Adapter
//        ↓
// Application
//        ↓
// Personal Debtor Service
//        ↓
// Personal Debtor Repository
//        ↓
// Database
//
// ======================================================


// ======================================================
// VALIDATE ACCOUNT ID
// ======================================================

function validateAccountId(accountId) {

    if (
        !Number.isInteger(
            Number(accountId)
        ) ||
        Number(accountId) <= 0
    ) {

        throw new Error(
            "A valid account ID is required."
        );

    }

}


// ======================================================
// VALIDATE DEBTOR ID
// ======================================================

function validateDebtorId(debtorId) {

    if (
        !Number.isInteger(
            Number(debtorId)
        ) ||
        Number(debtorId) <= 0
    ) {

        throw new Error(
            "A valid debtor ID is required."
        );

    }

}


// ======================================================
// NORMALIZE AMOUNT
// ======================================================

function normalizeAmount(amount) {

    const value =
        Number(
            String(amount)
                .replace(/,/g, "")
                .trim()
        );


    if (
        !Number.isFinite(value)
    ) {

        throw new Error(
            "Amount must be a valid number."
        );

    }


    return value;

}


// ======================================================
// CREATE PERSONAL DEBTOR
// ======================================================

function createPersonalDebtor(
    accountId,
    data
) {

    validateAccountId(
        accountId
    );


    if (!data) {

        throw new Error(
            "Personal debtor data is required."
        );

    }


    const name =
        String(
            data.name || ""
        ).trim();


    if (!name) {

        throw new Error(
            "Debtor name is required."
        );

    }


    const originalAmount =
        normalizeAmount(
            data.originalAmount
        );


    if (
        originalAmount <= 0
    ) {

        throw new Error(
            "Debtor amount must be greater than zero."
        );

    }


    const dueDate =
        data.dueDate
            ? String(data.dueDate).trim()
            : null;


    const notes =
        data.notes
            ? String(data.notes).trim()
            : "";


    return personalDebtorRepository.createPersonalDebtor(

        Number(accountId),

        {

            name,

            originalAmount,

            paidAmount: 0,

            remainingAmount:
                originalAmount,

            dueDate,

            notes,

            status:
                "ACTIVE"

        }

    );

}


// ======================================================
// GET DEBTOR BY ID
// ======================================================

function getPersonalDebtorById(
    accountId,
    debtorId
) {

    validateAccountId(
        accountId
    );


    validateDebtorId(
        debtorId
    );


    return personalDebtorRepository.getPersonalDebtorById(

        Number(accountId),

        Number(debtorId)

    );

}


// ======================================================
// GET ALL PERSONAL DEBTORS
// ======================================================

function getPersonalDebtors(
    accountId
) {

    validateAccountId(
        accountId
    );


    return personalDebtorRepository.getPersonalDebtors(

        Number(accountId)

    );

}


// ======================================================
// GET ACTIVE PERSONAL DEBTORS
// ======================================================

function getActivePersonalDebtors(
    accountId
) {

    validateAccountId(
        accountId
    );


    return personalDebtorRepository.getActivePersonalDebtors(

        Number(accountId)

    );

}


// ======================================================
// SEARCH PERSONAL DEBTORS
// ======================================================

function searchPersonalDebtors(
    accountId,
    searchTerm
) {

    validateAccountId(
        accountId
    );


    const term =
        String(
            searchTerm || ""
        ).trim();


    if (!term) {

        throw new Error(
            "Search term is required."
        );

    }


    return personalDebtorRepository.searchPersonalDebtors(

        Number(accountId),

        term

    );

}


// ======================================================
// RECORD PAYMENT
// ======================================================
//
// Business rules:
//
// 1. Debtor must exist.
// 2. Payment must be greater than zero.
// 3. Payment cannot exceed outstanding balance.
// 4. Remaining balance is recalculated.
// 5. Status becomes:
//      ACTIVE
//      PARTIALLY_PAID
//      PAID
//
// ======================================================

function recordPayment(
    accountId,
    debtorId,
    paymentAmount
) {

    validateAccountId(
        accountId
    );


    validateDebtorId(
        debtorId
    );


    const amount =
        normalizeAmount(
            paymentAmount
        );


    if (
        amount <= 0
    ) {

        throw new Error(
            "Payment amount must be greater than zero."
        );

    }


    const debtor =
        personalDebtorRepository.getPersonalDebtorById(

            Number(accountId),

            Number(debtorId)

        );


    if (!debtor) {

        throw new Error(
            "Personal debtor not found."
        );

    }


    const remaining =
        Number(
            debtor.remaining_amount
        );


    if (
        remaining <= 0
    ) {

        throw new Error(
            "This debtor has already been fully paid."
        );

    }


    if (
        amount > remaining
    ) {

        throw new Error(
            "Payment cannot be greater than the outstanding balance."
        );

    }


    const newRemaining =
        remaining - amount;


    const paidAmount =
        Number(
            debtor.paid_amount
        ) + amount;


    let status;


    if (
        newRemaining === 0
    ) {

        status =
            "PAID";

    } else if (
        paidAmount > 0
    ) {

        status =
            "PARTIALLY_PAID";

    } else {

        status =
            "ACTIVE";

    }


    return personalDebtorRepository.recordPayment(

        Number(accountId),

        Number(debtorId),

        amount,

        newRemaining,

        status

    );

}


// ======================================================
// UPDATE PERSONAL DEBTOR
// ======================================================
//
// Editable fields:
//
// - name
// - dueDate
// - notes
//
// Financial values are NOT changed here.
//
// Payments must go through recordPayment().
//
// ======================================================

function updatePersonalDebtor(
    accountId,
    debtorId,
    data
) {

    validateAccountId(
        accountId
    );


    validateDebtorId(
        debtorId
    );


    if (!data) {

        throw new Error(
            "Update data is required."
        );

    }


    const existing =
        personalDebtorRepository.getPersonalDebtorById(

            Number(accountId),

            Number(debtorId)

        );


    if (!existing) {

        throw new Error(
            "Personal debtor not found."
        );

    }


    const name =
        data.name !== undefined
            ? String(data.name).trim()
            : existing.name;


    if (!name) {

        throw new Error(
            "Debtor name is required."
        );

    }


    const dueDate =
        data.dueDate !== undefined
            ? (
                data.dueDate
                    ? String(data.dueDate).trim()
                    : null
            )
            : existing.due_date;


    const notes =
        data.notes !== undefined
            ? String(data.notes).trim()
            : existing.notes;


    return personalDebtorRepository.updatePersonalDebtor(

        Number(accountId),

        Number(debtorId),

        {

            name,

            dueDate,

            notes

        }

    );

}


// ======================================================
// UPDATE STATUS
// ======================================================
//
// Status changes should normally be driven by business
// events.
//
// This method is kept here for controlled service-level
// status changes.
//
// ======================================================

function updatePersonalDebtorStatus(
    accountId,
    debtorId,
    status
) {

    validateAccountId(
        accountId
    );


    validateDebtorId(
        debtorId
    );


    const allowedStatuses = [

        "ACTIVE",

        "PARTIALLY_PAID",

        "PAID",

        "OVERDUE",

        "CANCELLED"

    ];


    if (
        !allowedStatuses.includes(
            status
        )
    ) {

        throw new Error(
            "Invalid personal debtor status."
        );

    }


    const debtor =
        personalDebtorRepository.getPersonalDebtorById(

            Number(accountId),

            Number(debtorId)

        );


    if (!debtor) {

        throw new Error(
            "Personal debtor not found."
        );

    }


    return personalDebtorRepository.updatePersonalDebtorStatus(

        Number(accountId),

        Number(debtorId),

        status

    );

}


// ======================================================
// DELETE PERSONAL DEBTOR
// ======================================================
//
// The service verifies that the debtor exists before
// deletion.
//
// ======================================================

function deletePersonalDebtor(
    accountId,
    debtorId
) {

    validateAccountId(
        accountId
    );


    validateDebtorId(
        debtorId
    );


    const debtor =
        personalDebtorRepository.getPersonalDebtorById(

            Number(accountId),

            Number(debtorId)

        );


    if (!debtor) {

        throw new Error(
            "Personal debtor not found."
        );

    }


    return personalDebtorRepository.deletePersonalDebtor(

        Number(accountId),

        Number(debtorId)

    );

}


// ======================================================
// GET TOTAL OUTSTANDING
// ======================================================

function getTotalOutstanding(
    accountId
) {

    validateAccountId(
        accountId
    );


    return personalDebtorRepository.getTotalOutstanding(

        Number(accountId)

    );

}


// ======================================================
// GET SUMMARY
// ======================================================

function getSummary(
    accountId
) {

    validateAccountId(
        accountId
    );


    return personalDebtorRepository.getSummary(

        Number(accountId)

    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createPersonalDebtor,

    getPersonalDebtorById,

    getPersonalDebtors,

    getActivePersonalDebtors,

    searchPersonalDebtors,

    recordPayment,

    updatePersonalDebtor,

    updatePersonalDebtorStatus,

    deletePersonalDebtor,

    getTotalOutstanding,

    getSummary

};