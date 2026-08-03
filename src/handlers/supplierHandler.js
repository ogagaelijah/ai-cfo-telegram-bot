const supplierKeyboard = require("../keyboards/supplierKeyboard");

const {
    setSession,
    clearSession,
    getSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    getSuppliers,
    searchSuppliers
} = require("../services/supplierService");

module.exports = async function supplierHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // SUPPLIERS MENU
    // ==========================
    if (text === "🏢 Suppliers") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "🏢 SUPPLIER MANAGEMENT",
            supplierKeyboard
        );

        return true;

    }

    // ==========================
    // ADD SUPPLIER
    // ==========================
    if (text === "➕ Add Supplier") {

        setSession(ctx.from.id, {
            state: STATES.WAITING_FOR_SUPPLIER_NAME
        });

        await ctx.reply(
            "🏢 Enter supplier name."
        );

        return true;

    }

    // ==========================
    // SUPPLIER LIST
    // ==========================
    if (text === "📋 Supplier List") {

        const suppliers = getSuppliers(ctx.from.id);

        if (suppliers.length === 0) {

            await ctx.reply(
                "No suppliers have been added yet.",
                supplierKeyboard
            );

            return true;

        }

        let message = "🏢 SUPPLIER LIST\n\n";

        suppliers.forEach((supplier, index) => {

            message += `${index + 1}.

🏢 ${supplier.name}

📞 ${supplier.phone || "N/A"}

📧 ${supplier.email || "N/A"}

🏠 ${supplier.address || "N/A"}

━━━━━━━━━━━━━━━━━━

`;

        });

        await ctx.reply(
            message,
            supplierKeyboard
        );

        return true;

    }

    // ==========================
    // SEARCH SUPPLIER
    // ==========================
    if (text === "🔍 Search Supplier") {

        setSession(ctx.from.id, {
            state: STATES.WAITING_FOR_SUPPLIER_SEARCH
        });

        await ctx.reply(
            "🔍 Enter supplier name or phone number."
        );

        return true;

    }

    // ==========================
    // SEARCH RESULT
    // ==========================
    const session = getSession(ctx.from.id);

    if (
        session &&
        session.state === STATES.WAITING_FOR_SUPPLIER_SEARCH
    ) {

        const suppliers = searchSuppliers(
            ctx.from.id,
            text.trim()
        );

        clearSession(ctx.from.id);

        if (suppliers.length === 0) {

            await ctx.reply(
                "No supplier found.",
                supplierKeyboard
            );

            return true;

        }

        let message = "🔍 SEARCH RESULTS\n\n";

        suppliers.forEach((supplier, index) => {

            message += `${index + 1}.

🏢 ${supplier.name}

📞 ${supplier.phone || "N/A"}

📧 ${supplier.email || "N/A"}

🏠 ${supplier.address || "N/A"}

━━━━━━━━━━━━━━━━━━

`;

        });

        await ctx.reply(
            message,
            supplierKeyboard
        );

        return true;

    }

    return false;

};