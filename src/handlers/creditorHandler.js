const creditorKeyboard = require("../keyboards/creditorKeyboard");

const {
    setSession,
    clearSession,
    getSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    getCreditors,
    getOutstandingTotal
} = require("../services/creditorService");

module.exports = async function creditorHandler(ctx) {

    const text = ctx.message.text;

    const session = getSession(ctx.from.id);

    // ==========================
    // CREDITORS MENU
    // ==========================
    if (text === "📕 Creditors") {

        clearSession(ctx.from.id);

        await ctx.reply(
            "📕 CREDITORS MANAGEMENT",
            creditorKeyboard
        );

        return true;

    }

    // ==========================
    // VIEW CREDITORS
    // ==========================
    if (text === "👥 View Creditors") {

        const creditors = getCreditors(ctx.from.id);

        if (creditors.length === 0) {

            await ctx.reply(
                "✅ You have no creditors.",
                creditorKeyboard
            );

            return true;

        }

        let message = "📕 CREDITORS LIST\n\n";

        creditors.forEach((creditor, index) => {

            message += `${index + 1}.

🏢 ${creditor.supplier_name}

💰 Total Debt:
₦${Number(creditor.total_amount).toLocaleString()}

💵 Paid:
₦${Number(creditor.amount_paid).toLocaleString()}

🧾 Balance:
₦${Number(creditor.balance).toLocaleString()}

📊 Status:
${creditor.status}

━━━━━━━━━━━━━━━━━━

`;

        });

        await ctx.reply(
            message,
            creditorKeyboard
        );

        return true;

    }

    // ==========================
    // RECEIVE PAYMENT
    // ==========================
    if (text === "💵 Pay Supplier") {

        setSession(ctx.from.id, {

            state: STATES.WAITING_FOR_CREDITOR_SUPPLIER

        });

        await ctx.reply(
            "🏢 Enter supplier name."
        );

        return true;

    }

    // ==========================
    // CREDITORS REPORT
    // ==========================
    if (text === "📊 Creditors Report") {

        const total = getOutstandingTotal(ctx.from.id);

        await ctx.reply(

`📊 CREDITORS REPORT

💰 Outstanding Credit

₦${Number(total).toLocaleString()}`,

            creditorKeyboard

        );

        return true;

    }

    // ==========================
    // SEARCH SESSION
    // ==========================
    if (
        session &&
        session.state === STATES.WAITING_FOR_CREDITOR_SUPPLIER
    ) {

        return false;

    }

    return false;

};