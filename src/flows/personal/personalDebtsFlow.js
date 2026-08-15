const {
    getSession,
    setSession,
    clearSession
} = require("../../states/sessionManager");

const STATES =
    require("../../constants/states");

const personalDebtsApplication =
    require("../../application/personal/personalDebts");

const personalDebtKeyboard =
    require("../../keyboards/personal/personalDebtKeyboard");

const personalKeyboard =
    require("../../keyboards/personal/personalKeyboard");

const accountContext =
    require("../../services/accountContext");


// ======================================================
// PERSONAL DEBTS FLOW
// ======================================================
//
// Handles:
//
// - Add Debt
// - View Debts
// - Make Payment
// - Debt Summary
// - Update Debt
// - Complete Debt
// - Delete Debt
//
// Uses the existing states defined in:
//
// src/constants/states.js
//
// ======================================================


// ======================================================
// GET ACCOUNT ID
// ======================================================

function getAccountId(telegramId) {

    const account =
        accountContext.getCurrentAccount(
            telegramId
        );

    if (!account) {

        throw new Error(
            "ACCOUNT_NOT_FOUND"
        );

    }

    return (
        account.accountId ||
        account.id
    );
}


// ======================================================
// FORMAT MONEY
// ======================================================

function formatMoney(amount) {

    const value =
        Number(amount || 0);

    return (
        "₦" +
        value.toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        )
    );
}


// ======================================================
// PARSE DEBT ID
// ======================================================

function parseDebtId(text) {

    const debtId =
        Number(
            String(text)
                .replace(/[^\d]/g, "")
        );

    if (
        !Number.isInteger(debtId) ||
        debtId <= 0
    ) {

        return null;

    }

    return debtId;
}


// ======================================================
// DISPLAY DEBTS
// ======================================================

async function displayDebts(
    ctx,
    accountId
) {

    const debts =
        personalDebtsApplication.getDebts(
            accountId
        );

    if (
        !debts ||
        debts.length === 0
    ) {

        await ctx.reply(

            "📊 PERSONAL DEBTS\n\n" +
            "You currently have no personal debts recorded.",

            personalDebtKeyboard

        );

        return;

    }


    let message =
        "📊 PERSONAL DEBTS\n\n";


    debts.forEach(
        (debt, index) => {

            const original =
                Number(
                    debt.original_amount ||
                    debt.originalAmount ||
                    0
                );

            const paid =
                Number(
                    debt.paid_amount ||
                    debt.paidAmount ||
                    0
                );

            const remaining =
                Number(
                    debt.remaining_amount ||
                    debt.remainingAmount ||
                    Math.max(
                        original - paid,
                        0
                    )
                );

            const status =
                debt.status ||
                "ACTIVE";


            message +=
                `${index + 1}. ${debt.name}\n`;

            message +=
                `ID: ${debt.id}\n`;

            message +=
                `💳 Amount: ${formatMoney(original)}\n`;

            message +=
                `💰 Paid: ${formatMoney(paid)}\n`;

            message +=
                `📉 Remaining: ${formatMoney(remaining)}\n`;

            message +=
                `📌 Status: ${status}\n`;


            if (
                debt.due_date ||
                debt.dueDate
            ) {

                message +=
                    `📅 Due: ${
                        debt.due_date ||
                        debt.dueDate
                    }\n`;

            }


            if (
                debt.notes &&
                String(debt.notes).trim()
            ) {

                message +=
                    `📝 Note: ${debt.notes}\n`;

            }


            message +=
                "\n━━━━━━━━━━━━━━━━━━\n\n";

        }
    );


    await ctx.reply(
        message,
        personalDebtKeyboard
    );

}


// ======================================================
// DISPLAY SUMMARY
// ======================================================

async function displaySummary(
    ctx,
    accountId
) {

    const summary =
        personalDebtsApplication.getDebtSummary(
            accountId
        );


    const totalOriginal =
        Number(
            summary.totalOriginal ||
            summary.total_original ||
            summary.original_amount ||
            0
        );


    const totalPaid =
        Number(
            summary.totalPaid ||
            summary.total_paid ||
            summary.paid_amount ||
            0
        );


    const totalRemaining =
        Number(
            summary.totalRemaining ||
            summary.total_remaining ||
            summary.remaining_amount ||
            Math.max(
                totalOriginal - totalPaid,
                0
            )
        );


    await ctx.reply(

        "📈 PERSONAL DEBT SUMMARY\n\n" +

        "💳 Total Debt: " +
        formatMoney(
            totalOriginal
        ) +
        "\n\n" +

        "💰 Total Paid: " +
        formatMoney(
            totalPaid
        ) +
        "\n\n" +

        "📉 Remaining Debt: " +
        formatMoney(
            totalRemaining
        ),

        personalDebtKeyboard

    );

}


