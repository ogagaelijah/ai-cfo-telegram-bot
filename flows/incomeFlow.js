const keyboard = require("../keyboards/mainKeyboard");
const incomeKeyboard = require("../keyboards/incomeKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    saveIncome,
    getTodayIncome
} = require("../services/incomeService");

module.exports = async function incomeFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // SOURCE
        // ==========================
        case STATES.WAITING_FOR_INCOME_SOURCE:

            if (ctx.message.text === "❌ Cancel") {

                clearSession(ctx.from.id);

                return ctx.reply(
                    "❌ Income recording cancelled.",
                    keyboard
                );

            }

            session.source = ctx.message.text;

            session.state = STATES.WAITING_FOR_INCOME_AMOUNT;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "💵 Enter the income amount."
            );

        // ==========================
        // AMOUNT
        // ==========================
        case STATES.WAITING_FOR_INCOME_AMOUNT:

            session.amount = Number(ctx.message.text);

            if (
                isNaN(session.amount) ||
                session.amount <= 0
            ) {
                return ctx.reply(
                    "❌ Please enter a valid amount."
                );
            }

            session.state = STATES.WAITING_FOR_INCOME_NOTE;

            setSession(ctx.from.id, session);

            return ctx.reply(
`📝 Enter a note.

If you don't have one, type:

skip`
            );

        // ==========================
        // NOTE
        // ==========================
        case STATES.WAITING_FOR_INCOME_NOTE:

            session.notes =
                ctx.message.text.toLowerCase() === "skip"
                    ? ""
                    : ctx.message.text;

            saveIncome(ctx.from.id, session);

            const todayIncome = getTodayIncome(ctx.from.id);

            await ctx.reply(

`✅ Income Recorded Successfully

💰 Source:
${session.source}

💵 Amount:
₦${session.amount.toLocaleString()}

📝 Note:
${session.notes || "None"}

━━━━━━━━━━━━━━━━━━

💰 Today's Other Income:
₦${todayIncome.toLocaleString()}

💾 Saved Successfully`,

                keyboard

            );

            clearSession(ctx.from.id);

            return;

    }

};