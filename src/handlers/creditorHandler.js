const creditorKeyboard = require("../keyboards/creditorKeyboard");

const {
    setSession,
    clearSession,
    getSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    getCreditors,
    getOutstandingCreditors,
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
    // VIEW ALL CREDITORS
    // ==========================
    if (text === "📚 Creditors History") {

        const creditors = getCreditors(ctx.from.id);

        if (creditors.length === 0) {

            await ctx.reply(
                "📭 No creditor history found.",
                creditorKeyboard
            );

            return true;

        }

        let message = "📚 CREDITORS HISTORY\n\n";

        creditors.forEach((creditor, index) => {

            const icon =
                creditor.status === "PAID"
                    ? "🟢"
                    : creditor.status === "PARTIAL"
                    ? "🟡"
                    : "🔴";

            message += `${index + 1}.

🏢 ${creditor.supplier_name}

💰 Total:
₦${Number(creditor.total_amount).toLocaleString()}

💵 Paid:
₦${Number(creditor.amount_paid).toLocaleString()}

📒 Balance:
₦${Number(creditor.balance).toLocaleString()}

${icon} ${creditor.status}

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
    // OUTSTANDING CREDITORS
    // ==========================
    if (text === "⏳ Outstanding Creditors") {

        const creditors = getOutstandingCreditors(ctx.from.id);

        if (creditors.length === 0) {

            await ctx.reply(
                "🎉 You have no outstanding creditors.",
                creditorKeyboard
            );

            return true;

        }

        let message = "⏳ OUTSTANDING CREDITORS\n\n";

        creditors.forEach((creditor, index) => {

            message += `${index + 1}.

🏢 ${creditor.supplier_name}

💰 Total:
₦${Number(creditor.total_amount).toLocaleString()}

💵 Paid:
₦${Number(creditor.amount_paid).toLocaleString()}

📒 Balance:
₦${Number(creditor.balance).toLocaleString()}

🟡 ${creditor.status}

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
    // PAY SUPPLIER
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
    // PAYMENT SESSION
    // ==========================
    if (
        session &&
        session.state === STATES.WAITING_FOR_CREDITOR_SUPPLIER
    ) {

        return false;

    }

    return false;

};