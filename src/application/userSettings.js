const userSettingsService =
    require("../services/userSettingsService");


// ======================================================
// USER SETTINGS APPLICATION
// ======================================================
//
// Application orchestration layer for USER settings.
//
// User settings include:
//
// - Profile
// - Notifications
// - Notification time
// - Timezone
//
// This layer does NOT know about Telegram.
//
// ======================================================


// ======================================================
// GET USER SETTINGS
// ======================================================

function getUserSettings(
    userId
) {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );

    }


    return userSettingsService.getUserSettings(
        userId
    );

}


// ======================================================
// UPDATE PROFILE
// ======================================================

function updateProfile(
    userId,
    data
) {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );

    }


    if (!data) {

        throw new Error(
            "Profile data is required."
        );

    }


    return userSettingsService.updateProfile(
        userId,
        data
    );

}


// ======================================================
// UPDATE NOTIFICATION PREFERENCE
// ======================================================

function updateNotificationPreference(
    userId,
    field,
    enabled
) {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );

    }


    return userSettingsService.updateNotificationPreference(
        userId,
        field,
        enabled
    );

}


// ======================================================
// UPDATE NOTIFICATION TIME
// ======================================================

function updateNotificationTime(
    userId,
    notificationTime
) {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );

    }


    return userSettingsService.updateNotificationTime(
        userId,
        notificationTime
    );

}


// ======================================================
// UPDATE TIMEZONE
// ======================================================

function updateTimezone(
    userId,
    timezone
) {

    if (!userId) {

        throw new Error(
            "User ID is required."
        );

    }


    return userSettingsService.updateTimezone(
        userId,
        timezone
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getUserSettings,

    updateProfile,

    updateNotificationPreference,

    updateNotificationTime,

    updateTimezone

};