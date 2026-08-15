const {
    clearSession,
    setSession
} = require("../states/sessionManager");

const STATES =
    require("../constants/states");

const accountContext =
    require("../services/accountContext");

const userSettings =
    require("../application/userSettings");

const accountSettings =
    require("../application/accountSettings");

const settingsKeyboard =
    require("../keyboards/settingsKeyboard");

const settingsProfileKeyboard =
    require("../keyboards/settingsProfileKeyboard");

const settingsNotificationKeyboard =
    require("../keyboards/settingsNotificationKeyboard");

const {
    Markup
} = require("telegraf");


// ======================================================
// SETTINGS HANDLER
// ======================================================
//
// Telegram interface adapter for:
//
// USER SETTINGS
// - Profile
// - Notifications
// - Notification time
// - Timezone
//
// ACCOUNT SETTINGS
// - Account information
// - Account name
//
// ACCOUNT SWITCHING
// - Personal accounts
// - Business accounts
//
// IMPORTANT:
//
// This handler does NOT access the database directly.
//
// It communicates with:
//
// Telegram
//    ↓
// Settings Handler
//    ↓
// Application Layer
//    ↓
// Services
//    ↓
// Database
//
// ======================================================


// ======================================================
// HELPERS
// ======================================================

function getInternalUser(
    telegramId
) {

    return accountContext.getUserByTelegramId(
        telegramId
    );

}


function getCurrentAccount(
    telegramId
) {

    return accountContext.getCurrentAccount(
        telegramId
    );

}


// ======================================================
// MAIN SETTINGS MENU
// ======================================================

async function showSettings(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    await ctx.reply(

        "⚙️ SETTINGS\n\n" +
        "Choose what you want to manage below 👇",

        settingsKeyboard

    );

    return true;

}


// ======================================================
// PROFILE
// ======================================================

async function showProfile(
    ctx
) {

    const telegramId =
        ctx.from.id;

    const user =
        getInternalUser(
            telegramId
        );

    if (!user) {

        await ctx.reply(
            "⚠️ Unable to load your profile."
        );

        return true;

    }

    clearSession(
        telegramId
    );

    await ctx.reply(

        "👤 PROFILE\n\n" +

        `Name: ${user.full_name || "Not set"}\n` +

        `Username: ${user.username || "Not set"}\n` +

        `Email: ${user.email || "Not set"}\n` +

        `Phone: ${user.phone || "Not set"}`,

        settingsProfileKeyboard

    );

    return true;

}


// ======================================================
// EDIT NAME
// ======================================================

async function editName(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    setSession(
        telegramId,
        {
            state:
                STATES.WAITING_FOR_SETTINGS_NAME
        }
    );

    await ctx.reply(
        "✏️ EDIT NAME\n\nPlease enter your new full name."
    );

    return true;

}


// ======================================================
// EDIT EMAIL
// ======================================================

async function editEmail(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    setSession(
        telegramId,
        {
            state:
                STATES.WAITING_FOR_SETTINGS_EMAIL
        }
    );

    await ctx.reply(
        "📧 EDIT EMAIL\n\nPlease enter your email address."
    );

    return true;

}


// ======================================================
// EDIT PHONE
// ======================================================

async function editPhone(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    setSession(
        telegramId,
        {
            state:
                STATES.WAITING_FOR_SETTINGS_PHONE
        }
    );

    await ctx.reply(
        "📱 EDIT PHONE\n\nPlease enter your phone number."
    );

    return true;

}


// ======================================================
// NOTIFICATIONS MENU
// ======================================================

async function showNotifications(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    const user =
        getInternalUser(
            telegramId
        );

    if (!user) {

        await ctx.reply(
            "⚠️ Unable to load notification settings."
        );

        return true;

    }

    const settings =
        userSettings.getUserSettings(
            user.id
        );

    if (!settings) {

        await ctx.reply(
            "⚠️ Unable to load notification settings."
        );

        return true;

    }

    await ctx.reply(

        "🔔 NOTIFICATIONS\n\n" +

        `🌅 Morning Brief: ${
            settings.morning_brief_enabled
                ? "ON"
                : "OFF"
        }\n` +

        `🌙 Evening Report: ${
            settings.evening_report_enabled
                ? "ON"
                : "OFF"
        }\n` +

        `📅 Weekly Report: ${
            settings.weekly_report_enabled
                ? "ON"
                : "OFF"
        }\n` +

        `🗓️ Monthly Report: ${
            settings.monthly_report_enabled
                ? "ON"
                : "OFF"
        }\n\n` +

        `⏰ Time: ${
            settings.notification_time || "08:00"
        }\n` +

        `🌐 Timezone: ${
            settings.timezone || "Africa/Lagos"
        }`,

        settingsNotificationKeyboard

    );

    return true;

}


