const db = require("../database/database");


// ======================================================
// USER SETTINGS SERVICE
// ======================================================
//
// Handles settings belonging to the USER.
//
// User settings include:
//
// - Profile information
// - Notification preferences
// - Notification time
// - Timezone
//
// Account financial data does NOT belong here.
//
// ======================================================


// ======================================================
// GET USER SETTINGS
// ======================================================

function getUserSettings(userId) {

    if (!userId) {

        return null;

    }


    return db.prepare(`
        SELECT

            id,
            full_name,
            username,
            email,
            phone,

            morning_brief_enabled,
            evening_report_enabled,
            weekly_report_enabled,
            monthly_report_enabled,

            notification_time,
            timezone

        FROM users

        WHERE id = ?

        LIMIT 1

    `).get(

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

        return null;

    }


    const result = db.prepare(`
        UPDATE users

        SET

            full_name = @fullName,

            email = @email,

            phone = @phone

        WHERE id = @userId
    `).run({

        userId,

        fullName:
            data.fullName,

        email:
            data.email ?? null,

        phone:
            data.phone ?? null

    });


    if (result.changes === 0) {

        return null;

    }


    return getUserSettings(
        userId
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

    const allowedFields = [

        "morning_brief_enabled",

        "evening_report_enabled",

        "weekly_report_enabled",

        "monthly_report_enabled"

    ];


    if (
        !allowedFields.includes(field)
    ) {

        throw new Error(
            "Invalid notification setting."
        );

    }


    if (!userId) {

        return null;

    }


    const value =
        enabled ? 1 : 0;


    const result = db.prepare(`
        UPDATE users

        SET
            ${field} = ?

        WHERE id = ?
    `).run(

        value,
        userId

    );


    if (result.changes === 0) {

        return null;

    }


    return getUserSettings(
        userId
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

        return null;

    }


    const result = db.prepare(`
        UPDATE users

        SET
            notification_time = ?

        WHERE id = ?
    `).run(

        notificationTime,
        userId

    );


    if (result.changes === 0) {

        return null;

    }


    return getUserSettings(
        userId
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

        return null;

    }


    const result = db.prepare(`
        UPDATE users

        SET
            timezone = ?

        WHERE id = ?
    `).run(

        timezone,
        userId

    );


    if (result.changes === 0) {

        return null;

    }


    return getUserSettings(
        userId
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