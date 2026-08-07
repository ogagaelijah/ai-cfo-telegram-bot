const { buildAnalyticsDashboard } = require("../services/analyticsDashboardBuilder");

module.exports = async function analyticsFlow(ctx) {

    const dashboard =
        buildAnalyticsDashboard(ctx.from.id);

    await ctx.reply(dashboard);

};