const keyboard =
    require("../keyboards/mainKeyboard");

const personalKeyboard =
    require("../keyboards/personal/personalKeyboard");

const expenseKeyboard =
    require("../keyboards/expenseKeyboard");

const incomeKeyboard =
    require("../keyboards/incomeKeyboard");

const customerKeyboard =
    require("../keyboards/customerKeyboard");

const inventoryKeyboard =
    require("../keyboards/inventoryKeyboard");

const creditorKeyboard =
    require("../keyboards/creditorKeyboard");

const purchaseKeyboard =
    require("../keyboards/purchaseKeyboard");

const businessKeyboard =
    require("../keyboards/businessKeyboard");

const transactionKeyboard =
    require("../keyboards/transactionKeyboard");

const personalIncomeKeyboard =
    require("../keyboards/personal/personalIncomeKeyboard");

const personalExpenseKeyboard =
    require("../keyboards/personal/personalExpenseKeyboard");

const personalDebtKeyboard =
    require("../keyboards/personal/personalDebtKeyboard");

const personalDebtorKeyboard =
    require("../keyboards/personal/personalDebtorKeyboard");

const accountContext =
    require("../services/accountContext");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES =
    require("../constants/states");


// ======================================================
// MENU HANDLER
// ======================================================
//
// TELEGRAM INTERFACE LAYER
//
// Responsibilities:
//
// - Read Telegram menu messages
// - Resolve current account
// - Route PERSONAL menus
// - Route BUSINESS menus
// - Start flows
// - Never interfere with active data-entry sessions
//
// ======================================================


