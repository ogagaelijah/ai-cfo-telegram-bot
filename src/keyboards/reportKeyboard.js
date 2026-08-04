const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["📈 Dashboard", "📅 Daily Report"],

    ["📆 Weekly Report", "🗓 Monthly Report"],

    ["💰 Profit & Loss", "💵 Cash Flow"],

    ["📦 Inventory Report", "👥 Debtors Report"],

    ["🏢 Creditors Report", "🤖 AI Insights"],

    ["⬅️ Back"]

]).resize();