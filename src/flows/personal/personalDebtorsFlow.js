const {
    getSession,
    setSession,
    clearSession
} = require("../../states/sessionManager");

const STATES =
    require("../../constants/states");

const accountContext =
    require("../../services/accountContext");

const personalDebtorApplication =
    require("../../application/personal/personalDebtors");

const personalDebtorKeyboard =
    require("../../keyboards/personal/personalDebtorKeyboard");

const personalKeyboard =
    require("../../keyboards/personal/personalKeyboard");


// ======================================================
// PERSONAL DEBTORS FLOW
// ======================================================
//
// Someone who owes money TO the user.
//
// Handles:
//
// - Add Debtor
// - View Debtors
// - Receive Payment
// - Debtor Summary
// - Update Debtor
// - Complete Debtor
// - Delete Debtor
//
// All operations are account scoped.
// ======================================================


// ======================================================
// HELPERS
// ======================================================

function money(amount) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-NG"
    );

}


function getAccountId(account) {

    return (
        account.id ||
        account.accountId
    );

}


function getRemaining(debtor) {

    return Number(
        debtor.remaining_amount ??
        debtor.remainingAmount ??
        0
    );

}


function getOriginalAmount(debtor) {

    return Number(
        debtor.original_amount ??
        debtor.originalAmount ??
        0
    );

}


function getPaidAmount(debtor) {

    return Number(
        debtor.paid_amount ??
        debtor.paidAmount ??
        0
    );

}


function getDueDate(debtor) {

    return (
        debtor.due_date ??
        debtor.dueDate ??
        null
    );

}


function getNotes(debtor) {

    return (
        debtor.notes ||
        ""
    );

}


// ======================================================
// MAIN FLOW
// ======================================================

