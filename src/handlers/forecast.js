const { buildForecastReport } = require("../services/forecastReportService");

module.exports = (bot) => {

    bot.command("forecast", async (ctx) => {

        const report =
            buildForecastReport(ctx.from.id);

        await ctx.reply(report);

    });

};