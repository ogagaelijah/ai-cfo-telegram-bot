const {
    Markup
} = require("telegraf");

// ======================================================
// PERSONAL DEBTOR KEYBOARD
// ======================================================

module.exports =
    Markup.keyboard([

        [
            "➕ Add Debtor",
            "📊 View Debtors"
        ],

        [
            "💳 Receive Payment",
            "📈 Debtor Summary"
        ],

        [
            "✏️ Update Debtor",
            "✅ Complete Debtor"
        ],

        [
            "🗑️ Delete Debtor"
        ],

        [
            "⬅️ Back"
        ]

    ])
    .resize();