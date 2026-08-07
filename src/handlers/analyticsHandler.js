const analyticsFlow = require("../flows/analyticsFlow");

module.exports = async function analyticsHandler(ctx) {

    const text = ctx.message.text;

    if (text === "📈 Analytics") {

        await analyticsFlow(ctx);

        return true;

    }

    return false;

};