// ======================================================
// MAIN FLOW
// ======================================================

module.exports = async function personalDebtsFlow(ctx) {

    const telegramId =
        ctx.from &&
        ctx.from.id
            ? ctx.from.id
            : null;


    if (!telegramId) {

        return;

    }


    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";


    if (!text) {

        return;

    }


    // ==================================================
    // GET ACCOUNT
    // ==================================================

    let accountId;


    try {

        accountId =
            getAccountId(
                telegramId
            );

    } catch (error) {

        console.error(
            "Personal debts account error:",
            error
        );


        clearSession(
            telegramId
        );


        await ctx.reply(

            "⚠️ I could not find your personal account.\n\n" +
            "Please return to Personal Finance.",

            personalKeyboard

        );

        return;

    }


    // ==================================================
    // CURRENT SESSION
    // ==================================================

    const session =
        getSession(
            telegramId
        );


    // ==================================================
    // BACK
    // ==================================================

    if (
        text === "⬅️ Back" ||
        text === "⬅️ Back to Main Menu" ||
        text === "🔙 Back to Main Menu"
    ) {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "👤 PERSONAL FINANCE\n\n" +
            "Choose an option below 👇",

            personalKeyboard

        );

        return;

    }


    // ==================================================
    // DIRECT DEBT MENU ACTIONS
    // ==================================================

    // --------------------------------------------------
    // ADD DEBT
    // --------------------------------------------------

    if (
        text === "➕ Add Debt"
    ) {

        clearSession(
            telegramId
        );


        setSession(

            telegramId,

            {

                state:
                    STATES.WAITING_FOR_PERSONAL_DEBT_NAME,

                data: {}

            }

        );


        await ctx.reply(

            "➕ ADD PERSONAL DEBT\n\n" +
            "What is the debt for?\n\n" +
            "Example: Car maintenance"

        );

        return;

    }


    // --------------------------------------------------
    // VIEW DEBTS
    // --------------------------------------------------

    if (
        text === "📊 View Debts"
    ) {

        clearSession(
            telegramId
        );


        try {

            await displayDebts(
                ctx,
                accountId
            );

        } catch (error) {

            console.error(
                "Personal debt view error:",
                error
            );


            await ctx.reply(

                "❌ I could not load your debts.\n\n" +
                "Please try again.",

                personalDebtKeyboard

            );

        }

        return;

    }


    // --------------------------------------------------
    // DEBT SUMMARY
    // --------------------------------------------------

    if (
        text === "📈 Debt Summary"
    ) {

        clearSession(
            telegramId
        );


        try {

            await displaySummary(
                ctx,
                accountId
            );

        } catch (error) {

            console.error(
                "Personal debt summary error:",
                error
            );


            await ctx.reply(

                "❌ I could not calculate your debt summary.\n\n" +
                "Please try again.",

                personalDebtKeyboard

            );

        }

        return;

    }


    // --------------------------------------------------
    // MAKE PAYMENT
    // --------------------------------------------------

    if (
        text === "💳 Make Payment"
    ) {

        clearSession(
            telegramId
        );


        setSession(

            telegramId,

            {

                state:
                    STATES.WAITING_FOR_PERSONAL_DEBT_PAYMENT_DEBT,

                data: {}

            }

        );


        await ctx.reply(

            "💳 MAKE DEBT PAYMENT\n\n" +
            "Enter the ID of the debt you want to pay.\n\n" +
            "Example: 1\n\n" +
            "Use 📊 View Debts to see your debt IDs.",

            personalDebtKeyboard

        );

        return;

    }


    // --------------------------------------------------
    // UPDATE DEBT
    // --------------------------------------------------

    if (
        text === "✏️ Update Debt"
    ) {

        clearSession(
            telegramId
        );


        setSession(

            telegramId,

            {

                state:
                    STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_DEBT,

                data: {}

            }

        );


        await ctx.reply(

            "✏️ UPDATE PERSONAL DEBT\n\n" +
            "Enter the ID of the debt you want to update.\n\n" +
            "Example: 1\n\n" +
            "Use 📊 View Debts to see your debt IDs.",

            personalDebtKeyboard

        );

        return;

    }


    // --------------------------------------------------
    // COMPLETE DEBT
    // --------------------------------------------------

    if (
        text === "✅ Complete Debt"
    ) {

        clearSession(
            telegramId
        );


        setSession(

            telegramId,

            {

                state:
                    STATES.WAITING_FOR_PERSONAL_DEBT_COMPLETE,

                data: {}

            }

        );


        await ctx.reply(

            "✅ COMPLETE PERSONAL DEBT\n\n" +
            "Enter the ID of the debt you want to mark as completed.\n\n" +
            "Example: 1",

            personalDebtKeyboard

        );

        return;

    }


    // --------------------------------------------------
    // DELETE DEBT
    // --------------------------------------------------

    if (
        text === "🗑️ Delete Debt"
    ) {

        clearSession(
            telegramId
        );


        setSession(

            telegramId,

            {

                state:
                    STATES.WAITING_FOR_PERSONAL_DEBT_DELETE,

                data: {}

            }

        );


        await ctx.reply(

            "🗑️ DELETE PERSONAL DEBT\n\n" +
            "Enter the ID of the debt you want to delete.\n\n" +
            "Example: 1",

            personalDebtKeyboard

        );

        return;

    }


    // ==================================================
    // SESSION REQUIRED
    // ==================================================

    if (!session) {

        return;

    }


    // ==================================================
    // SESSION STATE ROUTING
    // ==================================================

    switch (
        session.state
    ) {


        // ==================================================
        // ADD DEBT — NAME
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_NAME: {

            const name =
                text.trim();


            if (!name) {

                await ctx.reply(

                    "⚠️ Please enter what the debt is for.\n\n" +
                    "Example: Car maintenance"

                );

                return;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBT_AMOUNT,

                    data: {

                        ...(session.data || {}),

                        name

                    }

                }

            );


            await ctx.reply(

                "💳 DEBT AMOUNT\n\n" +
                "How much is the debt?\n\n" +
                "Example: 150000"

            );

            return;

        }


        // ==================================================
        // ADD DEBT — AMOUNT
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_AMOUNT: {

            const amount =
                Number(
                    text.replace(
                        /[,₦\s]/g,
                        ""
                    )
                );


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                await ctx.reply(

                    "⚠️ Please enter a valid debt amount.\n\n" +
                    "Example: 150000"

                );

                return;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBT_DUE_DATE,

                    data: {

                        ...(session.data || {}),

                        originalAmount:
                            amount

                    }

                }

            );


            await ctx.reply(

                "📅 DEBT DUE DATE\n\n" +
                "Enter the due date.\n\n" +
                "Example: 2026-12-31\n\n" +
                'Or type "None" if there is no due date.'

            );

            return;

        }


        // ==================================================
        // ADD DEBT — DUE DATE
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_DUE_DATE: {

            const dueDate =
                /^none$/i.test(text)
                    ? null
                    : text.trim();


            if (
                dueDate &&
                !/^\d{4}-\d{2}-\d{2}$/.test(
                    dueDate
                )
            ) {

                await ctx.reply(

                    "⚠️ Invalid date format.\n\n" +
                    "Please use YYYY-MM-DD.\n\n" +
                    "Example: 2026-12-31\n\n" +
                    'Or type "None".'

                );

                return;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBT_NOTE,

                    data: {

                        ...(session.data || {}),

                        dueDate

                    }

                }

            );


            await ctx.reply(

                "📝 DEBT NOTE\n\n" +
                "Add a note for this debt.\n\n" +
                'Or type "None" if you do not want to add a note.'

            );

            return;

        }


        // ==================================================
        // ADD DEBT — NOTE
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_NOTE: {

            const data =
                session.data || {};


            const note =
                /^none$/i.test(text)
                    ? ""
                    : text.trim();


            if (
                !data.name ||
                !data.originalAmount
            ) {

                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "⚠️ Your debt information is incomplete.\n\n" +
                    "Please start again.",

                    personalDebtKeyboard

                );

                return;

            }


            try {

                const debt =
                    personalDebtsApplication.createDebt(

                        accountId,

                        {

                            name:
                                data.name,

                            originalAmount:
                                Number(
                                    data.originalAmount
                                ),

                            paidAmount:
                                0,

                            dueDate:
                                data.dueDate || null,

                            notes:
                                note

                        }

                    );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "✅ DEBT CREATED\n\n" +

                    "💳 Debt: " +
                    data.name +
                    "\n\n" +

                    "💰 Amount: " +
                    formatMoney(
                        debt.original_amount ||
                        debt.originalAmount ||
                        data.originalAmount
                    ) +
                    "\n\n" +

                    "📌 Status: ACTIVE\n\n" +

                    "Your personal debt has been recorded successfully.",

                    personalDebtKeyboard

                );

            } catch (error) {

                console.error(
                    "Personal debt creation error:",
                    error
                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "❌ I could not create your debt.\n\n" +
                    "Please try again.",

                    personalDebtKeyboard

                );

            }

            return;

        }


        // ==================================================
        // PAYMENT — SELECT DEBT
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_PAYMENT_DEBT: {

            const debtId =
                parseDebtId(text);


            if (!debtId) {

                await ctx.reply(

                    "⚠️ Please enter a valid debt ID.\n\n" +
                    "Example: 1"

                );

                return;

            }


            try {

                const debt =
                    personalDebtsApplication.getDebt(

                        accountId,
                        debtId

                    );


                if (!debt) {

                    await ctx.reply(

                        "⚠️ Debt not found.\n\n" +
                        "Please enter a valid debt ID."

                    );

                    return;

                }


                const remaining =
                    Number(
                        debt.remaining_amount ||
                        debt.remainingAmount ||
                        0
                    );


                if (
                    remaining <= 0
                ) {

                    clearSession(
                        telegramId
                    );


                    await ctx.reply(

                        "ℹ️ This debt has already been fully paid.",

                        personalDebtKeyboard

                    );

                    return;

                }


                setSession(

                    telegramId,

                    {

                        state:
                            STATES.WAITING_FOR_PERSONAL_DEBT_PAYMENT_AMOUNT,

                        data: {

                            debtId

                        }

                    }

                );


                await ctx.reply(

                    "💳 RECORD DEBT PAYMENT\n\n" +

                    "Debt: " +
                    debt.name +
                    "\n\n" +

                    "Remaining: " +
                    formatMoney(
                        remaining
                    ) +
                    "\n\n" +

                    "How much are you paying?\n\n" +
                    "Example: 50000"

                );

            } catch (error) {

                console.error(
                    "Personal debt payment lookup error:",
                    error
                );

            }

            return;

        }


        // ==================================================
        // PAYMENT — AMOUNT
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_PAYMENT_AMOUNT: {

            const amount =
                Number(
                    text.replace(
                        /[,₦\s]/g,
                        ""
                    )
                );


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                await ctx.reply(

                    "⚠️ Please enter a valid payment amount."

                );

                return;

            }


            const data =
                session.data || {};


            if (!data.debtId) {

                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "⚠️ Your payment session is incomplete.\n\n" +
                    "Please start again.",

                    personalDebtKeyboard

                );

                return;

            }


            try {

                const existingDebt =
                    personalDebtsApplication.getDebt(

                        accountId,
                        data.debtId

                    );


                if (!existingDebt) {

                    clearSession(
                        telegramId
                    );


                    await ctx.reply(

                        "⚠️ Debt not found.",

                        personalDebtKeyboard

                    );

                    return;

                }


                const remaining =
                    Number(
                        existingDebt.remaining_amount ||
                        existingDebt.remainingAmount ||
                        0
                    );


                if (
                    amount > remaining
                ) {

                    await ctx.reply(

                        "⚠️ Payment cannot be greater than the remaining debt.\n\n" +
                        "Remaining: " +
                        formatMoney(
                            remaining
                        )

                    );

                    return;

                }


                const debt =
                    personalDebtsApplication.addPayment(

                        accountId,
                        data.debtId,
                        amount

                    );


                clearSession(
                    telegramId
                );


                const newRemaining =
                    Number(
                        debt.remaining_amount ||
                        debt.remainingAmount ||
                        0
                    );


                const status =
                    debt.status ||
                    (
                        newRemaining <= 0
                            ? "COMPLETED"
                            : "ACTIVE"
                    );


                await ctx.reply(

                    "✅ PAYMENT RECORDED\n\n" +

                    "💳 Debt: " +
                    debt.name +
                    "\n\n" +

                    "💰 Payment: " +
                    formatMoney(
                        amount
                    ) +
                    "\n\n" +

                    "📉 Remaining: " +
                    formatMoney(
                        newRemaining
                    ) +
                    "\n\n" +

                    "📊 Status: " +
                    status,

                    personalDebtKeyboard

                );

            } catch (error) {

                console.error(
                    "Personal debt payment error:",
                    error
                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "❌ I could not record that payment.",

                    personalDebtKeyboard

                );

            }

            return;

        }


        // ==================================================
        // UPDATE DEBT — SELECT DEBT
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_DEBT: {

            const debtId =
                parseDebtId(text);


            if (!debtId) {

                await ctx.reply(

                    "⚠️ Please enter a valid debt ID.\n\n" +
                    "Example: 1"

                );

                return;

            }


            try {

                const debt =
                    personalDebtsApplication.getDebt(

                        accountId,
                        debtId

                    );


                if (!debt) {

                    await ctx.reply(

                        "⚠️ Debt not found.\n\n" +
                        "Please enter a valid debt ID."

                    );

                    return;

                }


                setSession(

                    telegramId,

                    {

                        state:
                            STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_FIELD,

                        data: {

                            debtId

                        }

                    }

                );


                await ctx.reply(

                    "✏️ UPDATE DEBT\n\n" +

                    "Debt: " +
                    debt.name +
                    "\n\n" +

                    "What would you like to update?\n\n" +

                    "1️⃣ Name\n" +
                    "2️⃣ Amount\n" +
                    "3️⃣ Due Date\n" +
                    "4️⃣ Note\n\n" +

                    "Enter 1, 2, 3 or 4."

                );

            } catch (error) {

                console.error(
                    "Personal debt update lookup error:",
                    error
                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "❌ I could not find that debt.",

                    personalDebtKeyboard

                );

            }

            return;

        }


        // ==================================================
        // UPDATE DEBT — SELECT FIELD
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_FIELD: {

            const field =
                text.trim();


            const fieldMap = {

                "1": "name",
                "2": "amount",
                "3": "dueDate",
                "4": "note"

            };


            const selectedField =
                fieldMap[field];


            if (!selectedField) {

                await ctx.reply(

                    "⚠️ Invalid option.\n\n" +
                    "Enter 1, 2, 3 or 4."

                );

                return;

            }


            setSession(

                telegramId,

                {

                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_VALUE,

                    data: {

                        ...(session.data || {}),

                        field:
                            selectedField

                    }

                }

            );


            if (
                selectedField === "name"
            ) {

                await ctx.reply(

                    "✏️ NEW DEBT NAME\n\n" +
                    "Enter the new debt name."

                );

                return;

            }


            if (
                selectedField === "amount"
            ) {

                await ctx.reply(

                    "💰 NEW DEBT AMOUNT\n\n" +
                    "Enter the new original amount."

                );

                return;

            }


            if (
                selectedField === "dueDate"
            ) {

                await ctx.reply(

                    "📅 NEW DUE DATE\n\n" +
                    "Enter YYYY-MM-DD.\n\n" +
                    'Or type "None".'

                );

                return;

            }


            if (
                selectedField === "note"
            ) {

                await ctx.reply(

                    "📝 NEW DEBT NOTE\n\n" +
                    "Enter the new note.\n\n" +
                    'Or type "None".'

                );

                return;

            }

            return;

        }


        // ==================================================
        // UPDATE DEBT — VALUE
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_VALUE: {

            const data =
                session.data || {};


            if (!data.debtId || !data.field) {

                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "⚠️ Your update session is incomplete.\n\n" +
                    "Please start again.",

                    personalDebtKeyboard

                );

                return;

            }


            let updateData = {};


            // ------------------------------------------------
            // NAME
            // ------------------------------------------------

            if (
                data.field === "name"
            ) {

                if (!text.trim()) {

                    await ctx.reply(

                        "⚠️ Please enter a valid debt name."

                    );

                    return;

                }


                updateData.name =
                    text.trim();

            }


            // ------------------------------------------------
            // AMOUNT
            // ------------------------------------------------

            if (
                data.field === "amount"
            ) {

                const amount =
                    Number(
                        text.replace(
                            /[,₦\s]/g,
                            ""
                        )
                    );


                if (
                    !Number.isFinite(amount) ||
                    amount <= 0
                ) {

                    await ctx.reply(

                        "⚠️ Please enter a valid amount."

                    );

                    return;

                }


                updateData.originalAmount =
                    amount;

            }


            // ------------------------------------------------
            // DUE DATE
            // ------------------------------------------------

            if (
                data.field === "dueDate"
            ) {

                const dueDate =
                    /^none$/i.test(text)
                        ? null
                        : text.trim();


                if (
                    dueDate &&
                    !/^\d{4}-\d{2}-\d{2}$/.test(
                        dueDate
                    )
                ) {

                    await ctx.reply(

                        "⚠️ Please use YYYY-MM-DD.\n\n" +
                        'Or type "None".'

                    );

                    return;

                }


                updateData.dueDate =
                    dueDate;

            }


            // ------------------------------------------------
            // NOTE
            // ------------------------------------------------

            if (
                data.field === "note"
            ) {

                updateData.notes =
                    /^none$/i.test(text)
                        ? ""
                        : text.trim();

            }


            try {

                const debt =
                    personalDebtsApplication.updateDebt(

                        accountId,
                        data.debtId,
                        updateData

                    );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "✅ DEBT UPDATED\n\n" +

                    "💳 Debt: " +
                    (
                        debt.name ||
                        "Personal Debt"
                    ) +
                    "\n\n" +

                    "Your debt has been updated successfully.",

                    personalDebtKeyboard

                );

            } catch (error) {

                console.error(
                    "Personal debt update error:",
                    error
                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "❌ I could not update that debt.\n\n" +
                    "Please try again.",

                    personalDebtKeyboard

                );

            }

            return;

        }


        // ==================================================
        // COMPLETE DEBT
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_COMPLETE: {

            const debtId =
                parseDebtId(text);


            if (!debtId) {

                await ctx.reply(

                    "⚠️ Please enter a valid debt ID.\n\n" +
                    "Example: 1"

                );

                return;

            }


            try {

                const debt =
                    personalDebtsApplication.getDebt(

                        accountId,
                        debtId

                    );


                if (!debt) {

                    await ctx.reply(

                        "⚠️ Debt not found.\n\n" +
                        "Please enter a valid debt ID."

                    );

                    return;

                }


                const completedDebt =
                    personalDebtsApplication.completeDebt(

                        accountId,
                        debtId

                    );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "✅ DEBT COMPLETED\n\n" +

                    "💳 Debt: " +
                    (
                        completedDebt.name ||
                        debt.name
                    ) +
                    "\n\n" +

                    "This debt has been marked as completed.",

                    personalDebtKeyboard

                );

            } catch (error) {

                console.error(
                    "Personal debt completion error:",
                    error
                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "❌ I could not complete that debt.",

                    personalDebtKeyboard

                );

            }

            return;

        }


        // ==================================================
        // DELETE DEBT
        // ==================================================

        case STATES.WAITING_FOR_PERSONAL_DEBT_DELETE: {

            const debtId =
                parseDebtId(text);


            if (!debtId) {

                await ctx.reply(

                    "⚠️ Please enter a valid debt ID.\n\n" +
                    "Example: 1"

                );

                return;

            }


            try {

                const debt =
                    personalDebtsApplication.getDebt(

                        accountId,
                        debtId

                    );


                if (!debt) {

                    await ctx.reply(

                        "⚠️ Debt not found.\n\n" +
                        "Please enter a valid debt ID."

                    );

                    return;

                }


                personalDebtsApplication.deleteDebt(

                    accountId,
                    debtId

                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "🗑️ DEBT DELETED\n\n" +

                    "The debt \"" +
                    debt.name +
                    "\" has been deleted successfully.",

                    personalDebtKeyboard

                );

            } catch (error) {

                console.error(
                    "Personal debt deletion error:",
                    error
                );


                clearSession(
                    telegramId
                );


                await ctx.reply(

                    "❌ I could not delete that debt.",

                    personalDebtKeyboard

                );

            }

            return;

        }


        // ==================================================
        // UNKNOWN STATE
        // ==================================================

        default: {

            console.error(
                "Unknown personal debt session state:",
                session.state
            );


            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ Your debt session is no longer valid.\n\n" +
                "Please open Personal Debts again.",

                personalDebtKeyboard

            );

            return;

        }

    }

};