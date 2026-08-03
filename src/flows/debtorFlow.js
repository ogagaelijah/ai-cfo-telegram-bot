const keyboard = require("../keyboards/mainKeyboard");
const debtorKeyboard = require("../keyboards/debtorKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    receivePayment
} = require("../services/debtorService");

module.exports = async function debtorFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // CUSTOMER NAME
        // ==========================
        case STATES.WAITING_FOR_PAYMENT_CUSTOMER:

            session.customerName = ctx.message.text.trim();

            session.state = STATES.WAITING_FOR_PAYMENT_AMOUNT;

            setSession(ctx.from.id, session);

            return ctx.reply(

                "💵 Enter the amount received."

            );

        // ==========================
        // PAYMENT AMOUNT
        // ==========================
        case STATES.WAITING_FOR_PAYMENT_AMOUNT:

            session.amount = Number(ctx.message.text);

            if (

                isNaN(session.amount) ||

                session.amount <= 0

            ) {

                return ctx.reply(

                    "❌ Please enter a valid amount."

                );

            }

            try {

                const debtor = receivePayment(

                    ctx.from.id,

                    session.customerName,

                    session.amount

                );

                await ctx.reply(

`✅ Payment Recorded Successfully

👤 Customer:
${session.customerName}

💵 Amount Received:
₦${session.amount.toLocaleString()}

🧾 Remaining Balance:
₦${Number(debtor.balance).toLocaleString()}

📊 Status:
${debtor.status}`,

                    debtorKeyboard

                );

            } catch (error) {

                await ctx.reply(

                    `❌ ${error.message}`,

                    debtorKeyboard

                );

            }

            clearSession(ctx.from.id);

            return;

    }

};