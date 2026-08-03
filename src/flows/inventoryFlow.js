const keyboard = require("../keyboards/mainKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    addStock
} = require("../services/inventoryService");

module.exports = async function inventoryFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // PRODUCT NAME
        // ==========================
        case STATES.WAITING_FOR_INVENTORY_PRODUCT:

            session.productName = ctx.message.text.trim();

            session.state =
                STATES.WAITING_FOR_INVENTORY_QUANTITY;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "📦 Enter the quantity to add."
            );

        // ==========================
        // QUANTITY
        // ==========================
        case STATES.WAITING_FOR_INVENTORY_QUANTITY:

            session.quantity = Number(ctx.message.text);

            if (
                isNaN(session.quantity) ||
                session.quantity <= 0
            ) {

                return ctx.reply(
                    "❌ Please enter a valid quantity."
                );

            }

            session.state =
                STATES.WAITING_FOR_COST_PRICE;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "💰 Enter the cost price."
            );

        // ==========================
        // COST PRICE
        // ==========================
        case STATES.WAITING_FOR_COST_PRICE:

            session.costPrice = Number(ctx.message.text);

            if (
                isNaN(session.costPrice) ||
                session.costPrice < 0
            ) {

                return ctx.reply(
                    "❌ Enter a valid cost price."
                );

            }

            session.state =
                STATES.WAITING_FOR_SELLING_PRICE;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "💵 Enter the selling price."
            );

        // ==========================
        // SELLING PRICE
        // ==========================
        case STATES.WAITING_FOR_SELLING_PRICE:

            session.sellingPrice = Number(ctx.message.text);

            if (
                isNaN(session.sellingPrice) ||
                session.sellingPrice <= 0
            ) {

                return ctx.reply(
                    "❌ Enter a valid selling price."
                );

            }

            addStock(

                ctx.from.id,

                {

                    productName: session.productName,

                    quantity: session.quantity,

                    costPrice: session.costPrice,

                    sellingPrice: session.sellingPrice

                }

            );

            await ctx.reply(

`✅ Inventory Updated

📦 Product:
${session.productName}

➕ Quantity Added:
${session.quantity}

💰 Cost Price:
₦${session.costPrice.toLocaleString()}

💵 Selling Price:
₦${session.sellingPrice.toLocaleString()}

Inventory has been updated successfully.`,

                keyboard

            );

            clearSession(ctx.from.id);

            return;

    }

};