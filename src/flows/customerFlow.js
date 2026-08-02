const keyboard = require("../keyboards/mainKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    saveCustomer,
    searchCustomers,
    getCustomers
} = require("../services/customerService");

module.exports = async function customerFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // CUSTOMER NAME
        // ==========================
        case STATES.WAITING_FOR_CUSTOMER_NAME:

            session.name = ctx.message.text;

            session.state = STATES.WAITING_FOR_CUSTOMER_PHONE;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "📞 Enter the customer's phone number."
            );

        // ==========================
        // PHONE
        // ==========================
        case STATES.WAITING_FOR_CUSTOMER_PHONE:

            session.phone = ctx.message.text;

            session.state = STATES.WAITING_FOR_CUSTOMER_EMAIL;

            setSession(ctx.from.id, session);

            return ctx.reply(

`📧 Enter the customer's email.

If unavailable, type:

skip`

            );

        // ==========================
        // EMAIL
        // ==========================
        case STATES.WAITING_FOR_CUSTOMER_EMAIL:

            session.email =
                ctx.message.text.toLowerCase() === "skip"
                    ? ""
                    : ctx.message.text;

            session.state = STATES.WAITING_FOR_CUSTOMER_ADDRESS;

            setSession(ctx.from.id, session);

            return ctx.reply(

`🏠 Enter the customer's address.

If unavailable, type:

skip`

            );

        // ==========================
        // ADDRESS
        // ==========================
        case STATES.WAITING_FOR_CUSTOMER_ADDRESS:

            session.address =
                ctx.message.text.toLowerCase() === "skip"
                    ? ""
                    : ctx.message.text;

            saveCustomer(ctx.from.id, session);

            await ctx.reply(

`✅ Customer Saved Successfully

👤 Name:
${session.name}

📞 Phone:
${session.phone}

📧 Email:
${session.email || "Not provided"}

🏠 Address:
${session.address || "Not provided"}

💾 Customer added successfully.`,

                keyboard

            );

            clearSession(ctx.from.id);

            return;

        // ==========================
        // SEARCH
        // ==========================
        case STATES.WAITING_FOR_CUSTOMER_SEARCH:

            const customers = searchCustomers(
                ctx.from.id,
                ctx.message.text
            );

            if (customers.length === 0) {

                clearSession(ctx.from.id);

                return ctx.reply(
                    "❌ No customer found.",
                    keyboard
                );

            }

            let result = "👥 CUSTOMER SEARCH RESULTS\n\n";

            customers.forEach((customer, index) => {

                result += `${index + 1}.

👤 ${customer.name}

📞 ${customer.phone}

📧 ${customer.email || "N/A"}

🏠 ${customer.address || "N/A"}

━━━━━━━━━━━━━━━━━━

`;

            });

            clearSession(ctx.from.id);

            return ctx.reply(
                result,
                keyboard
            );

    }

};