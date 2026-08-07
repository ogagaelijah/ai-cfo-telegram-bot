const db = require("../database/database");

// ==========================
// USERS WITH MORNING BRIEF
// ==========================
function getMorningBriefUsers() {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            business_name,
            notification_time,
            timezone
        FROM users
        WHERE morning_brief_enabled = 1
        ORDER BY id
    `).all();

}

// ==========================
// USERS WITH EVENING REPORT
// ==========================
function getEveningReportUsers() {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            business_name,
            notification_time,
            timezone
        FROM users
        WHERE evening_report_enabled = 1
        ORDER BY id
    `).all();

}

// ==========================
// USERS WITH WEEKLY REPORT
// ==========================
function getWeeklyReportUsers() {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            business_name,
            notification_time,
            timezone
        FROM users
        WHERE weekly_report_enabled = 1
        ORDER BY id
    `).all();

}

// ==========================
// USERS WITH MONTHLY REPORT
// ==========================
function getMonthlyReportUsers() {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            business_name,
            notification_time,
            timezone
        FROM users
        WHERE monthly_report_enabled = 1
        ORDER BY id
    `).all();

}

module.exports = {

    getMorningBriefUsers,

    getEveningReportUsers,

    getWeeklyReportUsers,

    getMonthlyReportUsers

};