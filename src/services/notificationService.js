const telegramService = require("./telegramService");

const {
    buildBusinessReport
} = require("./businessReportService");

const {
    formatMorningBrief
} = require("./reportFormatterService");

// ==========================
// SEND MORNING BRIEF
// ==========================
async function sendMorningBrief(user) {

    const report =
        buildBusinessReport(user.telegram_id);

    const message =
        formatMorningBrief(report);

    await telegramService.sendMessage(

        user.telegram_id,

        message

    );

}

module.exports = {

    sendMorningBrief

};