module.exports = async function personalDebtorsFlow(ctx) {

    try {

        const telegramId =
            ctx.from &&
            ctx.from.id
                ? ctx.from.id
                : null;


        if (!telegramId) {

            return true;

        }


        const session =
            getSession(
                telegramId
            );


        if (!session) {

            return false;

        }


        const account =
            accountContext.getCurrentAccount(
                telegramId
            );


        if (!account) {

            clearSession(
                telegramId
            );

            await ctx.reply(
                "⚠️ No active account was found. Please select an account first."
            );

            return true;

        }


        const accountId =
            getAccountId(
                account
            );


        if (!accountId) {

            clearSession(
                telegramId
            );

            await ctx.reply(
                "⚠️ Your current account could not be identified."
            );

            return true;

        }


        const text =
            ctx.message &&
            ctx.message.text
                ? ctx.message.text.trim()
                : "";



        // ==================================================
        // ADD DEBTOR - NAME
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_NAME
        ) {

            if (!text) {

                await ctx.reply(
                    "Please enter the debtor's name."
                );

                return true;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_AMOUNT,

                    data: {

                        name:
                            text

                    }

                }

            );


            await ctx.reply(

                "💰 How much does this person owe you?\n\n" +
                "Example: 50000"

            );


            return true;

        }



        // ==================================================
        // ADD DEBTOR - AMOUNT
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_AMOUNT
        ) {

            const amount =
                Number(
                    text.replace(
                        /,/g,
                        ""
                    )
                );


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                await ctx.reply(

                    "⚠️ Please enter a valid positive amount.\n\n" +
                    "Example: 50000"

                );

                return true;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_NOTE,

                    data: {

                        ...(session.data || {}),

                        originalAmount:
                            amount,

                        remainingAmount:
                            amount

                    }

                }

            );


            await ctx.reply(

                "📝 Enter a note for this debtor.\n\n" +
                "Type NONE if you do not want to add a note."

            );


            return true;

        }



        // ==================================================
        // ADD DEBTOR - NOTE
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_NOTE
        ) {

            const data =
                session.data || {};


            const notes =
                text.toUpperCase() === "NONE"
                    ? ""
                    : text;


            const debtor =
                await personalDebtorApplication.createDebtor(

                    accountId,

                    {

                        name:
                            data.name,

                        originalAmount:
                            data.originalAmount,

                        remainingAmount:
                            data.remainingAmount,

                        paidAmount:
                            0,

                        notes,

                        status:
                            "ACTIVE"

                    }

                );


            clearSession(
                telegramId
            );


            await ctx.reply(

                "✅ DEBTOR ADDED\n\n" +

                `👤 ${debtor.name}\n` +

                `💰 Total Owed: ₦${money(
                    getOriginalAmount(debtor)
                )}\n` +

                `💵 Remaining: ₦${money(
                    getRemaining(debtor)
                )}\n` +

                `📌 Status: ${debtor.status}`,

                personalDebtorKeyboard

            );


            return true;

        }



        // ==================================================
        // VIEW DEBTORS
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_VIEW
        ) {

            const debtors =
                await personalDebtorApplication.getDebtors(
                    accountId
                );


            clearSession(
                telegramId
            );


            if (
                !debtors ||
                debtors.length === 0
            ) {

                await ctx.reply(

                    "📋 DEBTORS\n\n" +
                    "You currently have no debtors.",

                    personalDebtorKeyboard

                );

                return true;

            }


            let message =
                "📋 YOUR DEBTORS\n\n";


            debtors.forEach(
                (debtor, index) => {

                    message +=

                        `${index + 1}. 👤 ${debtor.name}\n` +

                        `   ID: ${debtor.id}\n` +

                        `   💰 Total: ₦${money(
                            getOriginalAmount(debtor)
                        )}\n` +

                        `   💵 Paid: ₦${money(
                            getPaidAmount(debtor)
                        )}\n` +

                        `   🔴 Remaining: ₦${money(
                            getRemaining(debtor)
                        )}\n` +

                        `   📌 Status: ${debtor.status}\n`;

                    const dueDate =
                        getDueDate(debtor);

                    if (dueDate) {

                        message +=
                            `   📅 Due: ${dueDate}\n`;

                    }

                    message += "\n";

                }
            );


            await ctx.reply(

                message,

                personalDebtorKeyboard

            );


            return true;

        }



        // ==================================================
        // RECEIVE PAYMENT - DEBTOR ID
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_PAYMENT_DEBT
        ) {

            const debtorId =
                Number(text);


            if (
                !Number.isInteger(debtorId) ||
                debtorId <= 0
            ) {

                await ctx.reply(
                    "⚠️ Please enter a valid debtor ID."
                );

                return true;

            }


            const debtor =
                await personalDebtorApplication.getDebtor(

                    accountId,

                    debtorId

                );


            if (!debtor) {

                await ctx.reply(
                    "⚠️ Debtor not found."
                );

                return true;

            }


            const remaining =
                getRemaining(debtor);


            if (remaining <= 0) {

                await ctx.reply(
                    "ℹ️ This debtor has already been fully paid."
                );

                clearSession(
                    telegramId
                );

                return true;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_PAYMENT_AMOUNT,

                    data: {

                        debtorId

                    }

                }

            );


            await ctx.reply(

                `💳 ${debtor.name} currently owes you ₦${money(remaining)}.\n\n` +
                "How much did they pay?"

            );


            return true;

        }



        // ==================================================
        // RECEIVE PAYMENT - AMOUNT
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_PAYMENT_AMOUNT
        ) {

            const amount =
                Number(
                    text.replace(
                        /,/g,
                        ""
                    )
                );


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                await ctx.reply(
                    "⚠️ Please enter a valid positive payment amount."
                );

                return true;

            }


            const debtorId =
                session.data &&
                session.data.debtorId;


            const currentDebtor =
                await personalDebtorApplication.getDebtor(

                    accountId,

                    debtorId

                );


            if (!currentDebtor) {

                await ctx.reply(
                    "⚠️ Debtor not found."
                );

                clearSession(
                    telegramId
                );

                return true;

            }


            const remaining =
                getRemaining(
                    currentDebtor
                );


            if (amount > remaining) {

                await ctx.reply(

                    `⚠️ Payment cannot be greater than the remaining balance of ₦${money(remaining)}.`

                );

                return true;

            }


            const debtor =
                await personalDebtorApplication.addPayment(

                    accountId,

                    debtorId,

                    amount

                );


            if (!debtor) {

                await ctx.reply(
                    "⚠️ Payment could not be recorded."
                );

                return true;

            }


            clearSession(
                telegramId
            );


            await ctx.reply(

                "✅ PAYMENT RECEIVED\n\n" +

                `👤 ${debtor.name}\n` +

                `💵 Payment: ₦${money(amount)}\n` +

                `💰 Remaining: ₦${money(
                    getRemaining(debtor)
                )}\n` +

                `📌 Status: ${debtor.status}`,

                personalDebtorKeyboard

            );


            return true;

        }



        // ==================================================
        // DEBTOR SUMMARY
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_SUMMARY
        ) {

            const summary =
                await personalDebtorApplication.getDebtorSummary(
                    accountId
                );


            clearSession(
                telegramId
            );


            const totalDebtors =
                Number(
                    summary.totalDebtors ??
                    summary.total_debtors ??
                    summary.count ??
                    0
                );


            const totalOwed =
                Number(
                    summary.totalOwed ??
                    summary.total_owed ??
                    summary.originalAmount ??
                    summary.original_amount ??
                    0
                );


            const totalPaid =
                Number(
                    summary.totalPaid ??
                    summary.total_paid ??
                    summary.paidAmount ??
                    summary.paid_amount ??
                    0
                );


            const totalRemaining =
                Number(
                    summary.totalRemaining ??
                    summary.total_remaining ??
                    summary.remainingAmount ??
                    summary.remaining_amount ??
                    0
                );


            await ctx.reply(

                "📈 DEBTOR SUMMARY\n\n" +

                `👥 Total Debtors: ${totalDebtors}\n` +

                `💰 Total Owed: ₦${money(totalOwed)}\n` +

                `💵 Total Received: ₦${money(totalPaid)}\n` +

                `🔴 Total Outstanding: ₦${money(totalRemaining)}`,

                personalDebtorKeyboard

            );


            return true;

        }



        // ==================================================
        // UPDATE DEBTOR - ID
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_DEBT
        ) {

            const debtorId =
                Number(text);


            if (
                !Number.isInteger(debtorId) ||
                debtorId <= 0
            ) {

                await ctx.reply(
                    "⚠️ Please enter a valid debtor ID."
                );

                return true;

            }


            const debtor =
                await personalDebtorApplication.getDebtor(

                    accountId,

                    debtorId

                );


            if (!debtor) {

                await ctx.reply(
                    "⚠️ Debtor not found."
                );

                return true;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_FIELD,

                    data: {

                        debtorId

                    }

                }

            );


            await ctx.reply(

                "✏️ UPDATE DEBTOR\n\n" +

                `👤 ${debtor.name}\n` +

                `💰 Total: ₦${money(
                    getOriginalAmount(debtor)
                )}\n` +

                `💵 Paid: ₦${money(
                    getPaidAmount(debtor)
                )}\n` +

                `🔴 Remaining: ₦${money(
                    getRemaining(debtor)
                )}\n\n` +

                "What would you like to update?\n\n" +

                "1. Name\n" +
                "2. Total Amount\n" +
                "3. Note\n\n" +

                "Please reply with 1, 2 or 3."

            );


            return true;

        }



        // ==================================================
        // UPDATE DEBTOR - FIELD
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_FIELD
        ) {

            const field =
                text;


            if (
                !["1", "2", "3"].includes(field)
            ) {

                await ctx.reply(
                    "⚠️ Please reply with 1, 2 or 3."
                );

                return true;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_VALUE,

                    data: {

                        ...(session.data || {}),

                        field

                    }

                }

            );


            if (field === "1") {

                await ctx.reply(
                    "Enter the new debtor name."
                );

            }

            else if (field === "2") {

                await ctx.reply(
                    "Enter the new total amount owed."
                );

            }

            else {

                await ctx.reply(
                    "Enter the new note.\n\nType NONE to clear the note."

                );

            }


            return true;

        }



        // ==================================================
        // UPDATE DEBTOR - VALUE
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_VALUE
        ) {

            const debtorId =
                session.data &&
                session.data.debtorId;


            const field =
                session.data &&
                session.data.field;


            const debtor =
                await personalDebtorApplication.getDebtor(

                    accountId,

                    debtorId

                );


            if (!debtor) {

                await ctx.reply(
                    "⚠️ Debtor not found."
                );

                clearSession(
                    telegramId
                );

                return true;

            }


            let updateData = {};


            // ----------------------------------------------
            // NAME
            // ----------------------------------------------

            if (field === "1") {

                if (!text) {

                    await ctx.reply(
                        "Please enter a valid name."
                    );

                    return true;

                }


                updateData.name =
                    text;

            }


            // ----------------------------------------------
            // TOTAL AMOUNT
            // ----------------------------------------------

            else if (field === "2") {

                const amount =
                    Number(
                        text.replace(
                            /,/g,
                            ""
                        )
                    );


                if (
                    !Number.isFinite(amount) ||
                    amount <= 0
                ) {

                    await ctx.reply(
                        "⚠️ Please enter a valid positive amount."
                    );

                    return true;

                }


                const paidAmount =
                    getPaidAmount(
                        debtor
                    );


                if (amount < paidAmount) {

                    await ctx.reply(

                        `⚠️ The new amount cannot be less than the amount already received (₦${money(paidAmount)}).`

                    );

                    return true;

                }


                updateData.originalAmount =
                    amount;


                updateData.remainingAmount =
                    Math.max(
                        amount - paidAmount,
                        0
                    );


                updateData.status =
                    updateData.remainingAmount <= 0
                        ? "PAID"
                        : "ACTIVE";

            }


            // ----------------------------------------------
            // NOTE
            // ----------------------------------------------

            else if (field === "3") {

                updateData.notes =
                    text.toUpperCase() === "NONE"
                        ? ""
                        : text;

            }


            else {

                await ctx.reply(
                    "⚠️ Invalid update option."
                );

                clearSession(
                    telegramId
                );

                return true;

            }


            const updatedDebtor =
                await personalDebtorApplication.updateDebtor(

                    accountId,

                    debtorId,

                    updateData

                );


            clearSession(
                telegramId
            );


            await ctx.reply(

                "✅ DEBTOR UPDATED\n\n" +

                `👤 ${updatedDebtor.name}\n` +

                `💰 Total: ₦${money(
                    getOriginalAmount(updatedDebtor)
                )}\n` +

                `💵 Remaining: ₦${money(
                    getRemaining(updatedDebtor)
                )}\n` +

                `📌 Status: ${updatedDebtor.status}`,

                personalDebtorKeyboard

            );


            return true;

        }



        // ==================================================
        // COMPLETE DEBTOR
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_COMPLETE
        ) {

            const debtorId =
                Number(text);


            if (
                !Number.isInteger(debtorId) ||
                debtorId <= 0
            ) {

                await ctx.reply(
                    "⚠️ Please enter a valid debtor ID."
                );

                return true;

            }


            const debtor =
                await personalDebtorApplication.getDebtor(

                    accountId,

                    debtorId

                );


            if (!debtor) {

                await ctx.reply(
                    "⚠️ Debtor not found."
                );

                return true;

            }


            const completed =
                await personalDebtorApplication.completeDebtor(

                    accountId,

                    debtorId

                );


            if (!completed) {

                await ctx.reply(
                    "⚠️ The debtor could not be completed."
                );

                return true;

            }


            clearSession(
                telegramId
            );


            await ctx.reply(

                "✅ DEBTOR COMPLETED\n\n" +

                `👤 ${debtor.name}\n` +

                `💰 Amount: ₦${money(
                    getOriginalAmount(debtor)
                )}\n\n` +

                "The debtor has been marked as fully paid.",

                personalDebtorKeyboard

            );


            return true;

        }



        // ==================================================
        // DELETE DEBTOR
        // ==================================================

        if (
            session.state ===
            STATES.WAITING_FOR_PERSONAL_DEBTOR_DELETE
        ) {

            const debtorId =
                Number(text);


            if (
                !Number.isInteger(debtorId) ||
                debtorId <= 0
            ) {

                await ctx.reply(
                    "⚠️ Please enter a valid debtor ID."
                );

                return true;

            }


            const debtor =
                await personalDebtorApplication.getDebtor(

                    accountId,

                    debtorId

                );


            if (!debtor) {

                await ctx.reply(
                    "⚠️ Debtor not found."
                );

                return true;

            }


            const result =
                await personalDebtorApplication.deleteDebtor(

                    accountId,

                    debtorId

                );


            if (
                result &&
                result.success === false
            ) {

                await ctx.reply(
                    "⚠️ The debtor could not be deleted."
                );

                return true;

            }


            clearSession(
                telegramId
            );


            await ctx.reply(

                "🗑️ DEBTOR DELETED\n\n" +

                `👤 ${debtor.name}\n` +

                "The debtor record has been removed.",

                personalDebtorKeyboard

            );


            return true;

        }



        // ==================================================
        // UNKNOWN SESSION
        // ==================================================

        return false;

    }


    catch (error) {

        console.error(
            "Personal debtors flow error:",
            error
        );


        clearSession(

            ctx.from &&
            ctx.from.id
                ? ctx.from.id
                : null

        );


        await ctx.reply(

            "⚠️ Something went wrong while processing the debtor operation.\n\n" +
            "Please try again.",

            personalDebtorKeyboard

        );


        return true;

    }

};