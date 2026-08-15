const personalKeyboard =
    require("../../keyboards/personal/personalKeyboard");

const personalCashFlowKeyboard =
    require("../../keyboards/personal/personalCashFlowKeyboard");

const {
    getSession,
    clearSession
} = require("../../states/sessionManager");

const STATES =
    require("../../constants/states");

const accountContext =
    require("../../services/accountContext");

const personalCashFlowApplication =
    require("../../application/personal/personalCashFlow");


// ======================================================
// PERSONAL CASH FLOW TELEGRAM FLOW
// ======================================================
//
// TELEGRAM INTERFACE ADAPTER
//
// This file handles:
//
// - Telegram input
// - Telegram session
// - Telegram response
// - Telegram keyboard
// - Current account resolution
//
// It does NOT contain:
//
// - SQL
// - Repository logic
// - Core accounting calculations
//
// Architecture:
//
// Telegram
//     ↓
// Personal Cash Flow Flow
//     ↓
// Personal Cash Flow Application
//     ↓
// Personal Cash Flow Service
//     ↓
// Shared Income / Expense Repositories
//     ↓
// SQLite
//
// ======================================================


// ======================================================
// FORMAT MONEY
// ======================================================

function money(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-NG"
    );

}


// ======================================================
// GET ACCOUNT ID
// ======================================================

function getAccountId(
    account
) {

    return (
        account.accountId ||
        account.id
    );

}


// ======================================================
// FORMAT NET CASH FLOW
// ======================================================

function formatNetCashFlow(
    amount
) {

    const value =
        Number(amount) || 0;


    if (value > 0) {

        return (
            `🟢 +₦${money(value)}`
        );

    }


    if (value < 0) {

        return (
            `🔴 -₦${money(
                Math.abs(value)
            )}`
        );

    }


    return "⚪ ₦0";

}


// ======================================================
// SEND INFLOW
// ======================================================

async function sendInflow(
    ctx,
    period,
    amount
) {

    await ctx.reply(

        "💰 PERSONAL CASH FLOW\n\n" +

        `📅 ${period}\n\n` +

        `💰 Total Inflows: ₦${money(
            amount
        )}\n\n` +

        "This is the total money received during this period.",

        personalCashFlowKeyboard

    );

}


// ======================================================
// SEND OUTFLOW
// ======================================================

async function sendOutflow(
    ctx,
    period,
    amount
) {

    await ctx.reply(

        "💧 PERSONAL CASH FLOW\n\n" +

        `📅 ${period}\n\n` +

        `💸 Total Outflows: ₦${money(
            amount
        )}\n\n` +

        "This is the total money spent during this period.",

        personalCashFlowKeyboard

    );

}


// ======================================================
// SEND NET CASH FLOW
// ======================================================

async function sendNetCashFlow(
    ctx,
    period,
    amount
) {

    const value =
        Number(amount) || 0;


    let interpretation;


    if (value > 0) {

        interpretation =
            "You had more money coming in than going out. 🟢";

    }

    else if (value < 0) {

        interpretation =
            "You had more money going out than coming in. 🔴";

    }

    else {

        interpretation =
            "Your inflows and outflows were equal. ⚪";

    }


    await ctx.reply(

        "📊 PERSONAL NET CASH FLOW\n\n" +

        `📅 ${period}\n\n` +

        `💰 Inflows minus Outflows:\n` +

        `${formatNetCashFlow(value)}\n\n` +

        interpretation,

        personalCashFlowKeyboard

    );

}


// ======================================================
// MAIN FLOW
// ======================================================

