const {
    buildForecastReport
} = require("../services/forecastReportService");

const keyboard =
    require("../keyboards/reportKeyboard");

module.exports = async function forecastFlow(ctx) {

    const report =
        buildForecastReport(
            ctx.from.id
        );

    await ctx.reply(
        report,
        keyboard
    );

};