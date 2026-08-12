const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["💰 Transactions", "📊 Business"],

    ["📊 Reports", "👥 Customers"],

    ["📦 Inventory", "🧾 Suppliers"],

    ["💳 Finance", "🤖 Ask AI"],

    ["⚙️ Settings"]

]).resize();