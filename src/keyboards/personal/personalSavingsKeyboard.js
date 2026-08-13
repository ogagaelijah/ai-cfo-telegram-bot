const { Markup } = require("telegraf");


// ======================================================
// PERSONAL SAVINGS KEYBOARD
// ======================================================

module.exports = Markup.keyboard([

    [
        "🎯 Create Savings Goal",
        "📊 View Savings"
    ],

    [
        "➕ Add Savings"
    ],

    [
        "✅ Complete Goal",
        "🗑️ Delete Goal"
    ],

    [
        "⬅️ Back"
    ]

])
    .resize()
    .persistent();