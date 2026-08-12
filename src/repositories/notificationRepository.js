const db = require("../database/database");

// ======================================================
// GET USERS WITH MORNING BRIEF ENABLED
// ======================================================
//
// Notification preferences belong to the USER.
// Financial/business data belongs to the ACCOUNT.
//
// This repository therefore retrieves the Telegram user
// together with their current account.
//
// ======================================================

function getMorningBriefUsers() {

    return db.prepare(`
        SELECT

            u.id,
            u.telegram_id,
            u.full_name,
            u.username,

            u.morning_brief_enabled,
            u.notification_time,
            u.timezone,

            a.id AS account_id,
            a.name AS account_name,
            a.account_type,

            am.role

        FROM users u

        LEFT JOIN user_current_accounts uca
            ON uca.user_id = u.id

        LEFT JOIN accounts a
            ON a.id = uca.account_id

        LEFT JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = u.id

        WHERE
            u.morning_brief_enabled = 1

        ORDER BY
            u.id

    `).all();

}


// ======================================================
// GET USERS WITH EVENING REPORT
// ======================================================

function getEveningReportUsers() {

    return db.prepare(`
        SELECT

            u.id,
            u.telegram_id,
            u.full_name,
            u.username,

            u.evening_report_enabled,
            u.notification_time,
            u.timezone,

            a.id AS account_id,
            a.name AS account_name,
            a.account_type,

            am.role

        FROM users u

        LEFT JOIN user_current_accounts uca
            ON uca.user_id = u.id

        LEFT JOIN accounts a
            ON a.id = uca.account_id

        LEFT JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = u.id

        WHERE
            u.evening_report_enabled = 1

        ORDER BY
            u.id

    `).all();

}


// ======================================================
// GET USERS WITH WEEKLY REPORT
// ======================================================

function getWeeklyReportUsers() {

    return db.prepare(`
        SELECT

            u.id,
            u.telegram_id,
            u.full_name,
            u.username,

            u.weekly_report_enabled,
            u.notification_time,
            u.timezone,

            a.id AS account_id,
            a.name AS account_name,
            a.account_type,

            am.role

        FROM users u

        LEFT JOIN user_current_accounts uca
            ON uca.user_id = u.id

        LEFT JOIN accounts a
            ON a.id = uca.account_id

        LEFT JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = u.id

        WHERE
            u.weekly_report_enabled = 1

        ORDER BY
            u.id

    `).all();

}


// ======================================================
// GET USERS WITH MONTHLY REPORT
// ======================================================

function getMonthlyReportUsers() {

    return db.prepare(`
        SELECT

            u.id,
            u.telegram_id,
            u.full_name,
            u.username,

            u.monthly_report_enabled,
            u.notification_time,
            u.timezone,

            a.id AS account_id,
            a.name AS account_name,
            a.account_type,

            am.role

        FROM users u

        LEFT JOIN user_current_accounts uca
            ON uca.user_id = u.id

        LEFT JOIN accounts a
            ON a.id = uca.account_id

        LEFT JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = u.id

        WHERE
            u.monthly_report_enabled = 1

        ORDER BY
            u.id

    `).all();

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getMorningBriefUsers,

    getEveningReportUsers,

    getWeeklyReportUsers,

    getMonthlyReportUsers

};