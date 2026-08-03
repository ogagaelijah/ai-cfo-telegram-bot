const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["👥 View Creditors", "💵 Pay Supplier"],

    ["📊 Creditors Report"],

    ["⬅️ Back"]

])
.resize();