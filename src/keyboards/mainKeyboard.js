const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["📦 Record Sale", "💸 Record Expense"],

    ["💰 Record Income", "📥 Purchases"],

    ["👥 Customers", "🏢 Suppliers"],

    ["📒 Debtors", "📕 Creditors"],

    ["📦 Inventory", "📊 Reports"],

    ["🤖 Ask AI", "⚙️ Settings"],

    ["❓ Help"]

]).resize();