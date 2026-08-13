const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

["💰 Transactions", "📊 Business"],

["📊 Reports", "👥 Customers"],

["📦 Inventory", "🧾 Suppliers"],

["🤖 Ask AI"],

["⚙️ Settings"]

]).resize();