const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["💰 Transactions", "📊 Business"],

    ["👥 Customers", "📦 Inventory"],

    ["🏢 Suppliers", "💳 Finance"],

    ["🤖 Ask AI", "⚙️ Settings"],

    ["❓ Help"]

]).resize();