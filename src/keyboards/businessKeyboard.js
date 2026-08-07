const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["📋 Executive Brief", "🔮 Forecast"],

    ["📈 Analytics", "📅 Weekly Report"],

    ["📆 Monthly Report"],

    ["⬅️ Back"]

]).resize();