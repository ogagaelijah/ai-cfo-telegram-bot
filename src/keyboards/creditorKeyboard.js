const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["📚 Creditors History", "⏳ Outstanding Creditors"],

    ["💵 Pay Supplier", "📊 Creditors Report"],

    ["⬅️ Back"]

])
.resize();