const personalKeyboard =
    require("../keyboards/personalKeyboard");

const incomeKeyboard =
    require("../keyboards/incomeKeyboard");

const {
    clearSession,
    setSession
} = require("../states/sessionManager");

const STATES =
    require("../constants/states");

module.exports = async function personalHandler(ctx) {

    const text =
        ctx.message &&
        ctx.message.text;

    if (!text) {
        return false;
    }

    // ==================================================
    // PERSONAL FINANCE DASHBOARD
    // ==================================================

    if (text === "👤 Personal Finance") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "👤 PERSONAL FINANCE\n\nChoose an option below 👇",
            personalKeyboard
        );

        return true;
    }

    // ==================================================
    // PERSONAL INCOME
    // ==================================================

    if (text === "💰 Income") {

        clearSession(ctx.from.id);

        setSession(ctx.from.id, {
            state:
                STATES.WAITING_FOR_PERSONAL_INCOME_SOURCE
        });

        await ctx.reply(
            "💰 PERSONAL INCOME\n\nSelect your income source:",
            incomeKeyboard
        );

        return true;
    }

    // ==================================================
    // PERSONAL EXPENSES
    // ==================================================

    if (text === "💸 Expenses") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "💸 PERSONAL EXPENSES\n\nPersonal expense management will be handled here."
        );

        return true;
    }

    // ==================================================
    // PERSONAL SAVINGS
    // ==================================================

    if (text === "💵 Savings") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "💵 PERSONAL SAVINGS\n\nSavings management will be handled here."
        );

        return true;
    }

    // ==================================================
    // PERSONAL DEBTS
    // ==================================================

    if (text === "📋 Debts") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "📋 PERSONAL DEBTS\n\nYour personal debts will be managed here."
        );

        return true;
    }

    // ==================================================
    // PERSONAL DEBTORS
    // ==================================================

    if (text === "👥 Debtors") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "👥 PERSONAL DEBTORS\n\nPeople who owe you money will be managed here."
        );

        return true;
    }

    // ==================================================
    // PERSONAL GOALS
    // ==================================================

    if (text === "🎯 Personal Goals") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "🎯 PERSONAL GOALS\n\nYour personal financial goals will be managed here."
        );

        return true;
    }

    // ==================================================
    // PERSONAL CASH FLOW
    // ==================================================

    if (text === "💧 Cash Flow") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "💧 PERSONAL CASH FLOW\n\nYour personal cash flow will be displayed here."
        );

        return true;
    }

    // ==================================================
    // PERSONAL FINANCIAL REPORTS
    // ==================================================

    if (text === "📊 Financial Reports") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "📊 PERSONAL FINANCIAL REPORTS\n\nYour personal financial reports will be available here."
        );

        return true;
    }

    // ==================================================
    // PERSONAL FORECAST
    // ==================================================

    if (text === "🔮 Forecast") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "🔮 PERSONAL FORECAST\n\nYour personal financial forecast will be displayed here."
        );

        return true;
    }

    // ==================================================
    // AI FINANCIAL ADVISOR
    // ==================================================

    if (text === "🤖 AI Financial Advisor") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "🤖 AI FINANCIAL ADVISOR\n\nYour personal AI financial advisor will be available here."
        );

        return true;
    }

    // ==================================================
    // SETTINGS
    // ==================================================

    if (text === "⚙️ Settings") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "⚙️ SETTINGS\n\nPersonal account settings will be handled here."
        );

        return true;
    }

    return false;
};