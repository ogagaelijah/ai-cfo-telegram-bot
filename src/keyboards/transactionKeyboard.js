const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["📦 Record Sale", "💸 Record Expense"],

    ["💰 Record Income", "🛒 Purchases"],

    ["⬅️ Back"]

]).resize();