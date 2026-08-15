const personalKeyboard =
    require("../../keyboards/personal/personalKeyboard");

const personalDebtsKeyboard =
    require("../../keyboards/personal/personalDebtKeyboard");

const {
    clearSession,
    setSession
} = require("../../states/sessionManager");

const STATES =
    require("../../constants/states");


// ======================================================
// PERSONAL FINANCE HANDLER
// ======================================================
//
// Responsible for:
// - Personal Finance dashboard
// - Personal Finance menu navigation
// - Starting Personal Finance modules
//
// Transaction/business logic belongs in application,
// service and repository layers.
//
// ======================================================

module.exports = async function personalHandler(ctx) {

    const telegramId =
        ctx.from.id;

    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";

    if (!text) {

        return false;

    }


    // ==================================================
    // PERSONAL FINANCE DASHBOARD
    // ==================================================

    if (
        text === "👤 Personal Finance"
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
    // PERSONAL INCOME
    // ==================================================

    if (
        text === "💰 Income"
    ) {

        clearSession(
            telegramId
        );

        setSession(

            telegramId,

            {

                state:
                    STATES.WAITING_FOR_PERSONAL_INCOME_SOURCE

            }

        );

        return true;

    }


    // ==================================================
    // PERSONAL EXPENSES
    // ==================================================

    if (
        text === "💸 Expenses"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "💸 PERSONAL EXPENSES\n\n" +
            "Personal expense management will be handled here."

        );

        return true;

    }


    // ==================================================
    // PERSONAL SAVINGS
    // ==================================================

    if (
        text === "💵 Savings"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "💵 PERSONAL SAVINGS\n\n" +
            "Savings management will be handled here."

        );

        return true;

    }


    // ==================================================
    // PERSONAL DEBTS
    // ==================================================

    if (
        text === "📋 Debts"
    ) {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "📋 PERSONAL DEBTS\n\n" +
            "Choose an option below 👇",

            personalDebtsKeyboard

        );

        return true;

    }


    // ==================================================
    // PERSONAL DEBTORS
    // ==================================================

    if (
        text === "👥 Debtors"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "👥 PERSONAL DEBTORS\n\n" +
            "People who owe you money will be managed here."

        );

        return true;

    }


    // ==================================================
    // PERSONAL GOALS
    // ==================================================

    if (
        text === "🎯 Personal Goals"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "🎯 PERSONAL GOALS\n\n" +
            "Your personal financial goals will be managed here."

        );

        return true;

    }


    // ==================================================
    // PERSONAL CASH FLOW
    // ==================================================

    if (
        text === "💧 Cash Flow"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "💧 PERSONAL CASH FLOW\n\n" +
            "Your personal cash flow will be displayed here."

        );

        return true;

    }


    // ==================================================
    // PERSONAL FINANCIAL REPORTS
    // ==================================================

    if (
        text === "📊 Financial Reports"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "📊 PERSONAL FINANCIAL REPORTS\n\n" +
            "Your personal financial reports will be available here."

        );

        return true;

    }


    // ==================================================
    // PERSONAL FORECAST
    // ==================================================

    if (
        text === "🔮 Forecast"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "🔮 PERSONAL FORECAST\n\n" +
            "Your personal financial forecast will be displayed here."

        );

        return true;

    }


    // ==================================================
    // AI FINANCIAL ADVISOR
    // ==================================================

    if (
        text === "🤖 AI Financial Advisor"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "🤖 AI FINANCIAL ADVISOR\n\n" +
            "Your personal AI financial advisor will be available here."

        );

        return true;

    }


    // ==================================================
    // SETTINGS
    // ==================================================

    if (
        text === "⚙️ Settings"
    ) {

        clearSession(
            telegramId
        );

        await ctx.reply(

            "⚙️ SETTINGS\n\n" +
            "Personal account settings will be handled here."

        );

        return true;

    }


    return false;

};