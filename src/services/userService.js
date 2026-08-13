const db = require("../database/database");


// ======================================================
// USER SERVICE
// ======================================================
//
// Responsible for:
//
// - Finding existing users
// - Loading user profiles
// - Loading current accounts
// - Loading account membership
//
// IMPORTANT:
//
// This service does NOT perform onboarding.
//
// New-user registration is handled by:
//     onboardingService.js
//
// This separation keeps the architecture interface-neutral.
//
// Interface
//     ↓
// Onboarding Service
//     ↓
// User Service / Account Service
//     ↓
// Database
//
// Telegram, Web, WhatsApp, Mobile and other interfaces
// can therefore use the same underlying architecture.
// ======================================================


// ======================================================
// GET USER BY TELEGRAM ID
// ======================================================
//
// Telegram is currently one identity provider.
//
// This function exists for the Telegram interface.
//
// It does NOT perform registration.
//
// ======================================================

function getUserByTelegramId(
    telegramId
) {

    if (!telegramId) {
        return null;
    }


    const user = db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            email,
            phone,
            created_at

        FROM users

        WHERE telegram_id = ?

        LIMIT 1
    `).get(
        telegramId
    );


    if (!user) {
        return null;
    }


    // ==================================================
    // LOAD CURRENT ACCOUNT
    // ==================================================

    const account = db.prepare(`
        SELECT
            a.id,
            a.name,
            a.account_type,
            a.owner_user_id,
            a.created_at,
            am.role

        FROM user_current_accounts uca

        INNER JOIN accounts a
            ON a.id = uca.account_id

        INNER JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = uca.user_id

        WHERE
            uca.user_id = ?

        LIMIT 1
    `).get(
        user.id
    );


    return {

        ...user,

        account: account
            ? {

                id:
                    account.id,

                name:
                    account.name,

                account_type:
                    account.account_type,

                owner_user_id:
                    account.owner_user_id,

                role:
                    account.role ||
                    (
                        account.owner_user_id ===
                        user.id

                            ? "OWNER"

                            : "MEMBER"
                    )

            }

            : null

    };

}


// ======================================================
// GET USER BY DATABASE ID
// ======================================================

function getUserById(
    userId
) {

    if (!userId) {
        return null;
    }


    const user = db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            email,
            phone,
            created_at

        FROM users

        WHERE id = ?

        LIMIT 1
    `).get(
        userId
    );


    if (!user) {
        return null;
    }


    // ==================================================
    // LOAD CURRENT ACCOUNT
    // ==================================================

    const account = db.prepare(`
        SELECT
            a.id,
            a.name,
            a.account_type,
            a.owner_user_id,
            a.created_at,
            am.role

        FROM user_current_accounts uca

        INNER JOIN accounts a
            ON a.id = uca.account_id

        INNER JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = uca.user_id

        WHERE
            uca.user_id = ?

        LIMIT 1
    `).get(
        user.id
    );


    return {

        ...user,

        account: account
            ? {

                id:
                    account.id,

                name:
                    account.name,

                account_type:
                    account.account_type,

                owner_user_id:
                    account.owner_user_id,

                role:
                    account.role ||
                    (
                        account.owner_user_id ===
                        user.id

                            ? "OWNER"

                            : "MEMBER"
                    )

            }

            : null

    };

}


// ======================================================
// GET USER ACCOUNTS
// ======================================================
//
// Returns every account the user belongs to.
//
// Useful for:
//
// - Account switching
// - Multi-business users
// - Personal + Business accounts
// - Future account selector UI
//
// ======================================================

function getUserAccounts(
    userId
) {

    if (!userId) {
        return [];
    }


    return db.prepare(`
        SELECT

            a.id,
            a.name,
            a.account_type,
            a.owner_user_id,
            a.created_at,
            am.role

        FROM account_members am

        INNER JOIN accounts a
            ON a.id = am.account_id

        WHERE
            am.user_id = ?

        ORDER BY
            a.created_at ASC
    `).all(
        userId
    );

}


// ======================================================
// GET CURRENT ACCOUNT
// ======================================================
//
// Returns the account currently selected by the user.
//
// ======================================================

function getCurrentAccount(
    userId
) {

    if (!userId) {
        return null;
    }


    return db.prepare(`
        SELECT

            a.id,
            a.name,
            a.account_type,
            a.owner_user_id,
            a.created_at,
            am.role

        FROM user_current_accounts uca

        INNER JOIN accounts a
            ON a.id = uca.account_id

        INNER JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = uca.user_id

        WHERE
            uca.user_id = ?

        LIMIT 1
    `).get(
        userId
    );

}


// ======================================================
// CHECK WHETHER USER EXISTS
// ======================================================
//
// This is intentionally separate from registration.
//
// The onboarding service decides what to do with the
// result.
//
// ======================================================

function userExistsByTelegramId(
    telegramId
) {

    if (!telegramId) {
        return false;
    }


    const result = db.prepare(`
        SELECT
            id

        FROM users

        WHERE telegram_id = ?

        LIMIT 1
    `).get(
        telegramId
    );


    return !!result;

}


// ======================================================
// GET ACCOUNT MEMBERSHIP
// ======================================================

function getAccountMembership(
    accountId,
    userId
) {

    if (
        !accountId ||
        !userId
    ) {
        return null;
    }


    return db.prepare(`
        SELECT

            am.id,
            am.account_id,
            am.user_id,
            am.role,
            am.created_at

        FROM account_members am

        WHERE
            am.account_id = ?

            AND am.user_id = ?

        LIMIT 1
    `).get(

        accountId,

        userId

    );

}


// ======================================================
// GET USER PROFILE
// ======================================================
//
// Returns the user without account information.
//
// Useful for:
//
// - Registration
// - Profile
// - Settings
// - Web/API responses
//
// ======================================================

function getUserProfile(
    userId
) {

    if (!userId) {
        return null;
    }


    return db.prepare(`
        SELECT

            id,
            telegram_id,
            full_name,
            username,
            email,
            phone,
            created_at

        FROM users

        WHERE id = ?

        LIMIT 1
    `).get(
        userId
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getUserByTelegramId,

    getUserById,

    getUserAccounts,

    getCurrentAccount,

    userExistsByTelegramId,

    getAccountMembership,

    getUserProfile

};