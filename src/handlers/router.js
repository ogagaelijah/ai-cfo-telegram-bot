const {
    getSession,
    clearSession
} = require("../states/sessionManager");

const {
    handleRegistration
} = require("../flows/registrationFlow");

const STATES =
    require("../constants/states");


// ======================================================
// KEYBOARDS
// ======================================================

const keyboard =
    require("../keyboards/mainKeyboard");

const personalKeyboard =
    require("../keyboards/personal/personalKeyboard");


// ======================================================
// ACCOUNT CONTEXT
// ======================================================

const accountContext =
    require("../services/accountContext");


// ======================================================
// BUSINESS FLOWS
// ======================================================

const salesFlow =
    require("../flows/salesFlow");

const expenseFlow =
    require("../flows/expenseFlow");

const incomeFlow =
    require("../flows/incomeFlow");

const customerFlow =
    require("../flows/customerFlow");

const inventoryFlow =
    require("../flows/inventoryFlow");

const debtorFlow =
    require("../flows/debtorFlow");

const supplierFlow =
    require("../flows/supplierFlow");

const creditorFlow =
    require("../flows/creditorFlow");

const purchaseFlow =
    require("../flows/purchaseFlow");


// ======================================================
// PERSONAL FLOWS
// ======================================================

const personalIncomeFlow =
    require("../flows/personal/personalIncomeFlow");

const personalExpenseFlow =
    require("../flows/personal/personalExpenseFlow");

const personalSavingsFlow =
    require("../flows/personal/personalSavingsFlow");


// ======================================================
// MENU / HANDLERS
// ======================================================

const menuHandler =
    require("./menuHandler");

const personalHandler =
    require("./personal/personalHandler");

const customerHandler =
    require("./customerHandler");

const inventoryHandler =
    require("./inventoryHandler");

const reportHandler =
    require("./reportHandler");

const forecastHandler =
    require("./forecastHandler");

const businessHandler =
    require("./businessHandler");

const debtorHandler =
    require("./debtorHandler");

const supplierHandler =
    require("./supplierHandler");

const creditorHandler =
    require("./creditorHandler");

const purchaseHandler =
    require("./purchaseHandler");

const analyticsHandler =
    require("./analyticsHandler");

const aiHandler =
    require("./aiHandler");


// ======================================================
// GET CORRECT MAIN KEYBOARD
// ======================================================
//
// PERSONAL  -> personalKeyboard
// BUSINESS  -> mainKeyboard
//
// ======================================================

function getMainKeyboard(telegramId) {

    try {

        const account =
            accountContext.getCurrentAccount(
                telegramId
            );

        if (
            account &&
            account.accountType === "PERSONAL"
        ) {

            return personalKeyboard;

        }

    } catch (error) {

        console.error(
            "Account context error:",
            error
        );

    }

    return keyboard;

}


// ======================================================
// ROUTER
// ======================================================

