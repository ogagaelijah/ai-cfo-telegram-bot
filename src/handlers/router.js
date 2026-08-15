const {
    getSession
} = require("../states/sessionManager");

const {
    handleRegistration
} = require("../flows/registrationFlow");

const STATES =
    require("../constants/states");


// ======================================================
// MAIN MENU
// ======================================================

const menuHandler =
    require("./menuHandler");


// ======================================================
// PERSONAL / BUSINESS HANDLERS
// ======================================================

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

const personalDebtsFlow =
    require("../flows/personal/personalDebtsFlow");

const personalDebtorsFlow =
    require("../flows/personal/personalDebtorsFlow");

const personalCashFlowFlow =
    require("../flows/personal/personalCashFlowFlow");


// ======================================================
// ROUTER
// ======================================================

module.exports = function router(
    bot
) {

    if (!bot) {

        throw new Error(
            "BOT_REQUIRED"
        );

    }


    bot.on(
        "text",
        async (ctx) => {

            const telegramId =
                ctx.from &&
                ctx.from.id
                    ? ctx.from.id
                    : null;


            if (!telegramId) {

                return;

            }


            try {

                // ==========================================
                // REGISTRATION
                // ==========================================

                if (
                    await handleRegistration(ctx)
                ) {

                    return;

                }


                // ==========================================
                // ACTIVE SESSION
                //
                // IMPORTANT:
                //
                // Active multi-step sessions MUST be
                // processed before menu handlers.
                //
                // Otherwise another handler can consume
                // values such as:
                //
                // 1
                // 2
                // 3
                // 50000
                //
                // before the active flow receives them.
                // ==========================================

                const session =
                    getSession(
                        telegramId
                    );


                if (session) {

                    switch (
                        session.state
                    ) {


                        // ======================================
                        // BUSINESS SALES
                        // ======================================

                        case STATES.WAITING_FOR_PRODUCT:

                        case STATES.WAITING_FOR_QUANTITY:

                        case STATES.WAITING_FOR_PRICE:

                        case STATES.WAITING_FOR_CUSTOMER:

                        case STATES.WAITING_FOR_PAYMENT_STATUS:

                            return salesFlow(ctx);


                        // ======================================
                        // BUSINESS EXPENSES
                        // ======================================

                        case STATES.WAITING_FOR_EXPENSE_CATEGORY:

                        case STATES.WAITING_FOR_EXPENSE_DESCRIPTION:

                        case STATES.WAITING_FOR_EXPENSE_AMOUNT:

                        case STATES.WAITING_FOR_EXPENSE_NOTE:

                            return expenseFlow(ctx);


                        // ======================================
                        // BUSINESS INCOME
                        // ======================================

                        case STATES.WAITING_FOR_INCOME_SOURCE:

                        case STATES.WAITING_FOR_INCOME_AMOUNT:

                        case STATES.WAITING_FOR_INCOME_NOTE:

                            return incomeFlow(ctx);


                        // ======================================
                        // PERSONAL INCOME
                        // ======================================

                        case STATES.WAITING_FOR_PERSONAL_INCOME_SOURCE:

                        case STATES.WAITING_FOR_PERSONAL_INCOME_AMOUNT:

                        case STATES.WAITING_FOR_PERSONAL_INCOME_NOTE:

                            return personalIncomeFlow(ctx);


                        // ======================================
                        // PERSONAL EXPENSES
                        // ======================================

                        case STATES.WAITING_FOR_PERSONAL_EXPENSE_CATEGORY:

                        case STATES.WAITING_FOR_PERSONAL_EXPENSE_DESCRIPTION:

                        case STATES.WAITING_FOR_PERSONAL_EXPENSE_AMOUNT:

                        case STATES.WAITING_FOR_PERSONAL_EXPENSE_NOTE:

                            return personalExpenseFlow(ctx);


                        // ======================================
                        // PERSONAL DEBTS
                        // ======================================

                        case STATES.WAITING_FOR_PERSONAL_DEBT_NAME:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_AMOUNT:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_DUE_DATE:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_NOTE:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_PAYMENT_DEBT:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_PAYMENT_AMOUNT:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_DEBT:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_FIELD:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_UPDATE_VALUE:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_COMPLETE:

                        case STATES.WAITING_FOR_PERSONAL_DEBT_DELETE:

                            return personalDebtsFlow(ctx);


                        // ======================================
                        // PERSONAL DEBTORS
                        // ======================================

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_NAME:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_AMOUNT:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_NOTE:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_VIEW:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_PAYMENT_DEBT:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_PAYMENT_AMOUNT:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_DEBT:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_FIELD:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_UPDATE_VALUE:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_COMPLETE:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_DELETE:

                        case STATES.WAITING_FOR_PERSONAL_DEBTOR_SUMMARY:

                            return personalDebtorsFlow(ctx);


                        // ======================================
                        // PERSONAL CASH FLOW
                        // ======================================
                        //
                        // Interface-neutral personal cash-flow
                        // flow.
                        //
                        // All input required for cash-flow
                        // processing is handled by the
                        // personalCashFlowFlow.
                        //
                        // ======================================

                        case STATES.WAITING_FOR_PERSONAL_CASH_FLOW:

                            return personalCashFlowFlow(ctx);


                        // ======================================
                        // CUSTOMERS
                        // ======================================

                        case STATES.WAITING_FOR_CUSTOMER_NAME:

                        case STATES.WAITING_FOR_CUSTOMER_PHONE:

                        case STATES.WAITING_FOR_CUSTOMER_EMAIL:

                        case STATES.WAITING_FOR_CUSTOMER_ADDRESS:

                        case STATES.WAITING_FOR_CUSTOMER_SEARCH:

                            return customerFlow(ctx);


                        // ======================================
                        // INVENTORY
                        // ======================================

                        case STATES.WAITING_FOR_INVENTORY_PRODUCT:

                        case STATES.WAITING_FOR_INVENTORY_QUANTITY:

                        case STATES.WAITING_FOR_COST_PRICE:

                        case STATES.WAITING_FOR_SELLING_PRICE:

                            return inventoryFlow(ctx);


                        // ======================================
                        // BUSINESS DEBTORS
                        // ======================================

                        case STATES.WAITING_FOR_PAYMENT_CUSTOMER:

                        case STATES.WAITING_FOR_PAYMENT_AMOUNT:

                            return debtorFlow(ctx);


                        // ======================================
                        // SUPPLIERS
                        // ======================================

                        case STATES.WAITING_FOR_SUPPLIER_NAME:

                        case STATES.WAITING_FOR_SUPPLIER_PHONE:

                        case STATES.WAITING_FOR_SUPPLIER_EMAIL:

                        case STATES.WAITING_FOR_SUPPLIER_ADDRESS:

                            return supplierFlow(ctx);


                        // ======================================
                        // SUPPLIER SEARCH
                        // ======================================

                        case STATES.WAITING_FOR_SUPPLIER_SEARCH:

                            return supplierHandler.handleSearchResult(
                                ctx
                            );


                        // ======================================
                        // CREDITORS
                        // ======================================

                        case STATES.WAITING_FOR_CREDITOR_SUPPLIER:

                        case STATES.WAITING_FOR_CREDITOR_PAYMENT:

                            return creditorFlow(ctx);


                        // ======================================
                        // PURCHASES
                        // ======================================

                        case STATES.WAITING_FOR_PURCHASE_SUPPLIER:

                        case STATES.WAITING_FOR_PURCHASE_PRODUCT:

                        case STATES.WAITING_FOR_PURCHASE_QUANTITY:

                        case STATES.WAITING_FOR_PURCHASE_COST:

                        case STATES.WAITING_FOR_PURCHASE_PAID:

                            return purchaseFlow(ctx);


                        // ======================================
                        // UNKNOWN SESSION
                        // ======================================

                        default:

                            console.warn(
                                "Unknown session state:",
                                session.state
                            );

                            return;

                    }

                }


                // ==========================================
                // MAIN MENU
                // ==========================================

                if (
                    await menuHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // PERSONAL MENU
                // ==========================================

                if (
                    await personalHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // CUSTOMER MENU
                // ==========================================

                if (
                    await customerHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // INVENTORY MENU
                // ==========================================

                if (
                    await inventoryHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // REPORT MENU
                // ==========================================

                if (
                    await reportHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // FORECAST
                // ==========================================

                if (
                    await forecastHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // BUSINESS MENU
                // ==========================================

                if (
                    await businessHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // AI CHAT
                // ==========================================

                if (
                    await aiHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // ANALYTICS
                // ==========================================

                if (
                    await analyticsHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // BUSINESS DEBTORS
                // ==========================================

                if (
                    await debtorHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // SUPPLIERS
                // ==========================================

                if (
                    await supplierHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // CREDITORS
                // ==========================================

                if (
                    await creditorHandler(ctx)
                ) {

                    return;

                }


                // ==========================================
                // PURCHASES
                // ==========================================

                if (
                    await purchaseHandler(ctx)
                ) {

                    return;

                }


            }

            catch (error) {

                console.error(
                    "Router error:",
                    error
                );

            }

        }
    );

};