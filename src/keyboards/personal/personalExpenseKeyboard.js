const { Markup } = require("telegraf");

module.exports = Markup.keyboard([

    ["🍔 Food", "🏠 Housing"],

    ["🚗 Transportation", "🏥 Healthcare"],

    ["🛍️ Shopping", "🎓 Education"],

    ["💡 Utilities", "🎉 Entertainment"],

    ["👕 Personal Care", "📱 Communication"],

    ["💳 Debt Payment", "📦 Other"],

    ["⬅️ Back to Personal Finance"]

]).resize();