module.exports = async function menuHandler(ctx) {

    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";


    console.log(
        "MENU TEXT:",
        JSON.stringify(text)
    );


    const telegramId =
        ctx.from &&
        ctx.from.id
            ? ctx.from.id
            : null;


    if (!telegramId) {
        return false;
    }


    // ==================================================
    // START
    // ==================================================

    if (text === "/start") {
        return false;
    }


    // ==================================================
    // CURRENT ACCOUNT
    // ==================================================

    const account =
        accountContext.getCurrentAccount(
            telegramId
        );


    if (!account) {
        return false;
    }


    const accountType =
        account.accountType;


    const isPersonal =
        accountType === "PERSONAL";


    const isBusiness =
        accountType === "BUSINESS";


    const activeSession =
        getSession(
            telegramId
        );


    // ==================================================
    // BACK BUTTON DETECTION
    // ==================================================

    const isBackToMainMenu =
        text === "⬅️ Back to Main Menu" ||
        text === "🔙 Back to Main Menu";


    const isBack =
        text === "⬅️ Back";


    // ==================================================
    // ACTIVE SESSION PROTECTION
    // ==================================================
    //
    // Do not allow menu buttons to interfere with an
    // active data-entry operation.
    //
    // Back buttons are always allowed.
    //
    // ==================================================

    if (
        activeSession &&
        !isBackToMainMenu &&
        !isBack
    ) {

        return false;

    }


    // ==================================================
    // UNIVERSAL BACK TO MAIN MENU
    // ==================================================

    if (isBackToMainMenu) {

        clearSession(
            telegramId
        );


        if (isPersonal) {

            await ctx.reply(

                "👤 PERSONAL FINANCE\n\n" +
                "Choose an option below 👇",

                personalKeyboard
            );

        }

        else if (isBusiness) {

            await ctx.reply(

                "📊 BUSINESS DASHBOARD\n\n" +
                "Choose an option below 👇",

                keyboard
            );

        }


        return true;

    }


    // ======================================================
    // PERSONAL ACCOUNT
    // ======================================================

    if (isPersonal) {


        // ==================================================
        // PERSONAL INCOME
        // ==================================================

        if (text === "💰 Income") {

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


            await ctx.reply(

                "💰 PERSONAL INCOME\n\n" +
                "Select your income source:",

                personalIncomeKeyboard
            );


            return true;

        }


        // ==================================================
        // PERSONAL EXPENSES
        // ==================================================

        if (text === "💸 Expenses") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_EXPENSE_CATEGORY
                }

            );


            await ctx.reply(

                "💸 PERSONAL EXPENSES\n\n" +
                "Select an expense category:",

                personalExpenseKeyboard
            );


            return true;

        }


        // ==================================================
        // PERSONAL DEBTS
        // ==================================================

        if (text === "📋 Debts") {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "📋 PERSONAL DEBTS\n\n" +
                "Choose an option below 👇",

                personalDebtKeyboard
            );


            return true;

        }


        // ==================================================
        // ADD PERSONAL DEBT
        // ==================================================

        if (text === "➕ Add Debt") {

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

                "💳 ADD PERSONAL DEBT\n\n" +
                "What is the debt for?\n\n" +
                "Example: School fees"

            );


            return true;

        }


        // ==================================================
        // MAKE PERSONAL DEBT PAYMENT
        // ==================================================

        if (text === "💳 Make Payment") {

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
                "Enter the debt ID you want to make a payment for.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // UPDATE PERSONAL DEBT
        // ==================================================

        if (text === "✏️ Update Debt") {

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
                "Enter the debt ID you want to update.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // COMPLETE PERSONAL DEBT
        // ==================================================

        if (text === "✅ Complete Debt") {

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
                "Enter the debt ID you want to mark as completed.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // DELETE PERSONAL DEBT
        // ==================================================

        if (text === "🗑️ Delete Debt") {

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
                "Enter the debt ID you want to delete.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // PERSONAL DEBTORS MENU
        // ==================================================

        if (text === "👥 Debtors") {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "👥 PERSONAL DEBTORS\n\n" +
                "Choose an option below 👇",

                personalDebtorKeyboard
            );


            return true;

        }


        // ==================================================
        // ADD PERSONAL DEBTOR
        // ==================================================

        if (text === "➕ Add Debtor") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_NAME,

                    data: {}

                }

            );


            await ctx.reply(

                "👤 ADD PERSONAL DEBTOR\n\n" +
                "Who owes you money?\n\n" +
                "Example: John"

            );


            return true;

        }


        // ==================================================
        // VIEW PERSONAL DEBTORS
        // ==================================================
        //
        // The personalDebtorsFlow performs the actual
        // database lookup and sends the results.
        //
        // ==================================================

        if (text === "📊 View Debtors") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_VIEW,

                    data: {}

                }

            );


            return false;

        }


        // ==================================================
        // RECEIVE DEBTOR PAYMENT
        // ==================================================

        if (text === "💳 Receive Payment") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_PAYMENT_DEBT,

                    data: {}

                }

            );


            await ctx.reply(

                "💳 RECEIVE DEBTOR PAYMENT\n\n" +
                "Enter the debtor ID you want to receive a payment from.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // DEBTOR SUMMARY
        // ==================================================
        //
        // The personalDebtorsFlow performs the actual
        // database lookup and sends the summary.
        //
        // ==================================================

        if (text === "📈 Debtor Summary") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_SUMMARY,

                    data: {}

                }

            );


            return false;

        }


        // ==================================================
        // UPDATE PERSONAL DEBTOR
        // ==================================================

        if (text === "✏️ Update Debtor") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_DEBT,

                    data: {}

                }

            );


            await ctx.reply(

                "✏️ UPDATE PERSONAL DEBTOR\n\n" +
                "Enter the debtor ID you want to update.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // COMPLETE PERSONAL DEBTOR
        // ==================================================

        if (text === "✅ Complete Debtor") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_COMPLETE,

                    data: {}

                }

            );


            await ctx.reply(

                "✅ COMPLETE PERSONAL DEBTOR\n\n" +
                "Enter the debtor ID you want to mark as completed.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // DELETE PERSONAL DEBTOR
        // ==================================================

        if (text === "🗑️ Delete Debtor") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_DEBTOR_DELETE,

                    data: {}

                }

            );


            await ctx.reply(

                "🗑️ DELETE PERSONAL DEBTOR\n\n" +
                "Enter the debtor ID you want to delete.\n\n" +
                "Example: 1"

            );


            return true;

        }


        // ==================================================
        // PERSONAL CASH FLOW
        // ==================================================

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


        // ==================================================
        // PERSONAL FINANCIAL REPORTS
        // ==================================================

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


        // ==================================================
        // PERSONAL FORECAST
        // ==================================================

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


        // ==================================================
        // PERSONAL AI ADVISOR
        // ==================================================

        if (
            text ===
            "🤖 AI Financial Advisor"
        ) {

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


        // ==================================================
        // SETTINGS
        // ==================================================

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


        // ==================================================
        // PERSONAL BACK
        // ==================================================

        if (text === "⬅️ Back") {

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
        // ACTIVE SESSION
        // ==================================================

        if (activeSession) {
            return false;
        }


        // ==================================================
        // SAFE FALLBACK
        // ==================================================

        await ctx.reply(

            "Please choose an option from your PERSONAL FINANCE menu.",

            personalKeyboard
        );


        return true;

    }


    // ======================================================
    // BUSINESS ACCOUNT
    // ======================================================

    if (isBusiness) {


        // ==================================================
        // TRANSACTIONS
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
        // BUSINESS CENTER
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
        // RECORD SALE
        // ==================================================

        if (text === "📦 Record Sale") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PRODUCT,

                    data: {}

                }

            );


            await ctx.reply(
                "📦 What product did you sell?"
            );


            return true;

        }


        // ==================================================
        // RECORD EXPENSE
        // ==================================================

        if (text === "💸 Record Expense") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_EXPENSE_CATEGORY,

                    data: {}

                }

            );


            await ctx.reply(

                "💸 Select an expense category:",

                expenseKeyboard
            );


            return true;

        }


        // ==================================================
        // RECORD INCOME
        // ==================================================

        if (text === "💰 Record Income") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_INCOME_SOURCE,

                    data: {}

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

                "📊 BUSINESS DASHBOARD\n\n" +
                "Choose an option below 👇",

                keyboard
            );


            return true;

        }


        // ==================================================
        // ACTIVE SESSION
        // ==================================================

        if (activeSession) {
            return false;
        }


        // ==================================================
        // SAFE FALLBACK
        // ==================================================

        await ctx.reply(

            "Please choose an option from your BUSINESS dashboard.",

            keyboard
        );


        return true;

    }


    return false;

};