const debtorKeyboard = require("../keyboards/debtorKeyboard");

const {
    getSession,
    setSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    getDebtors,
    getOutstandingTotal
} = require("../services/debtorService");

module.exports = async function debtorHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // DEBTORS MENU
    // ==========================
    if (text === "📒 Debtors") {

        return ctx.reply(

            "📒 DEBTORS MANAGEMENT",

            debtorKeyboard

        );

    }

    // ==========================
    // VIEW DEBTORS
    // ==========================
    if (text === "👥 View Debtors") {

        const debtors = getDebtors(ctx.from.id);

        if (debtors.length === 0) {

            return ctx.reply(

                "✅ You have no outstanding debtors.",

                debtorKeyboard

            );

        }

        let message = "📒 DEBTORS LIST\n\n";

        debtors.forEach((debtor, index) => {

            message += `${index + 1}.

👤 ${debtor.customer_name}

📦 Product:
${debtor.item}

🔢 Quantity:
${debtor.quantity}

💰 Total Debt:
₦${Number(debtor.total_amount).toLocaleString()}

💵 Paid:
₦${Number(debtor.amount_paid).toLocaleString()}

🧾 Balance:
₦${Number(debtor.balance).toLocaleString()}

📊 Status:
${debtor.status}

━━━━━━━━━━━━━━━━━━

`;

        });

        return ctx.reply(

            message,

            debtorKeyboard

        );

    }

    // ==========================
    // RECEIVE PAYMENT
    // ==========================
    if (text === "💵 Receive Payment") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_PAYMENT_CUSTOMER

        });

        return ctx.reply(

            "👤 Enter the customer's name."

        );

    }

    // ==========================
    // DEBTORS REPORT
    // ==========================
    if (text === "📊 Debtors Report") {

        const total = getOutstandingTotal(ctx.from.id);

        return ctx.reply(

`📊 DEBTORS REPORT

💰 Outstanding Debt

₦${Number(total).toLocaleString()}`,

            debtorKeyboard

        );

    }

    return false;

};