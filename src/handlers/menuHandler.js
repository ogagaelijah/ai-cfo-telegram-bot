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

const personalSavingsKeyboard =
    require("../keyboards/personal/personalSavingsKeyboard");

const accountContext =
    require("../services/accountContext");

const personalSavingsApplication =
    require("../application/personal/personalSavings");

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
// - Display personal savings
//
// ======================================================


module.exports = async function menuHandler(ctx) {

    // ==================================================
    // MESSAGE TEXT
    // ==================================================

    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";


    console.log(
        "MENU TEXT:",
        JSON.stringify(text)
    );


    // ==================================================
    // TELEGRAM USER ID
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
    // START
    // ==================================================

    if (text === "/start") {

        return true;

    }


    // ==================================================
    // GET CURRENT ACCOUNT
    // ==================================================

    const account =
        accountContext.getCurrentAccount(
            telegramId
        );


    // ==================================================
    // ACCOUNT NOT FOUND
    // ==================================================

    if (!account) {

        return false;

    }


    // ==================================================
    // ACCOUNT TYPE
    // ==================================================

    const accountType =
        account.accountType;

    const isPersonal =
        accountType === "PERSONAL";

    const isBusiness =
        accountType === "BUSINESS";


    // ==================================================
    // CURRENT SESSION
    // ==================================================

    const activeSession =
        getSession(
            telegramId
        );


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


        if (isPersonal) {

            await ctx.reply(

                "👤 PERSONAL FINANCE\n\n" +
                "Choose an option below 👇",

                personalKeyboard

            );

        } else {

            await ctx.reply(

                "📊 BUSINESS DASHBOARD\n\n" +
                "Choose an option below 👇",

                keyboard

            );

        }


        return true;

    }


    // ======================================================
    // PERSONAL ACCOUNT ROUTING
    // ======================================================

    if (isPersonal) {


        // ==============================================
        // PERSONAL INCOME
        // ==============================================

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


        // ==============================================
        // PERSONAL EXPENSES
        // ==============================================

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


        // ==============================================
        // PERSONAL SAVINGS
        // ==============================================

        if (text === "💵 Savings") {

            clearSession(
                telegramId
            );


            await ctx.reply(

                "💵 PERSONAL SAVINGS\n\n" +
                "Choose a savings option below 👇",

                personalSavingsKeyboard

            );


            return true;

        }


        // ==============================================
        // VIEW PERSONAL SAVINGS
        // ==============================================

        if (text === "📊 View Savings") {

            clearSession(
                telegramId
            );


            try {

                const accountId =
                    account.accountId;


                if (!accountId) {

                    throw new Error(
                        "ACCOUNT_ID_REQUIRED"
                    );

                }


                const goals =
                    personalSavingsApplication.getSavingsGoals(

                        accountId

                    );


                const summary =
                    personalSavingsApplication.getSavingsSummary(

                        accountId

                    );


                // ======================================
                // NO SAVINGS GOALS
                // ======================================

                if (
                    !goals ||
                    goals.length === 0
                ) {

                    await ctx.reply(

                        "📊 PERSONAL SAVINGS\n\n" +

                        "You currently have no savings goals.\n\n" +

                        "Create your first savings goal to start tracking your progress.",

                        personalSavingsKeyboard

                    );

                    return true;

                }


                // ======================================
                // FORMAT SUMMARY
                // ======================================

                const totalSaved =
                    Number(
                        summary.totalSaved || 0
                    );

                const totalTarget =
                    Number(
                        summary.totalTarget || 0
                    );

                const remaining =
                    Number(
                        summary.remaining || 0
                    );

                const progress =
                    Number(
                        summary.progress || 0
                    );


                let message =
                    "📊 PERSONAL SAVINGS\n\n";


                message +=
                    "💰 Total Saved: ₦" +
                    totalSaved.toLocaleString() +
                    "\n";

                message +=
                    "🎯 Total Target: ₦" +
                    totalTarget.toLocaleString() +
                    "\n";

                message +=
                    "📉 Remaining: ₦" +
                    remaining.toLocaleString() +
                    "\n";

                message +=
                    "📈 Overall Progress: " +
                    progress +
                    "%\n\n";


                message +=
                    "━━━━━━━━━━━━━━━━━━\n\n";


                message +=
                    "🎯 YOUR SAVINGS GOALS\n\n";


                // ======================================
                // DISPLAY EACH GOAL
                // ======================================

                goals.forEach(

                    (goal, index) => {

                        const target =
                            Number(
                                goal.target_amount || 0
                            );

                        const saved =
                            Number(
                                goal.saved_amount || 0
                            );

                        const goalRemaining =
                            Math.max(
                                target - saved,
                                0
                            );

                        const goalProgress =
                            target > 0

                                ? Math.min(
                                    (
                                        saved /
                                        target
                                    ) * 100,
                                    100
                                )

                                : 0;


                        let statusEmoji =
                            "🟢";


                        if (
                            goal.status ===
                            "COMPLETED"
                        ) {

                            statusEmoji =
                                "✅";

                        }


                        message +=
                            statusEmoji +
                            " " +
                            (index + 1) +
                            ". " +
                            goal.name +
                            "\n\n";


                        message +=
                            "💰 Saved: ₦" +
                            saved.toLocaleString() +
                            "\n";


                        message +=
                            "🎯 Target: ₦" +
                            target.toLocaleString() +
                            "\n";


                        message +=
                            "📉 Remaining: ₦" +
                            goalRemaining.toLocaleString() +
                            "\n";


                        message +=
                            "📈 Progress: " +
                            goalProgress.toFixed(1) +
                            "%\n";


                        if (
                            goal.deadline
                        ) {

                            message +=
                                "📅 Deadline: " +
                                goal.deadline +
                                "\n";

                        }


                        if (
                            goal.notes &&
                            String(
                                goal.notes
                            ).trim()
                        ) {

                            message +=
                                "📝 Note: " +
                                goal.notes +
                                "\n";

                        }


                        message +=
                            "📌 Status: " +
                            (
                                goal.status ||
                                "ACTIVE"
                            ) +
                            "\n\n";


                        message +=
                            "━━━━━━━━━━━━━━━━━━\n\n";

                    }

                );


                await ctx.reply(

                    message,

                    personalSavingsKeyboard

                );


                return true;

            } catch (error) {

                console.error(

                    "Personal savings view error:",

                    error

                );


                await ctx.reply(

                    "❌ I could not load your savings information.\n\n" +
                    "Please try again.",

                    personalSavingsKeyboard

                );


                return true;

            }

        }


        // ==============================================
        // CREATE PERSONAL SAVINGS GOAL
        // ==============================================

        if (text === "🎯 Create Savings Goal") {

            clearSession(
                telegramId
            );


            setSession(

                telegramId,

                {
                    state:
                        STATES.WAITING_FOR_PERSONAL_SAVING_NAME,

                    data: {}

                }

            );


            await ctx.reply(

                "🎯 CREATE SAVINGS GOAL\n\n" +
                "What are you saving for?\n\n" +
                "Example: New Laptop"

            );


            return true;

        }


        // ==============================================
        // PERSONAL DEBTS
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
        // PERSONAL DEBTORS
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
        // PERSONAL CASH FLOW
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
        // PERSONAL FINANCIAL REPORTS
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
        // PERSONAL FORECAST
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
        // PERSONAL AI FINANCIAL ADVISOR
        // ==============================================

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
        // PERSONAL BACK
        // ==============================================

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


        // ==============================================
        // PERSONAL ACTIVE SESSION
        // ==============================================

        if (activeSession) {

            return false;

        }


        // ==============================================
        // PERSONAL SAFE FALLBACK
        // ==============================================

        await ctx.reply(

            "Please choose an option from your PERSONAL FINANCE menu.",

            personalKeyboard

        );


        return true;

    }


    // ======================================================
    // BUSINESS ACCOUNT ROUTING
    // ======================================================

    if (isBusiness) {


        // ==============================================
        // TRANSACTIONS MENU
        // ==============================================

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


        // ==============================================
        // BUSINESS MENU
        // ==============================================

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


        // ==============================================
        // SALES
        // ==============================================

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


        // ==============================================
        // BUSINESS EXPENSE
        // ==============================================

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


        // ==============================================
        // BUSINESS INCOME
        // ==============================================

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


        // ==============================================
        // PURCHASES
        // ==============================================

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


        // ==============================================
        // CUSTOMERS
        // ==============================================

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


        // ==============================================
        // INVENTORY
        // ==============================================

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


        // ==============================================
        // CREDITORS
        // ==============================================

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


        // ==============================================
        // BUSINESS BACK
        // ==============================================

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


        // ==============================================
        // BUSINESS ACTIVE SESSION
        // ==============================================

        if (activeSession) {

            return false;

        }


        // ==============================================
        // BUSINESS SAFE FALLBACK
        // ==============================================

        await ctx.reply(

            "Please choose an option from your BUSINESS dashboard.",

            keyboard

        );


        return true;

    }


    // ======================================================
    // UNKNOWN ACCOUNT TYPE
    // ======================================================

    return false;

};