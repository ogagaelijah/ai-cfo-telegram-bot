const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const purchaseKeyboard = require("../keyboards/purchaseKeyboard");

const {
    recordPurchase
} = require("../services/purchaseService");

module.exports = async function purchaseFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // SUPPLIER
        // ==========================
        case STATES.WAITING_FOR_PURCHASE_SUPPLIER:

            session.supplier = ctx.message.text.trim();

            session.state =
                STATES.WAITING_FOR_PURCHASE_PRODUCT;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "📦 Enter product name."
            );

        // ==========================
        // PRODUCT
        // ==========================
        case STATES.WAITING_FOR_PURCHASE_PRODUCT:

            session.product = ctx.message.text.trim();

            session.state =
                STATES.WAITING_FOR_PURCHASE_QUANTITY;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "🔢 Enter quantity purchased."
            );

        // ==========================
        // QUANTITY
        // ==========================
        case STATES.WAITING_FOR_PURCHASE_QUANTITY:

            session.quantity = Number(ctx.message.text);

            if (
                isNaN(session.quantity) ||
                session.quantity <= 0
            ) {
                return ctx.reply(
                    "❌ Enter a valid quantity."
                );
            }

            session.state =
                STATES.WAITING_FOR_PURCHASE_COST;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "💰 Enter unit cost price."
            );

        // ==========================
        // UNIT COST
        // ==========================
        case STATES.WAITING_FOR_PURCHASE_COST:

            session.costPrice = Number(ctx.message.text);

            if (
                isNaN(session.costPrice) ||
                session.costPrice <= 0
            ) {
                return ctx.reply(
                    "❌ Enter a valid cost price."
                );
            }

            session.total =
                session.quantity *
                session.costPrice;

            session.state =
                STATES.WAITING_FOR_PURCHASE_PAID;

            setSession(ctx.from.id, session);

            return ctx.reply(

`🧾 Purchase Total

₦${session.total.toLocaleString()}

💵 How much did you pay now?`

            );

        // ==========================
        // AMOUNT PAID
        // ==========================
        case STATES.WAITING_FOR_PURCHASE_PAID:

            session.amountPaid = Number(ctx.message.text);

            if (
                isNaN(session.amountPaid) ||
                session.amountPaid < 0
            ) {

                return ctx.reply(
                    "❌ Enter a valid amount."
                );

            }

            if (session.amountPaid > session.total) {

                return ctx.reply(
                    "❌ Amount paid cannot exceed total purchase amount."
                );

            }

            try {

                const balance =
                    session.total -
                    session.amountPaid;

                const paymentStatus =
                    balance === 0
                        ? "PAID"
                        : session.amountPaid === 0
                        ? "UNPAID"
                        : "PARTIAL";

                recordPurchase(ctx.from.id, {

                    supplierName: session.supplier,

                    productName: session.product,

                    quantity: session.quantity,

                    unitCost: session.costPrice,

                    totalAmount: session.total,

                    paymentStatus,

                    amountPaid: session.amountPaid,

                    balance

                });

                await ctx.reply(

`✅ Purchase Recorded Successfully

🏢 Supplier:
${session.supplier}

📦 Product:
${session.product}

🔢 Quantity:
${session.quantity}

💰 Unit Cost:
₦${session.costPrice.toLocaleString()}

🧾 Total:
₦${session.total.toLocaleString()}

💵 Paid:
₦${session.amountPaid.toLocaleString()}

📒 Balance:
₦${balance.toLocaleString()}

📊 Status:
${paymentStatus}`,

                    purchaseKeyboard

                );

            } catch (err) {

                await ctx.reply(
                    `❌ ${err.message}`
                );

            }

            clearSession(ctx.from.id);

            return;

    }

};