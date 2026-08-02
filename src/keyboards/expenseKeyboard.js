const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["📦 Stock Purchase", "🚚 Logistics"],

    ["🏢 Rent", "⚡ Utilities"],

    ["👨‍💼 Salaries", "📣 Marketing"],

    ["🍽 Meals", "🛠 Maintenance"],

    ["💻 Software", "📱 Internet"],

    ["🏦 Bank Charges", "📄 Taxes"],

    ["🎁 Miscellaneous", "❌ Cancel"]

])
.resize()
.oneTime();