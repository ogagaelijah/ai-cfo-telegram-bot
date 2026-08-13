const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

["💰 Income", "💸 Expenses"],

["💵 Savings", "📋 Debts"],

["👥 Debtors", "🎯 Personal Goals"],

["💧 Cash Flow", "📊 Financial Reports"],

["🔮 Forecast", "🤖 AI Financial Advisor"],

["⚙️ Settings"]

]).resize();