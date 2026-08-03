const inventoryKeyboard = require("../keyboards/inventoryKeyboard");

const {
    setSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    getInventory,
    getLowStock
} = require("../services/inventoryService");

/**
 * Handles Inventory Menu
 * Returns true if handled.
 */
module.exports = async function inventoryHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // ADD STOCK
    // ==========================
    if (text === "➕ Add Stock") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_INVENTORY_PRODUCT

        });

        await ctx.reply(
            "📦 Enter the product name."
        );

        return true;

    }

    // ==========================
    // VIEW INVENTORY
    // ==========================
    if (text === "📋 View Inventory") {

        const inventory = getInventory(ctx.from.id);

        if (inventory.length === 0) {

            await ctx.reply(

                "📦 Your inventory is empty.",

                inventoryKeyboard

            );

            return true;

        }

        let message = "📦 INVENTORY LIST\n\n";

        inventory.forEach((item, index) => {

            message += `${index + 1}.

📦 ${item.product_name}

📊 Quantity: ${item.quantity}

💰 Cost Price: ₦${Number(item.cost_price).toLocaleString()}

💵 Selling Price: ₦${Number(item.selling_price).toLocaleString()}

━━━━━━━━━━━━━━━━━━

`;

        });

        await ctx.reply(

            message,

            inventoryKeyboard

        );

        return true;

    }

    // ==========================
    // LOW STOCK
    // ==========================
    if (text === "⚠️ Low Stock") {

        const items = getLowStock(ctx.from.id);

        if (items.length === 0) {

            await ctx.reply(

                "✅ Great!\n\nThere are currently no low-stock products.",

                inventoryKeyboard

            );

            return true;

        }

        let message = "⚠️ LOW STOCK ITEMS\n\n";

        items.forEach((item, index) => {

            message += `${index + 1}.

📦 ${item.product_name}

📊 Remaining Stock: ${item.quantity}

💰 Selling Price: ₦${Number(item.selling_price).toLocaleString()}

━━━━━━━━━━━━━━━━━━

`;

        });

        await ctx.reply(

            message,

            inventoryKeyboard

        );

        return true;

    }

    return false;

};