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

const session =
    getSession(ctx.from.id);

if (!session) {
    return;
}

const text =
    (ctx.message.text || "").trim();


// ==================================================
// EXPENSE CATEGORY
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_EXPENSE_CATEGORY
) {

    if (!text) {
        return;
    }

    setSession(
        ctx.from.id,
        {
            ...session,

            state:
                STATES.WAITING_FOR_EXPENSE_DESCRIPTION,

            category:
                text
        }
    );

    await ctx.reply(
        "📝 Enter a description for this expense:"
    );

    return;
}


// ==================================================
// EXPENSE DESCRIPTION
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_EXPENSE_DESCRIPTION
) {

    if (!text) {
        await ctx.reply(
            "❌ Please enter an expense description."
        );

        return;
    }

    setSession(
        ctx.from.id,
        {
            ...session,

            state:
                STATES.WAITING_FOR_EXPENSE_AMOUNT,

            description:
                text
        }
    );

    await ctx.reply(
        "💸 Enter the expense amount:"
    );

    return;
}


// ==================================================
// EXPENSE AMOUNT
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_EXPENSE_AMOUNT
) {

    const amount =
        Number(
            text.replace(/,/g, "")
        );

    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        await ctx.reply(
            "❌ Please enter a valid amount.\n\nExample: 15000"
        );

        return;
    }

    setSession(
        ctx.from.id,
        {
            ...session,

            state:
                STATES.WAITING_FOR_EXPENSE_NOTE,

            amount
        }
    );

    await ctx.reply(
        "📝 Add a note for this expense, or type NONE:"
    );

    return;
}


// ==================================================
// EXPENSE NOTE
// ==================================================

if (
    session.state ===
    STATES.WAITING_FOR_EXPENSE_NOTE
) {

    const note =
        text.toUpperCase() === "NONE"
            ? ""
            : text;


    // ==============================================
    // SAVE EXPENSE
    // ==============================================

    try {

        await saveExpense(
            ctx.from.id,
            {
                category:
                    session.category,

                description:
                    session.description,

                amount:
                    session.amount,

                note
            }
        );

    } catch (error) {

        console.error(
            "Expense save error:",
            error
        );

        await ctx.reply(
            "❌ I couldn't save this expense right now. Please try again."
        );

        return;
    }


    // ==============================================
    // TODAY'S EXPENSE TOTAL
    // ==============================================

    let todayExpenses = 0;

    try {

        todayExpenses =
            Number(
                await getTodayExpenses(
                    ctx.from.id
                )
            ) || 0;

    } catch (error) {

        console.error(
            "Today's expense error:",
            error
        );

    }


    // ==============================================
    // SUCCESS
    // ==============================================

    await ctx.reply(

        `✅ Expense Recorded

━━━━━━━━━━━━━━━━━━

📂 Category: ${session.category}

📝 Description: ${session.description}

💸 Amount: ₦${Number(
session.amount
).toLocaleString()}

🗒️ Note: ${
note || "None"
}

━━━━━━━━━━━━━━━━━━

💸 Today's Expenses:
₦${todayExpenses.toLocaleString()}

💾 Saved Successfully`,

        keyboard

    );


    clearSession(
        ctx.from.id
    );

    return;
}

};