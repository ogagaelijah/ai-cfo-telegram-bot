const {
    Markup
} = require("telegraf");


// ======================================================
// SETTINGS — PROFILE KEYBOARD
// ======================================================

module.exports =
    Markup.keyboard([

        [
            "👤 View Profile"
        ],

        [
            "✏️ Edit Name",
            "📧 Edit Email"
        ],

        [
            "📱 Edit Phone"
        ],

        [
            "⬅️ Back"
        ]

    ])
    .resize();