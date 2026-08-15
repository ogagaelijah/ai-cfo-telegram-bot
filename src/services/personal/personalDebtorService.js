const personalDebtorRepository =
    require("../../repositories/personal/personalDebtorRepository");


// ======================================================
// PERSONAL DEBTOR SERVICE
// ======================================================
//
// BUSINESS LOGIC LAYER
//
// Personal debtor:
// Someone who owes money TO the user.
//
// Flow
//    ↓
// Application
//    ↓
// Service
//    ↓
// Repository
//
// The service layer is responsible for:
// - Validation
// - Financial consistency
// - Business rules
// - Passing clean data to repository
//
// ======================================================


// ======================================================
// HELPERS
// ======================================================

function requireAccountId(accountId) {

    if (!accountId) {

        throw new Error(
            "ACCOUNT_ID_REQUIRED"
        );

    }

}


function requireDebtorId(debtorId) {

    const id =
        Number(debtorId);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        throw new Error(
            "INVALID_DEBTOR_ID"
        );

    }

    return id;

}


function parseAmount(
    value,
    errorCode
) {

    const amount =
        Number(value);

    if (
        !Number.isFinite(amount) ||
        amount < 0
    ) {

        throw new Error(
            errorCode
        );

    }

    return amount;

}


// ======================================================
// CREATE DEBTOR
// ======================================================

async function createDebtor(
    accountId,
    data
) {

    requireAccountId(
        accountId
    );


    if (!data) {

        throw new Error(
            "DEBTOR_DATA_REQUIRED"
        );

    }


    const name =
        String(
            data.name || ""
        ).trim();


    if (!name) {

        throw new Error(
            "DEBTOR_NAME_REQUIRED"
        );

    }


    const originalAmount =
        parseAmount(
            data.originalAmount,
            "INVALID_DEBTOR_AMOUNT"
        );


    if (originalAmount <= 0) {

        throw new Error(
            "INVALID_DEBTOR_AMOUNT"
        );

    }


    const paidAmount =
        data.paidAmount !== undefined
            ? parseAmount(
                data.paidAmount,
                "INVALID_PAID_AMOUNT"
            )
            : 0;


    if (
        paidAmount >
        originalAmount
    ) {

        throw new Error(
            "PAID_AMOUNT_EXCEEDS_DEBT"
        );

    }


    const remainingAmount =
        originalAmount -
        paidAmount;


    const status =
        remainingAmount <= 0
            ? "PAID"
            : "ACTIVE";


    return personalDebtorRepository.create(

        accountId,

        {

            name,

            originalAmount,

            paidAmount,

            remainingAmount,

            dueDate:
                data.dueDate ||
                null,

            notes:
                String(
                    data.notes || ""
                ).trim(),

            status

        }

    );

}


// ======================================================
// GET ONE DEBTOR
// ======================================================

async function getDebtor(
    accountId,
    debtorId
) {

    requireAccountId(
        accountId
    );


    const id =
        requireDebtorId(
            debtorId
        );


    return personalDebtorRepository.findById(

        accountId,

        id

    );

}


// ======================================================
// GET ALL DEBTORS
// ======================================================

async function getDebtors(
    accountId
) {

    requireAccountId(
        accountId
    );


    return personalDebtorRepository.findAll(
        accountId
    );

}


// ======================================================
// GET ACTIVE DEBTORS
// ======================================================

async function getActiveDebtors(
    accountId
) {

    requireAccountId(
        accountId
    );


    return personalDebtorRepository.findActive(
        accountId
    );

}


// ======================================================
// UPDATE DEBTOR
// ======================================================

async function updateDebtor(
    accountId,
    debtorId,
    data
) {

    requireAccountId(
        accountId
    );


    const id =
        requireDebtorId(
            debtorId
        );


    if (!data) {

        throw new Error(
            "DEBTOR_DATA_REQUIRED"
        );

    }


    const updateData = {};



    // --------------------------------------------------
    // NAME
    // --------------------------------------------------

    if (
        data.name !== undefined
    ) {

        const name =
            String(
                data.name
            ).trim();


        if (!name) {

            throw new Error(
                "DEBTOR_NAME_REQUIRED"
            );

        }


        updateData.name =
            name;

    }



    // --------------------------------------------------
    // ORIGINAL AMOUNT
    // --------------------------------------------------

    if (
        data.originalAmount !== undefined
    ) {

        const originalAmount =
            parseAmount(
                data.originalAmount,
                "INVALID_DEBTOR_AMOUNT"
            );


        if (
            originalAmount <= 0
        ) {

            throw new Error(
                "INVALID_DEBTOR_AMOUNT"
            );

        }


        updateData.originalAmount =
            originalAmount;

    }



    // --------------------------------------------------
    // PAID AMOUNT
    // --------------------------------------------------

    if (
        data.paidAmount !== undefined
    ) {

        updateData.paidAmount =
            parseAmount(
                data.paidAmount,
                "INVALID_PAID_AMOUNT"
            );

    }



    // --------------------------------------------------
    // REMAINING AMOUNT
    // --------------------------------------------------

    if (
        data.remainingAmount !== undefined
    ) {

        updateData.remainingAmount =
            parseAmount(
                data.remainingAmount,
                "INVALID_REMAINING_AMOUNT"
            );

    }



    // --------------------------------------------------
    // DUE DATE
    // --------------------------------------------------

    if (
        data.dueDate !== undefined
    ) {

        updateData.dueDate =
            data.dueDate ||
            null;

    }



    // --------------------------------------------------
    // NOTES
    // --------------------------------------------------

    if (
        data.notes !== undefined
    ) {

        updateData.notes =
            String(
                data.notes || ""
            ).trim();

    }



    // --------------------------------------------------
    // STATUS
    // --------------------------------------------------

    if (
        updateData.remainingAmount !== undefined
    ) {

        updateData.status =
            updateData.remainingAmount <= 0
                ? "PAID"
                : "ACTIVE";

    }


    if (
        Object.keys(updateData).length === 0
    ) {

        throw new Error(
            "NO_DEBTOR_UPDATES"
        );

    }


    return personalDebtorRepository.update(

        accountId,

        id,

        updateData

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

    requireAccountId(
        accountId
    );


    const id =
        requireDebtorId(
            debtorId
        );


    const paymentAmount =
        parseAmount(
            amount,
            "INVALID_PAYMENT_AMOUNT"
        );


    if (
        paymentAmount <= 0
    ) {

        throw new Error(
            "INVALID_PAYMENT_AMOUNT"
        );

    }


    return personalDebtorRepository.addPayment(

        accountId,

        id,

        paymentAmount

    );

}


// ======================================================
// COMPLETE DEBTOR
// ======================================================

async function completeDebtor(
    accountId,
    debtorId
) {

    requireAccountId(
        accountId
    );


    const id =
        requireDebtorId(
            debtorId
        );


    return personalDebtorRepository.complete(

        accountId,

        id

    );

}


// ======================================================
// DELETE DEBTOR
// ======================================================

async function deleteDebtor(
    accountId,
    debtorId
) {

    requireAccountId(
        accountId
    );


    const id =
        requireDebtorId(
            debtorId
        );


    return personalDebtorRepository.remove(

        accountId,

        id

    );

}


// ======================================================
// DEBTOR SUMMARY
// ======================================================

async function getDebtorSummary(
    accountId
) {

    requireAccountId(
        accountId
    );


    return personalDebtorRepository.getSummary(
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