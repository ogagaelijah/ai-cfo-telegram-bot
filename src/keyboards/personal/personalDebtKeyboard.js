const { Markup } = require("telegraf");

// ======================================================
// PERSONAL DEBT KEYBOARD
// ======================================================
//
// Interface layer only.
//
// This keyboard contains navigation options for the
// Personal Debts module.
//
// Business logic does NOT belong here.
//
// ======================================================

module.exports = Markup.keyboard([

    [
        "➕ Add Debt",
        "📊 View Debts"
    ],

    [
        "💳 Make Payment",
        "📈 Debt Summary"
    ],

    [
        "✏️ Update Debt",
        "✅ Complete Debt"
    ],

    [
        "🗑️ Delete Debt"
    ],

    [
        "⬅️ Back"
    ]

]).resize();