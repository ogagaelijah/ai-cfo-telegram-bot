const { buildForecastReport } = require("../services/forecastReportService");

module.exports = async function forecastHandler(ctx) {

    const text = ctx.message.text;

    if (text !== "🔮 Forecast") {

        return false;

    }

    const report =
        buildForecastReport(ctx.from.id);

    await ctx.reply(report);

    return true;

};