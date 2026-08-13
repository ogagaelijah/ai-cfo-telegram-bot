const keyboard = require("../keyboards/mainKeyboard");
const personalKeyboard = require("../keyboards/personalKeyboard");

const expenseKeyboard = require("../keyboards/expenseKeyboard");
const incomeKeyboard = require("../keyboards/incomeKeyboard");
const customerKeyboard = require("../keyboards/customerKeyboard");
const inventoryKeyboard = require("../keyboards/inventoryKeyboard");
const creditorKeyboard = require("../keyboards/creditorKeyboard");
const purchaseKeyboard = require("../keyboards/purchaseKeyboard");
const businessKeyboard = require("../keyboards/businessKeyboard");
const transactionKeyboard = require("../keyboards/transactionKeyboard");

const {
getUserByTelegramId
} = require("../services/userService");

const {
setSession,
clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

// ======================================================
// MENU HANDLER
// ======================================================
//
// This handler is ACCOUNT-TYPE AWARE.
//
// BUSINESS accounts
// ↓
// Business keyboard + Business modules
//
// PERSONAL accounts
// ↓
// Personal keyboard + Personal modules
//
// The current account determines the interface.
//
// ======================================================

module.exports = async function menuHandler(ctx) {

const text =
    ctx.message &&
    ctx.message.text
        ? ctx.message.text.trim()
        : "";

const telegramId =
    ctx.from &&
    ctx.from.id
        ? ctx.from.id
        : null;


// ==================================================
// START
// ==================================================

if (text === "/start") {

    return true;

}


// ==================================================
// LOAD CURRENT USER
// ==================================================

const user =
    getUserByTelegramId(
        telegramId
    );


// ==================================================
// IF USER DOES NOT EXIST
// ==================================================

if (!user) {

    return false;

}


// ==================================================
// CURRENT ACCOUNT TYPE
// ==================================================

const accountType =
    user.account &&
    user.account.account_type
        ? user.account.account_type
        : "BUSINESS";


const isPersonal =
    accountType === "PERSONAL";


// ==================================================
// UNIVERSAL BACK TO MAIN MENU
// ==================================================

if (
    text === "⬅️ Back to Main Menu" ||
    text === "🔙 Back to Main Menu"
) {

    clearSession(
        telegramId
    );


    await ctx.reply(

        isPersonal
            ? "👤 PERSONAL FINANCE"
            : "📊 BUSINESS DASHBOARD",

        isPersonal
            ? personalKeyboard
            : keyboard

    );


    return true;

}


// ==================================================
// PERSONAL ACCOUNT ROUTING
// ==================================================

if (isPersonal) {

    // ==============================================
    // INCOME
    // ==============================================

    if (text === "💰 Income") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "💰 PERSONAL INCOME\n\n" +
            "Personal income management will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // EXPENSES
    // ==============================================

    if (text === "💸 Expenses") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "💸 PERSONAL EXPENSES\n\n" +
            "Personal expense management will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // SAVINGS
    // ==============================================

    if (text === "💵 Savings") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "💵 SAVINGS\n\n" +
            "Personal savings management will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // DEBTS
    // ==============================================

    if (text === "📋 Debts") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "📋 PERSONAL DEBTS\n\n" +
            "Personal debt management will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // DEBTORS
    // ==============================================

    if (text === "👥 Debtors") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "👥 PERSONAL DEBTORS\n\n" +
            "Personal debtor management will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // PERSONAL GOALS
    // ==============================================

    if (text === "🎯 Personal Goals") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "🎯 PERSONAL GOALS\n\n" +
            "Personal financial goals will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // CASH FLOW
    // ==============================================

    if (text === "💧 Cash Flow") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "💧 PERSONAL CASH FLOW\n\n" +
            "Personal cash-flow analysis will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // FINANCIAL REPORTS
    // ==============================================

    if (text === "📊 Financial Reports") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "📊 PERSONAL FINANCIAL REPORTS\n\n" +
            "Personal financial reporting will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // FORECAST
    // ==============================================

    if (text === "🔮 Forecast") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "🔮 PERSONAL FINANCIAL FORECAST\n\n" +
            "Personal forecasting will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // AI FINANCIAL ADVISOR
    // ==============================================

    if (text === "🤖 AI Financial Advisor") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "🤖 AI FINANCIAL ADVISOR\n\n" +
            "Your personal AI financial advisor will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // PERSONAL SETTINGS
    // ==============================================

    if (text === "⚙️ Settings") {

        clearSession(
            telegramId
        );


        await ctx.reply(

            "⚙️ PERSONAL SETTINGS\n\n" +
            "Personal account settings will be connected here next.",

            personalKeyboard

        );


        return true;

    }


    // ==============================================
    // IMPORTANT
    // ==============================================
    //
    // If a Personal button reaches here, DO NOT
    // allow the router to fall through to the
    // Business keyboard.
    //
    // ==============================================

    return false;

}


// ==================================================
// BUSINESS ACCOUNT ROUTING
// ==================================================

// ==================================================
// TRANSACTIONS MENU
// ==================================================

if (text === "💰 Transactions") {

    clearSession(
        telegramId
    );


    await ctx.reply(

        "💰 TRANSACTIONS",

        transactionKeyboard

    );


    return true;

}


// ==================================================
// BUSINESS MENU
// ==================================================

if (text === "📊 Business") {

    clearSession(
        telegramId
    );


    await ctx.reply(

        "📊 BUSINESS CENTER",

        businessKeyboard

    );


    return true;

}


// ==================================================
// SALES
// ==================================================

if (text === "📦 Record Sale") {

    setSession(

        telegramId,

        {
            state:
                STATES.WAITING_FOR_PRODUCT
        }

    );


    await ctx.reply(
        "📦 What product did you sell?"
    );


    return true;

}


// ==================================================
// EXPENSE
// ==================================================

if (text === "💸 Record Expense") {

    setSession(

        telegramId,

        {
            state:
                STATES.WAITING_FOR_EXPENSE_CATEGORY
        }

    );


    await ctx.reply(

        "💸 Select an expense category:",

        expenseKeyboard

    );


    return true;

}


// ==================================================
// INCOME
// ==================================================

if (text === "💰 Record Income") {

    setSession(

        telegramId,

        {
            state:
                STATES.WAITING_FOR_INCOME_SOURCE
        }

    );


    await ctx.reply(

        "💰 Select an income source:",

        incomeKeyboard

    );


    return true;

}


// ==================================================
// PURCHASES
// ==================================================

if (text === "🛒 Purchases") {

    clearSession(
        telegramId
    );


    await ctx.reply(

        "🛒 PURCHASE MANAGEMENT",

        purchaseKeyboard

    );


    return true;

}


// ==================================================
// CUSTOMERS
// ==================================================

if (text === "👥 Customers") {

    clearSession(
        telegramId
    );


    await ctx.reply(

        "👥 CUSTOMER MANAGEMENT",

        customerKeyboard

    );


    return true;

}


// ==================================================
// INVENTORY
// ==================================================

if (text === "📦 Inventory") {

    clearSession(
        telegramId
    );


    await ctx.reply(

        "📦 INVENTORY MANAGEMENT",

        inventoryKeyboard

    );


    return true;

}


// ==================================================
// CREDITORS
// ==================================================

if (text === "📕 Creditors") {

    clearSession(
        telegramId
    );


    await ctx.reply(

        "📕 CREDITORS MANAGEMENT",

        creditorKeyboard

    );


    return true;

}


// ==================================================
// BUSINESS BACK
// ==================================================

if (text === "⬅️ Back") {

    clearSession(
        telegramId
    );


    await ctx.reply(

        "📊 MAIN MENU",

        keyboard

    );


    return true;

}


// ==================================================
// NO MATCH
// ==================================================

return false;

};