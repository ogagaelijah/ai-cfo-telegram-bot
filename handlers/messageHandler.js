const keyboard = require("../keyboards/mainKeyboard");
const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const { saveSale } = require("../services/salesService");

module.exports = (bot) => {

    // ==========================
    // RECORD SALE
    // ==========================
    bot.hears("📦 Record Sale", async (ctx) => {

        setSession(ctx.from.id, {
            state: "WAITING_FOR_PRODUCT"
        });

        await ctx.reply("📦 What product did you sell?");
    });

    // ==========================
    // HANDLE ALL TEXT MESSAGES
    // ==========================
    bot.on("text", async (ctx, next) => {

        // Ignore /start
        if (ctx.message.text === "/start") {
            return next();
        }

        // Ignore menu buttons
        const buttons = [
            "📦 Record Sale",
            "💸 Record Expense",
            "💰 Record Income",
            "👥 Customers",
            "📒 Debtors",
            "📦 Inventory",
            "📊 Reports",
            "🤖 Ask AI",
            "⚙️ Settings",
            "❓ Help"
        ];

        if (buttons.includes(ctx.message.text)) {
            return next();
        }

        const session = getSession(ctx.from.id);

        // User is not in any workflow
        if (!session) {
            return;
        }

        try {

            switch (session.state) {

                // ==========================
                // PRODUCT
                // ==========================
                case "WAITING_FOR_PRODUCT":

                    session.product = ctx.message.text.trim();
                    session.state = "WAITING_FOR_QUANTITY";

                    setSession(ctx.from.id, session);

                    return ctx.reply("🔢 How many units did you sell?");

                // ==========================
                // QUANTITY
                // ==========================
                case "WAITING_FOR_QUANTITY":

                    session.quantity = Number(ctx.message.text);

                    if (
                        isNaN(session.quantity) ||
                        session.quantity <= 0
                    ) {
                        return ctx.reply(
                            "❌ Please enter a valid quantity."
                        );
                    }

                    session.state = "WAITING_FOR_PRICE";

                    setSession(ctx.from.id, session);

                    return ctx.reply("💵 Price per unit?");

                // ==========================
                // PRICE
                // ==========================
                case "WAITING_FOR_PRICE":

                    session.price = Number(ctx.message.text);

                    if (
                        isNaN(session.price) ||
                        session.price <= 0
                    ) {
                        return ctx.reply(
                            "❌ Please enter a valid price."
                        );
                    }

                    session.state = "WAITING_FOR_CUSTOMER";

                    setSession(ctx.from.id, session);

                    return ctx.reply("👤 Customer name?");

                // ==========================
                // CUSTOMER
                // ==========================
                case "WAITING_FOR_CUSTOMER":

                    session.customer = ctx.message.text.trim();

                    // Save sale to SQLite
                    saveSale(ctx.from.id, session);

                    const total =
                        session.quantity * session.price;

                    await ctx.reply(

`✅ Sale Recorded Successfully

📦 Product: ${session.product}

🔢 Quantity: ${session.quantity}

💵 Unit Price: ₦${session.price.toLocaleString()}

👤 Customer: ${session.customer}

━━━━━━━━━━━━━━━━━━

💰 Total Sale: ₦${total.toLocaleString()}

💾 Saved to AI CFO Database`,

                        keyboard

                    );

                    clearSession(ctx.from.id);

                    return;

                default:

                    clearSession(ctx.from.id);

                    return ctx.reply(
                        "⚠️ Something went wrong. Please start again.",
                        keyboard
                    );

            }

        } catch (error) {

            console.error(error);

            clearSession(ctx.from.id);

            return ctx.reply(

`❌ An unexpected error occurred.

Please try again.`,

                keyboard

            );

        }

    });

};