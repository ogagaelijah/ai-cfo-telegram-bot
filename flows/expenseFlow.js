const keyboard = require("../keyboards/mainKeyboard");
const expenseKeyboard = require("../keyboards/expenseKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES = require("../constants/states");

const {
    saveExpense,
    getTodayExpenses
} = require("../services/expenseService");

module.exports = async function expenseFlow(ctx) {

    const session = getSession(ctx.from.id);

    if (!session) return;

    switch (session.state) {

        // ==========================
        // EXPENSE CATEGORY
        // ==========================
        case STATES.WAITING_FOR_EXPENSE_CATEGORY:

            if (ctx.message.text === "❌ Cancel") {

                clearSession(ctx.from.id);

                return ctx.reply(
                    "❌ Expense recording cancelled.",
                    keyboard
                );

            }

            session.category = ctx.message.text;

            session.state = STATES.WAITING_FOR_EXPENSE_DESCRIPTION;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "📝 What was the expense for?"
            );

        // ==========================
        // DESCRIPTION
        // ==========================
        case STATES.WAITING_FOR_EXPENSE_DESCRIPTION:

            session.description = ctx.message.text;

            session.state = STATES.WAITING_FOR_EXPENSE_AMOUNT;

            setSession(ctx.from.id, session);

            return ctx.reply(
                "💵 Enter the expense amount."
            );

        // ==========================
        // AMOUNT
        // ==========================
        case STATES.WAITING_FOR_EXPENSE_AMOUNT:

            session.amount = Number(ctx.message.text);

            if (
                isNaN(session.amount) ||
                session.amount <= 0
            ) {
                return ctx.reply(
                    "❌ Please enter a valid amount."
                );
            }

            session.state = STATES.WAITING_FOR_EXPENSE_NOTE;

            setSession(ctx.from.id, session);

            return ctx.reply(
`📝 Enter a note.

If you don't have one, type:

skip`
            );

        // ==========================
        // NOTE
        // ==========================
        case STATES.WAITING_FOR_EXPENSE_NOTE:

            session.notes =
                ctx.message.text.toLowerCase() === "skip"
                    ? ""
                    : ctx.message.text;

            saveExpense(ctx.from.id, session);

            const todayExpenses = getTodayExpenses(ctx.from.id);

            await ctx.reply(

`✅ Expense Recorded Successfully

📂 Category:
${session.category}

📝 Description:
${session.description}

💵 Amount:
₦${session.amount.toLocaleString()}

📋 Note:
${session.notes || "None"}

━━━━━━━━━━━━━━━━━━

💸 Today's Expenses:
₦${todayExpenses.toLocaleString()}

💾 Saved Successfully`,

                keyboard

            );

            clearSession(ctx.from.id);

            return;

    }

};