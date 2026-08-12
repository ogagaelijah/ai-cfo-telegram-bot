const { Markup } = require("telegraf");

module.exports = Markup.keyboard([
    ["📊 Executive Dashboard", "📈 Business Forecast"],
    ["📊 KPI Dashboard", "📉 Business Trends"],
    ["📅 Daily Report", "📆 Weekly Report"],
    ["🗓 Monthly Report", "📑 Executive Report"],
    ["💰 Profit & Loss", "💵 Cash Flow"],
    ["📦 Inventory Report", "👥 Debtors Report"],
    ["🧾 Creditors Report", "🤖 AI Insights"],
    ["📄 Export PDF", "📊 Export Excel"],
    ["⬅️ Back"]
]).resize();