module.exports =
    async function personalCashFlowFlow(ctx) {


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
        // SESSION
        // ==================================================

        const session =
            getSession(
                telegramId
            );


        if (!session) {

            return false;

        }


        // ==================================================
        // VERIFY CASH FLOW STATE
        // ==================================================

        if (
            session.state !==
            STATES.WAITING_FOR_PERSONAL_CASH_FLOW
        ) {

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
            text === "⬅️ Back" ||
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
        // RESOLVE CURRENT ACCOUNT
        // ==================================================

        let account;


        try {

            account =
                accountContext.getCurrentAccount(
                    telegramId
                );

        }

        catch (error) {

            console.error(
                "Personal cash flow account context error:",
                error
            );


            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ I couldn't determine your active personal account.\n\n" +
                "Please return to your Personal Finance menu and try again.",

                personalKeyboard

            );


            return true;

        }


        // ==================================================
        // ACCOUNT NOT FOUND
        // ==================================================

        if (!account) {

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


        // ==================================================
        // VERIFY PERSONAL ACCOUNT
        // ==================================================

        if (
            account.accountType !==
            "PERSONAL"
        ) {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ Personal cash flow can only be viewed from a PERSONAL account.",

                personalKeyboard

            );


            return true;

        }


        // ==================================================
        // ACCOUNT ID
        // ==================================================

        const accountId =
            getAccountId(
                account
            );


        if (!accountId) {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "⚠️ I couldn't determine the account ID for your active account.",

                personalKeyboard

            );


            return true;

        }


        // ==================================================
        // WEEKLY INFLOWS
        // ==================================================

        if (
            text === "💰 Inflows - Week"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getWeeklyPersonalInflows(
                            accountId
                        );


                await sendInflow(
                    ctx,
                    "THIS WEEK",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Weekly personal inflow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your weekly inflows.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // MONTHLY INFLOWS
        // ==================================================

        if (
            text === "💰 Inflows - Month"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getMonthlyPersonalInflows(
                            accountId
                        );


                await sendInflow(
                    ctx,
                    "THIS MONTH",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Monthly personal inflow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your monthly inflows.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // YEARLY INFLOWS
        // ==================================================

        if (
            text === "💰 Inflows - Year"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getYearlyPersonalInflows(
                            accountId
                        );


                await sendInflow(
                    ctx,
                    "THIS YEAR",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Yearly personal inflow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your yearly inflows.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // WEEKLY OUTFLOWS
        // ==================================================

        if (
            text === "💸 Outflows - Week"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getWeeklyPersonalOutflows(
                            accountId
                        );


                await sendOutflow(
                    ctx,
                    "THIS WEEK",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Weekly personal outflow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your weekly outflows.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // MONTHLY OUTFLOWS
        // ==================================================

        if (
            text === "💸 Outflows - Month"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getMonthlyPersonalOutflows(
                            accountId
                        );


                await sendOutflow(
                    ctx,
                    "THIS MONTH",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Monthly personal outflow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your monthly outflows.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // YEARLY OUTFLOWS
        // ==================================================

        if (
            text === "💸 Outflows - Year"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getYearlyPersonalOutflows(
                            accountId
                        );


                await sendOutflow(
                    ctx,
                    "THIS YEAR",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Yearly personal outflow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your yearly outflows.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // WEEKLY NET CASH FLOW
        // ==================================================

        if (
            text === "📊 Net Cash Flow - Week"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getWeeklyPersonalNetCashFlow(
                            accountId
                        );


                await sendNetCashFlow(
                    ctx,
                    "THIS WEEK",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Weekly personal net cash flow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your weekly net cash flow.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // MONTHLY NET CASH FLOW
        // ==================================================

        if (
            text === "📊 Net Cash Flow - Month"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getMonthlyPersonalNetCashFlow(
                            accountId
                        );


                await sendNetCashFlow(
                    ctx,
                    "THIS MONTH",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Monthly personal net cash flow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your monthly net cash flow.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // YEARLY NET CASH FLOW
        // ==================================================

        if (
            text === "📊 Net Cash Flow - Year"
        ) {

            try {

                const amount =
                    personalCashFlowApplication
                        .getYearlyPersonalNetCashFlow(
                            accountId
                        );


                await sendNetCashFlow(
                    ctx,
                    "THIS YEAR",
                    amount
                );


            }

            catch (error) {

                console.error(
                    "Yearly personal net cash flow error:",
                    error
                );


                await ctx.reply(
                    "⚠️ I couldn't calculate your yearly net cash flow.",
                    personalCashFlowKeyboard
                );

            }


            return true;

        }


        // ==================================================
        // UNKNOWN CASH FLOW OPTION
        // ==================================================

        await ctx.reply(

            "Please choose a cash-flow option below 👇",

            personalCashFlowKeyboard

        );


        return true;

    };