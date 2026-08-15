const {
    Markup
} = require("telegraf");


// ======================================================
// SETTINGS — ACCOUNT KEYBOARD
// ======================================================

module.exports =
    Markup.keyboard([

        [
            "🏦 View Account"
        ],

        [
            "✏️ Rename Account"
        ],

        [
            "🔄 Switch Account"
        ],

        [
            "⬅️ Back"
        ]

    ])
    .resize();