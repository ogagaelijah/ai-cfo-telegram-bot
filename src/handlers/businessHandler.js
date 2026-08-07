const { buildBusinessReport } = require("../services/businessReportService");
const { buildExecutiveBrief } = require("../services/executiveBriefBuilder");
const businessKeyboard = require("../keyboards/businessKeyboard");

module.exports = async function businessHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // EXECUTIVE BRIEF
    // ==========================
    if (text === "📋 Executive Brief") {

        const report =
            buildBusinessReport(ctx.from.id);

        const message =
            buildExecutiveBrief(report);

        await ctx.reply(message);

        return true;

    }

    return false;

};