// ======================================================
// TOGGLE NOTIFICATION
// ======================================================

async function toggleNotification(
    ctx,
    field,
    label
) {

    const telegramId =
        ctx.from.id;

    const user =
        getInternalUser(
            telegramId
        );

    if (!user) {

        await ctx.reply(
            "⚠️ Unable to identify your user account."
        );

        return true;

    }

    const settings =
        userSettings.getUserSettings(
            user.id
        );

    if (!settings) {

        await ctx.reply(
            "⚠️ Unable to load your settings."
        );

        return true;

    }

    const currentValue =
        Number(
            settings[field]
        ) === 1;

    const updated =
        userSettings.updateNotificationPreference(
            user.id,
            field,
            !currentValue
        );

    await ctx.reply(

        `${label}\n\n` +

        (
            updated[field]
                ? "✅ Enabled."
                : "🔕 Disabled."
        )

    );

    return true;

}


// ======================================================
// NOTIFICATION TIME
// ======================================================

async function editNotificationTime(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    setSession(
        telegramId,
        {
            state:
                STATES.WAITING_FOR_NOTIFICATION_TIME
        }
    );

    await ctx.reply(

        "⏰ NOTIFICATION TIME\n\n" +
        "Enter the time using 24-hour format.\n\n" +
        "Example: 08:00"

    );

    return true;

}


// ======================================================
// TIMEZONE
// ======================================================

async function editTimezone(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    setSession(
        telegramId,
        {
            state:
                STATES.WAITING_FOR_TIMEZONE
        }
    );

    await ctx.reply(

        "🌐 TIMEZONE\n\n" +
        "Enter your timezone.\n\n" +
        "Example:\n" +
        "Africa/Lagos"

    );

    return true;

}


// ======================================================
// ACCOUNT SETTINGS
// ======================================================

async function showAccount(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    const account =
        getCurrentAccount(
            telegramId
        );

    if (!account) {

        await ctx.reply(
            "⚠️ No current account was found."
        );

        return true;

    }

    const user =
        getInternalUser(
            telegramId
        );

    if (!user) {

        await ctx.reply(
            "⚠️ Unable to identify your user account."
        );

        return true;

    }

    const settings =
        accountSettings.getCurrentAccountSettings(
            user.id
        );

    if (!settings) {

        await ctx.reply(
            "⚠️ Unable to load account settings."
        );

        return true;

    }

    const canRename =
        [
            "OWNER",
            "ADMIN"
        ].includes(
            settings.role
        );

    const keyboard =
        canRename

            ? Markup.keyboard([

                [
                    "✏️ Rename Account"
                ],

                [
                    "⬅️ Back"
                ]

            ])
            .resize()

            : Markup.keyboard([

                [
                    "⬅️ Back"
                ]

            ])
            .resize();

    await ctx.reply(

        "🏢 ACCOUNT SETTINGS\n\n" +

        `Name: ${settings.name}\n` +

        `Type: ${settings.account_type}\n` +

        `Role: ${settings.role}\n` +

        `Owner User ID: ${settings.owner_user_id}`,

        keyboard

    );

    return true;

}


// ======================================================
// RENAME ACCOUNT
// ======================================================

async function renameAccount(
    ctx
) {

    const telegramId =
        ctx.from.id;

    const user =
        getInternalUser(
            telegramId
        );

    if (!user) {

        await ctx.reply(
            "⚠️ Unable to identify your user account."
        );

        return true;

    }

    const account =
        getCurrentAccount(
            telegramId
        );

    if (!account) {

        await ctx.reply(
            "⚠️ No current account was found."
        );

        return true;

    }

    if (
        ![
            "OWNER",
            "ADMIN"
        ].includes(
            account.role
        )
    ) {

        await ctx.reply(
            "⛔ You do not have permission to rename this account."
        );

        return true;

    }

    clearSession(
        telegramId
    );

    setSession(
        telegramId,
        {
            state:
                STATES.WAITING_FOR_ACCOUNT_NAME
        }
    );

    await ctx.reply(
        "✏️ RENAME ACCOUNT\n\nEnter the new account name."
    );

    return true;

}


// ======================================================
// SWITCH ACCOUNT
// ======================================================

