const businessKeyboard =
    require("../keyboards/businessKeyboard");

const incomeKeyboard =
    require("../keyboards/incomeKeyboard");

const {
    getSession,
    setSession,
    clearSession
} = require("../states/sessionManager");

const STATES =
    require("../constants/states");

const {
    saveIncome,
    getTodayIncome
} = require("../services/incomeService");

module.exports = async function incomeFlow(ctx) {

    const session =
        getSession(ctx.from.id);

    if (!session) {
        return;
    }

    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";

    // ==================================================
    // BACK TO BUSINESS
    // ==================================================

    if (
        text === "⬅️ Back to Business" ||
        text === "⬅️ Back"
    ) {

        clearSession(ctx.from.id);

        await ctx.reply(
            "📊 BUSINESS CENTER",
            businessKeyboard
        );

        return;
    }

    // ==================================================
    // BUSINESS INCOME SOURCE
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_INCOME_SOURCE
    ) {

        if (!text) {

            await ctx.reply(
                "Please select an income source.",
                incomeKeyboard
            );

            return;
        }

        session.source = text;

        session.state =
            STATES.WAITING_FOR_INCOME_AMOUNT;

        setSession(
            ctx.from.id,
            session
        );

        await ctx.reply(
            `💰 Income Source: ${session.source}\n\n` +
            "💵 Enter the amount:"
        );

        return;
    }

    // ==================================================
    // BUSINESS INCOME AMOUNT
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_INCOME_AMOUNT
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
                "⚠️ Please enter a valid amount greater than zero."
            );

            return;
        }

        session.amount = amount;

        session.state =
            STATES.WAITING_FOR_INCOME_NOTE;

        setSession(
            ctx.from.id,
            session
        );

        await ctx.reply(
            "📝 Enter a note for this income, or type NONE:"
        );

        return;
    }

    // ==================================================
    // BUSINESS INCOME NOTE
    // ==================================================

    if (
        session.state ===
        STATES.WAITING_FOR_INCOME_NOTE
    ) {

        const note =
            text.toLowerCase() === "none"
                ? ""
                : text;

        try {

            saveIncome(
                ctx.from.id,
                {
                    source:
                        session.source,

                    amount:
                        session.amount,

                    notes:
                        note
                }
            );

            const todayIncome =
                getTodayIncome(
                    ctx.from.id
                );

            clearSession(
                ctx.from.id
            );

            await ctx.reply(

                `💰 BUSINESS INCOME\n\n` +

                `📌 Source: ${session.source}\n` +

                `💵 Amount: ₦${Number(
                    session.amount
                ).toLocaleString()}\n\n` +

                `━━━━━━━━━━━━━━━━━━\n` +

                `💰 Today's Business Income:\n` +

                `₦${Number(
                    todayIncome
                ).toLocaleString()}\n\n` +

                `✅ Saved Successfully`,

                businessKeyboard
            );

            return;

        } catch (error) {

            console.error(
                "Business income save error:",
                error
            );

            clearSession(
                ctx.from.id
            );

            await ctx.reply(
                "❌ I couldn't save this income. Please try again.",
                businessKeyboard
            );

            return;
        }
    }
};