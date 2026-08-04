const reportKeyboard = require("../keyboards/reportKeyboard");

const reportFlow = require("../flows/reportFlow");

module.exports = async function reportHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // REPORT MENU
    // ==========================
    if (text === "📊 Reports") {

        await ctx.reply(
            "📊 REPORTS CENTER",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // DASHBOARD
    // ==========================
    if (text === "📈 Dashboard") {

        await reportFlow(ctx);

        return true;

    }

    // ==========================
    // DAILY REPORT
    // ==========================
    if (text === "📅 Daily Report") {

        await ctx.reply(
            "🚧 Daily Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // WEEKLY REPORT
    // ==========================
    if (text === "📆 Weekly Report") {

        await ctx.reply(
            "🚧 Weekly Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // MONTHLY REPORT
    // ==========================
    if (text === "🗓 Monthly Report") {

        await ctx.reply(
            "🚧 Monthly Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // PROFIT & LOSS
    // ==========================
    if (text === "💰 Profit & Loss") {

        await ctx.reply(
            "🚧 Profit & Loss Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // CASH FLOW
    // ==========================
    if (text === "💵 Cash Flow") {

        await ctx.reply(
            "🚧 Cash Flow Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // INVENTORY REPORT
    // ==========================
    if (text === "📦 Inventory Report") {

        await ctx.reply(
            "🚧 Inventory Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // DEBTORS REPORT
    // ==========================
    if (text === "👥 Debtors Report") {

        await ctx.reply(
            "🚧 Debtors Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // CREDITORS REPORT
    // ==========================
    if (text === "🏢 Creditors Report") {

        await ctx.reply(
            "🚧 Creditors Report is coming soon.",
            reportKeyboard
        );

        return true;

    }

    // ==========================
    // AI INSIGHTS
    // ==========================
    if (text === "🤖 AI Insights") {

        await ctx.reply(
            "🚧 AI Insights is coming soon.",
            reportKeyboard
        );

        return true;

    }

    return false;

};