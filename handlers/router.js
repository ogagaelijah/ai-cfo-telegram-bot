const { getSession, setSession } = require("../states/sessionManager");

const STATES = require("../constants/states");

const keyboard = require("../keyboards/mainKeyboard");
const expenseKeyboard = require("../keyboards/expenseKeyboard");
const incomeKeyboard = require("../keyboards/incomeKeyboard");

const salesFlow = require("../flows/salesFlow");
const expenseFlow = require("../flows/expenseFlow");
const incomeFlow = require("../flows/incomeFlow");
const reportFlow = require("../flows/reportFlow");

module.exports = (bot) => {

    bot.on("text", async (ctx) => {

        const text = ctx.message.text;

        if (text === "/start") return;

        // ==========================
        // SALES
        // ==========================
        if (text === "📦 Record Sale") {

            setSession(ctx.from.id, {
                state: STATES.WAITING_FOR_PRODUCT
            });

            return ctx.reply(
                "📦 What product did you sell?"
            );

        }

        // ==========================
        // EXPENSE
        // ==========================
        if (text === "💸 Record Expense") {

            setSession(ctx.from.id, {
                state: STATES.WAITING_FOR_EXPENSE_CATEGORY
            });

            return ctx.reply(
                "💸 Select an expense category:",
                expenseKeyboard
            );

        }

        // ==========================
        // INCOME
        // ==========================
        if (text === "💰 Record Income") {

            setSession(ctx.from.id, {
                state: STATES.WAITING_FOR_INCOME_SOURCE
            });

            return ctx.reply(
                "💰 Select an income source:",
                incomeKeyboard
            );

        }

        // ==========================
        // REPORTS
        // ==========================
        if (text === "📊 Reports") {

            return reportFlow(ctx);

        }

        // ==========================
        // ACTIVE SESSION
        // ==========================
        const session = getSession(ctx.from.id);

        if (!session) {

            return ctx.reply(
                "Please choose an option below.",
                keyboard
            );

        }

        switch (session.state) {

            // SALES
            case STATES.WAITING_FOR_PRODUCT:
            case STATES.WAITING_FOR_QUANTITY:
            case STATES.WAITING_FOR_PRICE:
            case STATES.WAITING_FOR_CUSTOMER:
                return salesFlow(ctx);

            // EXPENSES
            case STATES.WAITING_FOR_EXPENSE_CATEGORY:
            case STATES.WAITING_FOR_EXPENSE_DESCRIPTION:
            case STATES.WAITING_FOR_EXPENSE_AMOUNT:
            case STATES.WAITING_FOR_EXPENSE_NOTE:
                return expenseFlow(ctx);

            // INCOME
            case STATES.WAITING_FOR_INCOME_SOURCE:
            case STATES.WAITING_FOR_INCOME_AMOUNT:
            case STATES.WAITING_FOR_INCOME_NOTE:
                return incomeFlow(ctx);

            default:

                return ctx.reply(
                    "⚠️ Your session has expired. Please start again.",
                    keyboard
                );

        }

    });

};