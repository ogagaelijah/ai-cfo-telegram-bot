const keyboard = require("../keyboards/mainKeyboard");
const creditorKeyboard = require("../keyboards/creditorKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    findSupplierByName
} = require("../services/supplierService");

const {
    recordPayment
} = require("../services/creditorService");

module.exports = async function creditorFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // SUPPLIER NAME
        // ==========================
        case STATES.WAITING_FOR_CREDITOR_SUPPLIER: {

            const supplierName = ctx.message.text.trim();

            const supplier = findSupplierByName(
                ctx.from.id,
                supplierName
            );

            if (!supplier) {

                return ctx.reply(
                    "❌ Supplier not found.\n\nPlease enter a valid supplier name."
                );

            }

            session.supplier = supplier.name;

            session.state =
                STATES.WAITING_FOR_CREDITOR_PAYMENT;

            setSession(ctx.from.id, session);

            return ctx.reply(
                `🏢 Supplier: ${supplier.name}\n\n💵 Enter payment amount.`
            );

        }

        // ==========================
        // PAYMENT
        // ==========================
        case STATES.WAITING_FOR_CREDITOR_PAYMENT: {

            const payment = Number(ctx.message.text);

            if (isNaN(payment) || payment <= 0) {

                return ctx.reply(
                    "❌ Please enter a valid payment amount."
                );

            }

            try {

                const creditor = recordPayment(

                    ctx.from.id,

                    session.supplier,

                    payment

                );

                await ctx.reply(

`✅ Payment Recorded Successfully

🏢 Supplier:
${session.supplier}

💵 Payment:
₦${payment.toLocaleString()}

💰 Total Paid:
₦${Number(creditor.amount_paid).toLocaleString()}

🧾 Balance:
₦${Number(creditor.balance).toLocaleString()}

📊 Status:
${creditor.status}`,

                    creditorKeyboard

                );

            } catch (error) {

                await ctx.reply(

                    `❌ ${error.message}`,

                    keyboard

                );

            }

            clearSession(ctx.from.id);

            return;

        }

    }

};