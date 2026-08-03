const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["👥 View Debtors"],

    ["💵 Receive Payment"],

    ["📊 Debtors Report"],

    ["⬅️ Back"]

])
.resize();