const {
    Markup
} = require("telegraf");


// ======================================================
// SETTINGS — NOTIFICATIONS KEYBOARD
// ======================================================

module.exports =
    Markup.keyboard([

        [
            "🌅 Morning Brief",
            "🌙 Evening Report"
        ],

        [
            "📅 Weekly Report",
            "🗓️ Monthly Report"
        ],

        [
            "⏰ Notification Time"
        ],

        [
            "🌍 Timezone"
        ],

        [
            "⬅️ Back"
        ]

    ])
    .resize();