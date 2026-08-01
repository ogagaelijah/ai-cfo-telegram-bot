const keyboard = require("../keyboards/mainKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    saveSale
} = require("../services/salesService");

module.exports = async function salesFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // PRODUCT
        // ==========================
        case STATES.WAITING_FOR_PRODUCT:

            session.product = ctx.message.text;
            session.state = STATES.WAITING_FOR_QUANTITY;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "🔢 How many units did you sell?"
            );

        // ==========================
        // QUANTITY
        // ==========================
        case STATES.WAITING_FOR_QUANTITY:

            session.quantity = Number(ctx.message.text);

            if (
                isNaN(session.quantity) ||
                session.quantity <= 0
            ) {
                return ctx.reply(
                    "❌ Please enter a valid quantity."
                );
            }

            session.state = STATES.WAITING_FOR_PRICE;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "💵 What is the unit price?"
            );

        // ==========================
        // PRICE
        // ==========================
        case STATES.WAITING_FOR_PRICE:

            session.price = Number(ctx.message.text);

            if (
                isNaN(session.price) ||
                session.price <= 0
            ) {
                return ctx.reply(
                    "❌ Please enter a valid amount."
                );
            }

            session.state = STATES.WAITING_FOR_CUSTOMER;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "👤 Customer name?"
            );

        // ==========================
        // CUSTOMER
        // ==========================
        case STATES.WAITING_FOR_CUSTOMER:

            session.customer = ctx.message.text;

            saveSale(ctx.from.id, session);

            const total =
                session.quantity * session.price;

            await ctx.reply(

`✅ Sale Recorded Successfully

📦 Product:
${session.product}

🔢 Quantity:
${session.quantity}

💵 Unit Price:
₦${session.price.toLocaleString()}

👤 Customer:
${session.customer}

━━━━━━━━━━━━━━━━━━

💰 Total Sale:
₦${total.toLocaleString()}`,

                keyboard

            );

            clearSession(ctx.from.id);

            return;

    }

};