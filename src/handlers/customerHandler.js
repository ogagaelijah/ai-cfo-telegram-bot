const customerKeyboard = require("../keyboards/customerKeyboard");

const {
    setSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    getCustomers
} = require("../services/customerService");

/**
 * Handles Customer Menu
 * Returns true if handled.
 */
module.exports = async function customerHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // ADD CUSTOMER
    // ==========================
    if (text === "➕ Add Customer") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_CUSTOMER_NAME

        });

        await ctx.reply(
            "👤 Enter the customer's full name."
        );

        return true;

    }

    // ==========================
    // SEARCH CUSTOMER
    // ==========================
    if (text === "🔍 Search Customer") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_CUSTOMER_SEARCH

        });

        await ctx.reply(
            "🔍 Enter the customer's name or phone number."
        );

        return true;

    }

    // ==========================
    // CUSTOMER LIST
    // ==========================
    if (text === "📋 Customer List") {

        const customers = getCustomers(ctx.from.id);

        if (customers.length === 0) {

            await ctx.reply(

                "No customers have been added yet.",

                customerKeyboard

            );

            return true;

        }

        let message = "👥 CUSTOMER LIST\n\n";

        customers.forEach((customer, index) => {

            message += `${index + 1}.

👤 ${customer.name}

📞 ${customer.phone}

📧 ${customer.email || "N/A"}

🏠 ${customer.address || "N/A"}

━━━━━━━━━━━━━━━━━━

`;

        });

        await ctx.reply(

            message,

            customerKeyboard

        );

        return true;

    }

    return false;

};