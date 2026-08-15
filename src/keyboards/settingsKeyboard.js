const {
    Markup
} = require("telegraf");


// ======================================================
// SETTINGS KEYBOARD
// ======================================================

module.exports =
    Markup.keyboard([

        [
            "👤 Profile",
            "🔔 Notifications"
        ],

        [
            "🏦 Account",
            "🔄 Switch Account"
        ],

        [
            "⬅️ Back"
        ]

    ])
    .resize();