const { getSession, clearSession } = require("../states/sessionManager");

const STATES = require("../constants/states");

const keyboard = require("../keyboards/mainKeyboard");

const salesFlow = require("../flows/salesFlow");
const expenseFlow = require("../flows/expenseFlow");
const incomeFlow = require("../flows/incomeFlow");
const customerFlow = require("../flows/customerFlow");
const inventoryFlow = require("../flows/inventoryFlow");
const debtorFlow = require("../flows/debtorFlow");
const supplierFlow = require("../flows/supplierFlow");

const menuHandler = require("./menuHandler");
const customerHandler = require("./customerHandler");
const inventoryHandler = require("./inventoryHandler");
const reportHandler = require("./reportHandler");
const debtorHandler = require("./debtorHandler");
const supplierHandler = require("./supplierHandler");

module.exports = (bot) => {

    bot.on("text", async (ctx) => {

        // ==========================
        // MAIN MENU
        // ==========================
        if (await menuHandler(ctx)) {
            return;
        }

        // ==========================
        // CUSTOMER MENU
        // ==========================
        if (await customerHandler(ctx)) {
            return;
        }

        // ==========================
        // INVENTORY MENU
        // ==========================
        if (await inventoryHandler(ctx)) {
            return;
        }

        // ==========================
        // REPORT MENU
        // ==========================
        if (await reportHandler(ctx)) {
            return;
        }

        // ==========================
        // DEBTORS MENU
        // ==========================
        if (await debtorHandler(ctx)) {
            return;
        }

        // ==========================
        // SUPPLIERS MENU
        // ==========================
        if (await supplierHandler(ctx)) {
            return;
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

            // ==========================
            // SALES
            // ==========================
            case STATES.WAITING_FOR_PRODUCT:
            case STATES.WAITING_FOR_QUANTITY:
            case STATES.WAITING_FOR_PRICE:
            case STATES.WAITING_FOR_CUSTOMER:
            case STATES.WAITING_FOR_PAYMENT_STATUS:
                return salesFlow(ctx);

            // ==========================
            // EXPENSES
            // ==========================
            case STATES.WAITING_FOR_EXPENSE_CATEGORY:
            case STATES.WAITING_FOR_EXPENSE_DESCRIPTION:
            case STATES.WAITING_FOR_EXPENSE_AMOUNT:
            case STATES.WAITING_FOR_EXPENSE_NOTE:
                return expenseFlow(ctx);

            // ==========================
            // INCOME
            // ==========================
            case STATES.WAITING_FOR_INCOME_SOURCE:
            case STATES.WAITING_FOR_INCOME_AMOUNT:
            case STATES.WAITING_FOR_INCOME_NOTE:
                return incomeFlow(ctx);

            // ==========================
            // CUSTOMERS
            // ==========================
            case STATES.WAITING_FOR_CUSTOMER_NAME:
            case STATES.WAITING_FOR_CUSTOMER_PHONE:
            case STATES.WAITING_FOR_CUSTOMER_EMAIL:
            case STATES.WAITING_FOR_CUSTOMER_ADDRESS:
            case STATES.WAITING_FOR_CUSTOMER_SEARCH:
                return customerFlow(ctx);

            // ==========================
            // INVENTORY
            // ==========================
            case STATES.WAITING_FOR_INVENTORY_PRODUCT:
            case STATES.WAITING_FOR_INVENTORY_QUANTITY:
            case STATES.WAITING_FOR_COST_PRICE:
            case STATES.WAITING_FOR_SELLING_PRICE:
                return inventoryFlow(ctx);

            // ==========================
            // DEBTORS
            // ==========================
            case STATES.WAITING_FOR_PAYMENT_CUSTOMER:
            case STATES.WAITING_FOR_PAYMENT_AMOUNT:
                return debtorFlow(ctx);

            // ==========================
            // SUPPLIERS
            // ==========================
            case STATES.WAITING_FOR_SUPPLIER_NAME:
            case STATES.WAITING_FOR_SUPPLIER_PHONE:
            case STATES.WAITING_FOR_SUPPLIER_EMAIL:
            case STATES.WAITING_FOR_SUPPLIER_ADDRESS:
                return supplierFlow(ctx);

            // ==========================
            // UNKNOWN SESSION
            // ==========================
            default:

                clearSession(ctx.from.id);

                return ctx.reply(
                    "⚠️ Session expired. Please start again.",
                    keyboard
                );

        }

    });

};