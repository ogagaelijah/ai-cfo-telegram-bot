const db = require("../database/database");


// ======================================================
// ACCOUNT SETTINGS SERVICE
// ======================================================
//
// Handles settings belonging to the ACCOUNT.
//
// Account settings are different from USER settings.
//
// USER SETTINGS:
// - Profile
// - Notifications
// - Timezone
// - Notification time
//
// ACCOUNT SETTINGS:
// - Account name
// - Account type
// - Account ownership
// - Current user's account role
//
// This service is interface-independent.
//
// It does NOT know about:
// - Telegram
// - ctx
// - keyboards
// - sessions
// - Telegram IDs
//
// ======================================================


// ======================================================
// GET ACCOUNT SETTINGS
// ======================================================

function getAccountSettings(
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

            a.id,
            a.name,
            a.account_type,
            a.owner_user_id,
            a.created_at,

            am.role

        FROM accounts a

        INNER JOIN account_members am
            ON am.account_id = a.id

            AND am.user_id = ?

        WHERE
            a.id = ?

        LIMIT 1

    `).get(

        userId,
        accountId

    );

}


// ======================================================
// UPDATE ACCOUNT NAME
// ======================================================
//
// Only the account owner should normally be allowed
// to perform this operation.
//
// Permission enforcement belongs in the application/
// authorization layer.
//
// This service persists the already-authorized change.
//
// ======================================================

function updateAccountName(
    accountId,
    name
) {

    if (!accountId) {

        return null;

    }


    if (
        !name ||
        typeof name !== "string"
    ) {

        throw new Error(
            "Account name is required."
        );

    }


    const cleanedName =
        name.trim();


    if (!cleanedName) {

        throw new Error(
            "Account name cannot be empty."
        );

    }


    const result = db.prepare(`
        UPDATE accounts

        SET
            name = ?

        WHERE
            id = ?

    `).run(

        cleanedName,
        accountId

    );


    if (result.changes === 0) {

        return null;

    }


    return db.prepare(`
        SELECT

            id,
            name,
            account_type,
            owner_user_id,
            created_at

        FROM accounts

        WHERE id = ?

        LIMIT 1

    `).get(

        accountId

    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getAccountSettings,

    updateAccountName

};