module.exports = (bot) => {

    bot.on("text", async (ctx) => {

        const telegramId =
            ctx.from &&
            ctx.from.id
                ? ctx.from.id
                : null;


        // ==================================================
        // INVALID TELEGRAM USER
        // ==================================================

        if (!telegramId) {

            return;

        }


        // ==================================================
        // REGISTRATION
        // ==================================================

        if (await handleRegistration(ctx)) {

            return;

        }


        // ==================================================
        // MAIN MENU
        // ==================================================

        if (await menuHandler(ctx)) {

            return;

        }


        // ==================================================
        // PERSONAL FINANCE MENU
        // ==================================================

        if (await personalHandler(ctx)) {

            return;

        }


        // ==================================================
        // CUSTOMER MENU
        // ==================================================

        if (await customerHandler(ctx)) {

            return;

        }


        // ==================================================
        // INVENTORY MENU
        // ==================================================

        if (await inventoryHandler(ctx)) {

            return;

        }


        // ==================================================
        // REPORT MENU
        // ==================================================

        if (await reportHandler(ctx)) {

            return;

        }


        // ==================================================
        // FORECAST
        // ==================================================

        if (await forecastHandler(ctx)) {

            return;

        }


        // ==================================================
        // BUSINESS MENU
        // ==================================================

        if (await businessHandler(ctx)) {

            return;

        }


        // ==================================================
        // AI CHAT
        // ==================================================

        if (await aiHandler(ctx)) {

            return;

        }


        // ==================================================
        // ANALYTICS
        // ==================================================

        if (await analyticsHandler(ctx)) {

            return;

        }


        // ==================================================
        // DEBTORS MENU
        // ==================================================

        if (await debtorHandler(ctx)) {

            return;

        }


        // ==================================================
        // SUPPLIERS MENU
        // ==================================================

        if (await supplierHandler(ctx)) {

            return;

        }


        // ==================================================
        // CREDITORS MENU
        // ==================================================

        if (await creditorHandler(ctx)) {

            return;

        }


        // ==================================================
        // PURCHASE MENU
        // ==================================================

        if (await purchaseHandler(ctx)) {

            return;

        }


        // ==================================================
        // GET ACTIVE SESSION
        // ==================================================

        const session =
            getSession(
                telegramId
            );


        // ==================================================
        // NO ACTIVE SESSION
        // ==================================================

        if (!session) {

            const correctKeyboard =
                getMainKeyboard(
                    telegramId
                );

            return ctx.reply(
                "Please choose an option below.",
                correctKeyboard
            );

        }


        // ==================================================
        // SESSION ROUTING
        // ==================================================

        switch (session.state) {


            // ==============================================
            // BUSINESS SALES
            // ==============================================

            case STATES.WAITING_FOR_PRODUCT:

            case STATES.WAITING_FOR_QUANTITY:

            case STATES.WAITING_FOR_PRICE:

            case STATES.WAITING_FOR_CUSTOMER:

            case STATES.WAITING_FOR_PAYMENT_STATUS:

                return salesFlow(ctx);


            // ==============================================
            // BUSINESS EXPENSES
            // ==============================================

            case STATES.WAITING_FOR_EXPENSE_CATEGORY:

            case STATES.WAITING_FOR_EXPENSE_DESCRIPTION:

            case STATES.WAITING_FOR_EXPENSE_AMOUNT:

            case STATES.WAITING_FOR_EXPENSE_NOTE:

                return expenseFlow(ctx);


            // ==============================================
            // BUSINESS INCOME
            // ==============================================

            case STATES.WAITING_FOR_INCOME_SOURCE:

            case STATES.WAITING_FOR_INCOME_AMOUNT:

            case STATES.WAITING_FOR_INCOME_NOTE:

                return incomeFlow(ctx);


            // ==============================================
            // PERSONAL INCOME
            // ==============================================

            case STATES.WAITING_FOR_PERSONAL_INCOME_SOURCE:

            case STATES.WAITING_FOR_PERSONAL_INCOME_AMOUNT:

            case STATES.WAITING_FOR_PERSONAL_INCOME_NOTE:

                return personalIncomeFlow(ctx);


            // ==============================================
            // PERSONAL EXPENSES
            // ==============================================

            case STATES.WAITING_FOR_PERSONAL_EXPENSE_CATEGORY:

            case STATES.WAITING_FOR_PERSONAL_EXPENSE_DESCRIPTION:

            case STATES.WAITING_FOR_PERSONAL_EXPENSE_AMOUNT:

            case STATES.WAITING_FOR_PERSONAL_EXPENSE_NOTE:

                return personalExpenseFlow(ctx);


            // ==============================================
            // PERSONAL SAVINGS
            // ==============================================

            case STATES.WAITING_FOR_PERSONAL_SAVING_NAME:

            case STATES.WAITING_FOR_PERSONAL_SAVING_AMOUNT:

            case STATES.WAITING_FOR_PERSONAL_SAVING_NOTE:

                return personalSavingsFlow(ctx);


            // ==============================================
            // CUSTOMERS
            // ==============================================

            case STATES.WAITING_FOR_CUSTOMER_NAME:

            case STATES.WAITING_FOR_CUSTOMER_PHONE:

            case STATES.WAITING_FOR_CUSTOMER_EMAIL:

            case STATES.WAITING_FOR_CUSTOMER_ADDRESS:

            case STATES.WAITING_FOR_CUSTOMER_SEARCH:

                return customerFlow(ctx);


            // ==============================================
            // INVENTORY
            // ==============================================

            case STATES.WAITING_FOR_INVENTORY_PRODUCT:

            case STATES.WAITING_FOR_INVENTORY_QUANTITY:

            case STATES.WAITING_FOR_COST_PRICE:

            case STATES.WAITING_FOR_SELLING_PRICE:

                return inventoryFlow(ctx);


            // ==============================================
            // DEBTORS
            // ==============================================

            case STATES.WAITING_FOR_PAYMENT_CUSTOMER:

            case STATES.WAITING_FOR_PAYMENT_AMOUNT:

                return debtorFlow(ctx);


            // ==============================================
            // SUPPLIERS
            // ==============================================

            case STATES.WAITING_FOR_SUPPLIER_NAME:

            case STATES.WAITING_FOR_SUPPLIER_PHONE:

            case STATES.WAITING_FOR_SUPPLIER_EMAIL:

            case STATES.WAITING_FOR_SUPPLIER_ADDRESS:

                return supplierFlow(ctx);


            // ==============================================
            // SUPPLIER SEARCH
            // ==============================================

            case STATES.WAITING_FOR_SUPPLIER_SEARCH:

                return supplierHandler.handleSearchResult(ctx);


            // ==============================================
            // CREDITORS
            // ==============================================

            case STATES.WAITING_FOR_CREDITOR_SUPPLIER:

            case STATES.WAITING_FOR_CREDITOR_PAYMENT:

                return creditorFlow(ctx);


            // ==============================================
            // PURCHASES
            // ==============================================

            case STATES.WAITING_FOR_PURCHASE_SUPPLIER:

            case STATES.WAITING_FOR_PURCHASE_PRODUCT:

            case STATES.WAITING_FOR_PURCHASE_QUANTITY:

            case STATES.WAITING_FOR_PURCHASE_COST:

            case STATES.WAITING_FOR_PURCHASE_PAID:

                return purchaseFlow(ctx);


            // ==============================================
            // UNKNOWN SESSION
            // ==============================================

            default: {

                console.warn(
                    "Unknown session state:",
                    session.state
                );


                clearSession(
                    telegramId
                );


                const correctKeyboard =
                    getMainKeyboard(
                        telegramId
                    );


                return ctx.reply(

                    "⚠️ Session expired. Please start again.",

                    correctKeyboard

                );

            }

        }

    });

};