const personalKeyboard =
    require("../../keyboards/personal/personalKeyboard");

const personalExpenseKeyboard =
    require("../../keyboards/personal/personalExpenseKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../../states/sessionManager");

const STATES =
    require("../../constants/states");

const accountContext =
    require("../../services/accountContext");

const personalExpense =
    require("../../application/personal/personalExpense");


// ======================================================
// PERSONAL EXPENSE TELEGRAM ADAPTER
// ======================================================
//
// This file is Telegram-specific.
//
// It handles:
//
// - Telegram messages
// - Telegram sessions
// - Telegram keyboards
// - Telegram responses
//
// It does NOT contain accounting logic.
//
// Accounting logic is delegated to:
//
// application/personal/personalExpense.js
//
// ======================================================


module.exports = async function personalExpenseFlow(ctx) {

    const telegramId =
        ctx.from.id;


    // ==================================================
    // GET SESSION
    // ==================================================

    const session =
        getSession(
            telegramId
        );


    if (!session) {

        return false;

    }


    // ==================================================
    // MESSAGE TEXT
    // ==================================================

    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";


    // ==================================================
    // BACK TO PERSONAL FINANCE
    // ==================================================

    if (
        text === "⬅️ Back to Personal Finance" ||
        text === "🔙 Back to Personal Finance"
    ) {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "👤 PERSONAL FINANCE\n\n" +
            "Choose an option below 👇",

            personalKeyboard

        );


        return true;

    }


    // ==================================================
    // PERSONAL EXPENSE CATEGORY
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_PERSONAL_EXPENSE_CATEGORY
    ) {

        if (!text) {

            await ctx.reply(

                "Please select an expense category.",

                personalExpenseKeyboard

            );

            return true;

        }


        session.category =
            text;


        session.state =
            STATES.WAITING_FOR_PERSONAL_EXPENSE_DESCRIPTION;


        setSession(

            telegramId,

            session

        );


        await ctx.reply(

            "📝 What was the expense for?"

        );


        return true;

    }


    // ==================================================
    // PERSONAL EXPENSE DESCRIPTION
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_PERSONAL_EXPENSE_DESCRIPTION
    ) {

        if (!text) {

            await ctx.reply(

                "Please enter a description for the expense."

            );

            return true;

        }


        session.description =
            text;


        session.state =
            STATES.WAITING_FOR_PERSONAL_EXPENSE_AMOUNT;


        setSession(

            telegramId,

            session

        );


        await ctx.reply(

            "💵 Enter the expense amount:"

        );


        return true;

    }


    // ==================================================
    // PERSONAL EXPENSE AMOUNT
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_PERSONAL_EXPENSE_AMOUNT
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

                "⚠️ Please enter a valid amount greater than zero."

            );

            return true;

        }


        session.amount =
            amount;


        session.state =
            STATES.WAITING_FOR_PERSONAL_EXPENSE_NOTE;


        setSession(

            telegramId,

            session

        );


        await ctx.reply(

            "📝 Add a note for this expense.\n\n" +
            "Type a note or type \"None\" if you don't want to add one."

        );


        return true;

    }


    // ==================================================
    // PERSONAL EXPENSE NOTE
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_PERSONAL_EXPENSE_NOTE
    ) {

        const note =
            text.toLowerCase() === "none"
                ? ""
                : text;


        session.note =
            note;


        // ==============================================
        // RESOLVE CURRENT ACCOUNT
        // ==============================================

        let account;

        try {

            account =
                accountContext.getCurrentAccount(
                    telegramId
                );

        } catch (error) {

            console.error(
                "Personal expense account error:",
                error
            );

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ I couldn't determine your active account.\n\n" +
                "Please return to your Personal Finance menu and try again.",

                personalKeyboard

            );


            return true;

        }


        // ==============================================
        // VERIFY PERSONAL ACCOUNT
        // ==============================================

        if (
            !account ||
            account.accountType !== "PERSONAL"
        ) {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ Personal expenses can only be recorded from a PERSONAL account.",

                personalKeyboard

            );


            return true;

        }


        // ==============================================
        // SAVE PERSONAL EXPENSE
        // ==============================================

        let savedExpense;

        try {

            savedExpense =
                personalExpense.recordPersonalExpense(

                    account.accountId,

                    {

                        category:
                            session.category,

                        description:
                            session.description,

                        amount:
                            session.amount,

                        notes:
                            session.note

                    }

                );

        } catch (error) {

            console.error(
                "Personal expense application error:",
                error
            );


            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ I couldn't save this personal expense.\n\n" +
                "Please try again.",

                personalKeyboard

            );


            return true;

        }


        // ==============================================
        // GET TODAY'S PERSONAL EXPENSE TOTAL
        // ==============================================

        let todayExpenses = 0;

        try {

            todayExpenses =
                personalExpense.getTodayPersonalExpenses(

                    account.accountId

                );

        } catch (error) {

            console.error(
                "Personal expense total error:",
                error
            );

        }


        // ==============================================
        // CLEAR SESSION
        // ==============================================

        clearSession(
            telegramId
        );


        // ==============================================
        // SUCCESS RESPONSE
        // ==============================================

        await ctx.reply(

            "✅ PERSONAL EXPENSE RECORDED\n\n" +

            `📂 Category: ${savedExpense.category || session.category}\n` +

            `📝 Description: ${savedExpense.item || session.description}\n` +

            `💵 Amount: ₦${Number(
                savedExpense.amount
            ).toLocaleString()}\n` +

            `📝 Note: ${
                savedExpense.notes || "None"
            }\n\n` +

            `💸 Today's Personal Expenses:\n` +

            `₦${Number(
                todayExpenses
            ).toLocaleString()}\n\n` +

            "What would you like to do next? 👇",

            personalKeyboard

        );


        return true;

    }


    // ==================================================
    // UNKNOWN PERSONAL EXPENSE STATE
    // ==================================================

    return false;

};