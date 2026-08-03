const keyboard = require("../keyboards/mainKeyboard");
const supplierKeyboard = require("../keyboards/supplierKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    saveSupplier
} = require("../services/supplierService");

module.exports = async function supplierFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // SUPPLIER NAME
        // ==========================
        case STATES.WAITING_FOR_SUPPLIER_NAME:

            session.name = ctx.message.text.trim();

            session.state =
                STATES.WAITING_FOR_SUPPLIER_PHONE;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "📞 Enter supplier phone number.\n\n(Type - if unavailable)"
            );

        // ==========================
        // PHONE
        // ==========================
        case STATES.WAITING_FOR_SUPPLIER_PHONE:

            session.phone = ctx.message.text.trim();

            session.state =
                STATES.WAITING_FOR_SUPPLIER_EMAIL;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "📧 Enter supplier email.\n\n(Type - if unavailable)"
            );

        // ==========================
        // EMAIL
        // ==========================
        case STATES.WAITING_FOR_SUPPLIER_EMAIL:

            session.email = ctx.message.text.trim();

            session.state =
                STATES.WAITING_FOR_SUPPLIER_ADDRESS;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "🏠 Enter supplier address.\n\n(Type - if unavailable)"
            );

        // ==========================
        // ADDRESS
        // ==========================
        case STATES.WAITING_FOR_SUPPLIER_ADDRESS:

            session.address = ctx.message.text.trim();

            saveSupplier(ctx.from.id, {

                name: session.name,

                phone: session.phone === "-" ? "" : session.phone,

                email: session.email === "-" ? "" : session.email,

                address: session.address === "-" ? "" : session.address

            });

            await ctx.reply(

`✅ Supplier Added Successfully

🏢 Supplier:
${session.name}

📞 Phone:
${session.phone === "-" ? "N/A" : session.phone}

📧 Email:
${session.email === "-" ? "N/A" : session.email}

🏠 Address:
${session.address === "-" ? "N/A" : session.address}`,

                supplierKeyboard

            );

            clearSession(ctx.from.id);

            return;

    }

};