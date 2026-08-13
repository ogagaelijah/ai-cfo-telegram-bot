const personalKeyboard =
    require("../../keyboards/personal/personalKeyboard");

const personalIncomeKeyboard =
    require("../../keyboards/personal/personalIncomeKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../../states/sessionManager");

const STATES =
    require("../../constants/states");

const accountContext =
    require("../../services/accountContext");

const personalIncome =
    require("../../application/personal/personalIncome");


// ======================================================
// PERSONAL INCOME TELEGRAM ADAPTER
// ======================================================
//
// TELEGRAM INTERFACE LAYER
//
// This file handles:
//
// - Telegram input
// - Telegram sessions
// - Telegram keyboards
// - Telegram responses
//
// It does NOT contain accounting logic.
//
// Accounting operations are delegated to:
//
// application/personal/personalIncome.js
//
// ======================================================


module.exports = async function personalIncomeFlow(ctx) {

    // ==================================================
    // TELEGRAM USER
    // ==================================================

    const telegramId =
        ctx.from &&
        ctx.from.id
            ? ctx.from.id
            : null;


    if (!telegramId) {
        return false;
    }


    // ==================================================
    // LOAD SESSION
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
        text === "⬅️ Back"
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
    // PERSONAL INCOME SOURCE
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_PERSONAL_INCOME_SOURCE
    ) {

        if (!text) {

            await ctx.reply(

                "Please select an income source.",

                personalIncomeKeyboard

            );

            return true;
        }


        session.source =
            text;


        session.state =
            STATES.WAITING_FOR_PERSONAL_INCOME_AMOUNT;


        setSession(

            telegramId,

            session

        );


        await ctx.reply(

            `💰 Personal Income Source: ${session.source}\n\n` +
            "💵 Enter the amount:"

        );


        return true;
    }


    // ==================================================
    // PERSONAL INCOME AMOUNT
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_PERSONAL_INCOME_AMOUNT
    ) {

        const amount =
            Number(
                text.replace(/,/g, "")
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
            STATES.WAITING_FOR_PERSONAL_INCOME_NOTE;


        setSession(

            telegramId,

            session

        );


        await ctx.reply(

            "📝 Add a note for this income.\n\n" +
            "You can type a note or reply with \"None\"."

        );


        return true;
    }


    // ==================================================
    // PERSONAL INCOME NOTE
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_PERSONAL_INCOME_NOTE
    ) {

        session.note =
            !text ||
            text.toLowerCase() === "none"
                ? ""
                : text;


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
                "Personal account context error:",
                error
            );

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ I couldn't determine your active personal account.\n\n" +
                "Please return to your personal finance menu and try again.",

                personalKeyboard

            );


            return true;
        }


        // ==============================================
        // ACCOUNT NOT FOUND
        // ==============================================

        if (!account) {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ I couldn't determine your active account.\n\n" +
                "Please return to your personal finance menu and try again.",

                personalKeyboard

            );


            return true;
        }


        // ==============================================
        // VERIFY PERSONAL ACCOUNT
        // ==============================================

        if (
            account.accountType !==
            "PERSONAL"
        ) {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ Personal income can only be recorded from a PERSONAL account.",

                personalKeyboard

            );


            return true;
        }


        // ==============================================
        // RECORD PERSONAL INCOME
        // ==============================================

        let savedIncome;

        try {

            savedIncome =
                personalIncome.recordPersonalIncome(

                    account.accountId,

                    {
                        source:
                            session.source,

                        amount:
                            session.amount,

                        note:
                            session.note

                    }

                );

        } catch (error) {

            console.error(
                "Personal income application error:",
                error
            );


            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ I couldn't save this personal income record.\n\n" +
                "Please try again.",

                personalKeyboard

            );


            return true;
        }


        // ==============================================
        // GET TODAY'S PERSONAL INCOME
        // ==============================================

        let todayIncome = 0;

        try {

            todayIncome =
                personalIncome.getTodayPersonalIncome(

                    account.accountId

                );

        } catch (error) {

            console.error(
                "Personal income total error:",
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
        // SUCCESS
        // ==============================================

        await ctx.reply(

            "✅ PERSONAL INCOME RECORDED\n\n" +

            `💰 Source: ${savedIncome.source}\n` +

            `💵 Amount: ₦${Number(
                savedIncome.amount
            ).toLocaleString()}\n` +

            `📝 Note: ${
                savedIncome.notes || "None"
            }\n\n` +

            `📊 Today's Personal Income: ₦${Number(
                todayIncome
            ).toLocaleString()}\n\n` +

            "What would you like to do next?",

            personalKeyboard

        );


        return true;
    }


    // ==================================================
    // UNKNOWN PERSONAL INCOME SESSION
    // ==================================================

    clearSession(
        telegramId
    );


    await ctx.reply(

        "⚠️ This personal income session has expired.\n\n" +
        "Please choose an option from your personal finance menu.",

        personalKeyboard

    );


    return true;

};