const { getSession, setSession, clearSession } = require("../states/sessionManager");

const STATES = require("../constants/states");

const keyboard = require("../keyboards/mainKeyboard");
const expenseKeyboard = require("../keyboards/expenseKeyboard");
const incomeKeyboard = require("../keyboards/incomeKeyboard");
const customerKeyboard = require("../keyboards/customerKeyboard");

const salesFlow = require("../flows/salesFlow");
const expenseFlow = require("../flows/expenseFlow");
const incomeFlow = require("../flows/incomeFlow");
const customerFlow = require("../flows/customerFlow");
const reportFlow = require("../flows/reportFlow");

const {
    getCustomers
} = require("../services/customerService");

module.exports = (bot) => {

    bot.on("text", async (ctx) => {

        const text = ctx.message.text;

        // ==========================
        // START
        // ==========================
        if (text === "/start") {
            return;
        }

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
        // CUSTOMERS MENU
        // ==========================
        if (text === "👥 Customers") {

            clearSession(ctx.from.id);

            return ctx.reply(
                "👥 CUSTOMER MANAGEMENT",
                customerKeyboard
            );

        }

        // ==========================
        // ADD CUSTOMER
        // ==========================
        if (text === "➕ Add Customer") {

            setSession(ctx.from.id, {
                state: STATES.WAITING_FOR_CUSTOMER_NAME
            });

            return ctx.reply(
                "👤 Enter the customer's full name."
            );

        }

        // ==========================
        // SEARCH CUSTOMER
        // ==========================
        if (text === "🔍 Search Customer") {

            setSession(ctx.from.id, {
                state: STATES.WAITING_FOR_CUSTOMER_SEARCH
            });

            return ctx.reply(
                "🔍 Enter the customer's name or phone number."
            );

        }

        // ==========================
        // CUSTOMER LIST
        // ==========================
        if (text === "📋 Customer List") {

            const customers = getCustomers(ctx.from.id);

            if (customers.length === 0) {

                return ctx.reply(
                    "No customers have been added yet.",
                    customerKeyboard
                );

            }

            let message = "👥 CUSTOMER LIST\n\n";

            customers.forEach((customer, index) => {

                message += `${index + 1}.

👤 ${customer.name}

📞 ${customer.phone}

📧 ${customer.email || "N/A"}

🏠 ${customer.address || "N/A"}

━━━━━━━━━━━━━━━━━━

`;

            });

            return ctx.reply(
                message,
                customerKeyboard
            );

        }

        // ==========================
        // BACK
        // ==========================
        if (text === "⬅️ Back") {

            clearSession(ctx.from.id);

            return ctx.reply(
                "🏠 Main Menu",
                keyboard
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

            // CUSTOMERS
            case STATES.WAITING_FOR_CUSTOMER_NAME:
            case STATES.WAITING_FOR_CUSTOMER_PHONE:
            case STATES.WAITING_FOR_CUSTOMER_EMAIL:
            case STATES.WAITING_FOR_CUSTOMER_ADDRESS:
            case STATES.WAITING_FOR_CUSTOMER_SEARCH:
                return customerFlow(ctx);

            default:

                clearSession(ctx.from.id);

                return ctx.reply(
                    "⚠️ Session expired. Please start again.",
                    keyboard
                );

        }

    });

};