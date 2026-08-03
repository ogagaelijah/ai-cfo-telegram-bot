const reportFlow = require("../flows/reportFlow");

/**
 * Handles Report Menu
 * Returns true if handled.
 */
module.exports = async function reportHandler(ctx) {

    const text = ctx.message.text;

    // ==========================
    // REPORTS
    // ==========================
    if (text === "📊 Reports") {

        await reportFlow(ctx);

        return true;

    }

    return false;

};