async function switchAccount(
    ctx
) {

    const telegramId =
        ctx.from.id;

    const user =
        getInternalUser(
            telegramId
        );

    if (!user) {

        await ctx.reply(
            "⚠️ Unable to identify your user account."
        );

        return true;

    }

    clearSession(
        telegramId
    );

    const accounts =
        accountContext.getUserAccounts(
            user.id
        );

    if (!accounts.length) {

        await ctx.reply(
            "⚠️ You do not have any accounts."
        );

        return true;

    }

    const buttons =
        accounts.map(
            account => [

                `${account.account_type === "PERSONAL"
                    ? "👤"
                    : "🏢"} ${account.name}`

            ]
        );

    buttons.push([
        "⬅️ Back"
    ]);

    await ctx.reply(

        "🔄 SWITCH ACCOUNT\n\n" +
        "Select the account you want to use:",

        Markup.keyboard(
            buttons
        ).resize()

    );

    setSession(
        telegramId,
        {
            state:
                STATES.WAITING_FOR_ACCOUNT_SELECTION
        }
    );

    return true;

}


// ======================================================
// ACCOUNT SELECTION
// ======================================================

async function selectAccount(
    ctx
) {

    const telegramId =
        ctx.from.id;

    const user =
        getInternalUser(
            telegramId
        );

    if (!user) {

        await ctx.reply(
            "⚠️ Unable to identify your user account."
        );

        return true;

    }

    const text =
        ctx.message.text.trim();

    const accounts =
        accountContext.getUserAccounts(
            user.id
        );

    const selected =
        accounts.find(
            account =>
                text ===
                `${account.account_type === "PERSONAL"
                    ? "👤"
                    : "🏢"} ${account.name}`
        );

    if (!selected) {

        await ctx.reply(
            "⚠️ Please select one of the accounts shown."
        );

        return true;

    }

    const account =
        accountContext.setCurrentAccountByUserId(
            user.id,
            selected.id
        );

    clearSession(
        telegramId
    );

    if (!account) {

        await ctx.reply(
            "⚠️ Unable to switch account."
        );

        return true;

    }

    await ctx.reply(

        "✅ ACCOUNT SWITCHED\n\n" +

        `${account.accountType === "PERSONAL"
            ? "👤"
            : "🏢"} ${account.accountName}\n\n` +

        `Type: ${account.accountType}\n` +
        `Role: ${account.role}`

    );

    return true;

}


// ======================================================
// BACK
// ======================================================

async function back(
    ctx
) {

    const telegramId =
        ctx.from.id;

    clearSession(
        telegramId
    );

    await ctx.reply(
        "⚙️ SETTINGS\n\nChoose an option below 👇",
        settingsKeyboard
    );

    return true;

}


// ======================================================
// MAIN HANDLER
// ======================================================

module.exports = async function settingsHandler(
    ctx
) {

    const telegramId =
        ctx.from.id;

    const text =
        ctx.message &&
        ctx.message.text
            ? ctx.message.text.trim()
            : "";

    if (!text) {

        return false;

    }


    if (text === "⚙️ Settings") {

        return showSettings(ctx);

    }


    if (text === "👤 Profile") {

        return showProfile(ctx);

    }


    if (text === "🔔 Notifications") {

        return showNotifications(ctx);

    }


    if (text === "🏢 Account") {

        return showAccount(ctx);

    }


    if (text === "🔄 Switch Account") {

        return switchAccount(ctx);

    }


    if (text === "👤 View Profile") {

        return showProfile(ctx);

    }


    if (text === "✏️ Edit Name") {

        return editName(ctx);

    }


    if (text === "📧 Edit Email") {

        return editEmail(ctx);

    }


    if (text === "📱 Edit Phone") {

        return editPhone(ctx);

    }


    if (text === "🌅 Morning Brief") {

        return toggleNotification(
            ctx,
            "morning_brief_enabled",
            "🌅 Morning Brief"
        );

    }


    if (text === "🌙 Evening Report") {

        return toggleNotification(
            ctx,
            "evening_report_enabled",
            "🌙 Evening Report"
        );

    }


    if (text === "📅 Weekly Report") {

        return toggleNotification(
            ctx,
            "weekly_report_enabled",
            "📅 Weekly Report"
        );

    }


    if (text === "🗓️ Monthly Report") {

        return toggleNotification(
            ctx,
            "monthly_report_enabled",
            "🗓️ Monthly Report"
        );

    }


    if (text === "⏰ Notification Time") {

        return editNotificationTime(ctx);

    }


    if (text === "🌐 Timezone") {

        return editTimezone(ctx);

    }


    if (text === "✏️ Rename Account") {

        return renameAccount(ctx);

    }


    if (text === "⬅️ Back") {

        return back(ctx);

    }


    // ==================================================
    // ACTIVE ACCOUNT SELECTION
    // ==================================================

    const session =
        require("../states/sessionManager")
            .getSession(
                telegramId
            );

    if (
        session &&
        session.state ===
            STATES.WAITING_FOR_ACCOUNT_SELECTION
    ) {

        return selectAccount(ctx);

    }


    return false;

};