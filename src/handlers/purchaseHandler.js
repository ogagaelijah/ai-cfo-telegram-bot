const purchaseKeyboard = require("../keyboards/purchaseKeyboard");

const {
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    getPurchases
} = require("../services/purchaseService");

module.exports = async function purchaseHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // PURCHASE MENU
    // ==========================
    if (text === "📥 Purchases") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "📥 PURCHASE MANAGEMENT",
            purchaseKeyboard
        );

        return true;

    }

    // ==========================
    // RECORD PURCHASE
    // ==========================
    if (text === "➕ Record Purchase") {

        setSession(ctx.from.id, {
            state: STATES.WAITING_FOR_PURCHASE_SUPPLIER
        });

        await ctx.reply(
            "🏢 Enter supplier name."
        );

        return true;

    }

    // ==========================
    // PURCHASE HISTORY
    // ==========================
    if (text === "📋 Purchase History") {

        const purchases = getPurchases(ctx.from.id);

        if (purchases.length === 0) {

            await ctx.reply(
                "📭 No purchases have been recorded yet.",
                purchaseKeyboard
            );

            return true;

        }

        let message = "📋 PURCHASE HISTORY\n\n";

        purchases.forEach((purchase, index) => {

            message += `${index + 1}.

🏢 ${purchase.supplier_name}

📦 ${purchase.product_name}

🔢 Qty: ${purchase.quantity}

💰 Unit Cost:
₦${Number(purchase.unit_cost).toLocaleString()}

💵 Total:
₦${Number(purchase.total_amount).toLocaleString()}

━━━━━━━━━━━━━━━━━━

`;

        });

        await ctx.reply(
            message,
            purchaseKeyboard
        );

        return true;

    }

    return false;

};