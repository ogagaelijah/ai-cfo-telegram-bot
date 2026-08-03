const keyboard = require("../keyboards/mainKeyboard");
const expenseKeyboard = require("../keyboards/expenseKeyboard");
const incomeKeyboard = require("../keyboards/incomeKeyboard");
const customerKeyboard = require("../keyboards/customerKeyboard");
const inventoryKeyboard = require("../keyboards/inventoryKeyboard");

const {
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

/**
 * Handles all top-level menu navigation.
 * Returns true if the message has been handled.
 */
module.exports = async function menuHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // START
    // ==========================
    if (text === "/start") {
        return true;
    }

    // ==========================
    // SALES
    // ==========================
    if (text === "📦 Record Sale") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_PRODUCT

        });

        await ctx.reply(
            "📦 What product did you sell?"
        );

        return true;

    }

    // ==========================
    // EXPENSE
    // ==========================
    if (text === "💸 Record Expense") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_EXPENSE_CATEGORY

        });

        await ctx.reply(

            "💸 Select an expense category:",

            expenseKeyboard

        );

        return true;

    }

    // ==========================
    // INCOME
    // ==========================
    if (text === "💰 Record Income") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_INCOME_SOURCE

        });

        await ctx.reply(

            "💰 Select an income source:",

            incomeKeyboard

        );

        return true;

    }

    // ==========================
    // INVENTORY
    // ==========================
    if (text === "📦 Inventory") {

        clearSession(ctx.from.id);

        await ctx.reply(

            "📦 INVENTORY MANAGEMENT",

            inventoryKeyboard

        );

        return true;

    }

    // ==========================
    // CUSTOMERS
    // ==========================
    if (text === "👥 Customers") {

        clearSession(ctx.from.id);

        await ctx.reply(

            "👥 CUSTOMER MANAGEMENT",

            customerKeyboard

        );

        return true;

    }

    // ==========================
    // BACK
    // ==========================
    if (text === "⬅️ Back") {

        clearSession(ctx.from.id);

        await ctx.reply(

            "🏠 Main Menu",

            keyboard

        );

        return true;

    }

    return false;

};