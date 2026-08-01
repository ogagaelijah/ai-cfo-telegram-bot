const { Markup } = require("telegraf");

module.exports = Markup.keyboard([
    ["📦 Record Sale", "💸 Record Expense"],
    ["💰 Record Income", "👥 Customers"],
    ["📒 Debtors", "📦 Inventory"],
    ["📊 Reports", "🤖 Ask AI"],
    ["⚙️ Settings", "❓ Help"]
])
.resize();