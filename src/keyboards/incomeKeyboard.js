const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["💼 Consultancy", "🏦 Bank Interest"],

    ["🏠 Rent", "📈 Investment"],

    ["💵 Commission", "🎁 Gift"],

    ["🔄 Refund", "🧾 Other"],

    ["❌ Cancel"]

])
.resize()
.oneTime();