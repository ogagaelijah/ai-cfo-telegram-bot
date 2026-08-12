const db = require("../database/database");

// ======================================================
// ACCOUNT CONTEXT
// ======================================================
//
// CENTRAL ACCOUNT CONTEXT SERVICE
//
// This service is interface-independent.
//
// Supported interfaces:
//
// Telegram
// Website
// Mobile App
// API
//
// IMPORTANT ARCHITECTURE:
//
// User
//   ↓
// Account Membership
//   ↓
// Account
//   ↓
// Current Account
//
// An account can be:
//
// BUSINESS
// PERSONAL
//
// Roles belong to account membership:
//
// OWNER
// ADMIN
// MEMBER
// etc.
//
// IMPORTANT:
//
// Subscription will belong to the ACCOUNT.
//
// Therefore every feature-access decision must ultimately
// know the current:
//
// accountId
// accountType
// role
//
// ======================================================


// ======================================================
// GET USER BY DATABASE ID
// ======================================================

function getUserById(userId) {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            created_at

        FROM users

        WHERE id = ?

        LIMIT 1
    `).get(
        userId
    );

}


// ======================================================
// GET USER BY TELEGRAM ID
// ======================================================
//
// Telegram is only one interface.
//
// This helper allows Telegram handlers to resolve the
// platform-specific Telegram identity into the internal
// CFO user ID.
//
// Website and mobile applications should NOT need this.
//
// ======================================================

function getUserByTelegramId(telegramId) {

    return db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            created_at

        FROM users

        WHERE telegram_id = ?

        LIMIT 1
    `).get(
        telegramId
    );

}


// ======================================================
// BUILD ACCOUNT CONTEXT
// ======================================================
//
// Central helper used internally by this service.
//
// This guarantees that every account context has the
// same structure.
//
// ======================================================

function buildAccountContext(
    user,
    account
) {

    if (
        !user ||
        !account
    ) {

        return null;

    }


    return {

        // ==============================================
        // USER
        // ==============================================

        userId:
            user.id,

        telegramId:
            user.telegram_id,

        fullName:
            user.full_name,

        username:
            user.username,


        // ==============================================
        // ACCOUNT
        // ==============================================

        accountId:
            account.id,

        accountName:
            account.name,

        accountType:
            account.account_type,


        // ==============================================
        // MEMBERSHIP ROLE
        // ==============================================

        role:
            account.role ||
            (
                account.owner_user_id ===
                user.id
                    ? "OWNER"
                    : "MEMBER"
            )

    };

}


// ======================================================
// GET USER ACCOUNTS
// ======================================================
//
// Returns every account the user belongs to.
//
// Includes:
//
// BUSINESS
// PERSONAL
//
// The role belongs to the membership.
//
// ======================================================

function getUserAccounts(userId) {

    return db.prepare(`
        SELECT

            a.id,

            a.name,

            a.account_type,

            a.owner_user_id,

            am.role,

            a.created_at

        FROM accounts a

        INNER JOIN account_members am
            ON am.account_id = a.id

        WHERE
            am.user_id = ?

        ORDER BY
            a.created_at ASC
    `).all(
        userId
    );

}


// ======================================================
// GET CURRENT ACCOUNT BY USER ID
// ======================================================
//
// This is the CORE version.
//
// The application does not need to know whether the
// request came from Telegram, website, or mobile.
//
// ======================================================

function getCurrentAccountByUserId(userId) {

    const user =
        getUserById(
            userId
        );


    if (!user) {

        return null;

    }


    const account =
        db.prepare(`
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

                AND am.user_id =
                    uca.user_id

            WHERE
                uca.user_id = ?

            LIMIT 1
        `).get(
            userId
        );


    if (!account) {

        return null;

    }


    return buildAccountContext(
        user,
        account
    );

}


// ======================================================
// GET CURRENT ACCOUNT BY TELEGRAM ID
// ======================================================
//
// Interface adapter for Telegram.
//
// Telegram ID is converted to the internal user ID,
// then the common account engine is used.
//
// ======================================================

function getCurrentAccount(
    telegramId
) {

    const user =
        getUserByTelegramId(
            telegramId
        );


    if (!user) {

        return null;

    }


    return getCurrentAccountByUserId(
        user.id
    );

}


// ======================================================
// REQUIRE CURRENT ACCOUNT BY USER ID
// ======================================================
//
// Used by application services that require an active
// account.
//
// Works independently of Telegram.
//
// ======================================================

function requireAccountByUserId(
    userId
) {

    const account =
        getCurrentAccountByUserId(
            userId
        );


    if (!account) {

        throw new Error(
            "No current account found for this user."
        );

    }


    return account;

}


// ======================================================
// REQUIRE CURRENT ACCOUNT
// ======================================================
//
// Telegram convenience wrapper.
//
// ======================================================

function requireAccount(
    telegramId
) {

    const account =
        getCurrentAccount(
            telegramId
        );


    if (!account) {

        throw new Error(
            "No current account found for this user."
        );

    }


    return account;

}


// ======================================================
// GET ACCOUNT CONTEXT BY USER ID
// ======================================================
//
// SECURITY:
//
// The user must actually belong to the account.
//
// This prevents a user from accessing another user's
// account by simply supplying an account ID.
//
// ======================================================

function getAccountContextByUserId(
    userId,
    accountId
) {

    const user =
        getUserById(
            userId
        );


    if (!user) {

        return null;

    }


    const account =
        db.prepare(`
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

            WHERE
                a.id = ?

                AND am.user_id = ?

            LIMIT 1
        `).get(

            accountId,

            userId

        );


    if (!account) {

        return null;

    }


    return buildAccountContext(
        user,
        account
    );

}


// ======================================================
// GET ACCOUNT CONTEXT BY TELEGRAM ID
// ======================================================
//
// Telegram convenience wrapper.
//
// ======================================================

function getAccountContext(
    telegramId,
    accountId
) {

    const user =
        getUserByTelegramId(
            telegramId
        );


    if (!user) {

        return null;

    }


    return getAccountContextByUserId(
        user.id,
        accountId
    );

}


// ======================================================
// SET CURRENT ACCOUNT BY USER ID
// ======================================================
//
// SECURITY:
//
// The user must belong to the account before the account
// can become current.
//
// ======================================================

function setCurrentAccountByUserId(
    userId,
    accountId
) {

    const user =
        getUserById(
            userId
        );


    if (!user) {

        return null;

    }


    const account =
        db.prepare(`
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

            WHERE

                a.id = ?

                AND am.user_id = ?

            LIMIT 1
        `).get(

            accountId,

            userId

        );


    if (!account) {

        return null;

    }


    db.prepare(`
        INSERT INTO user_current_accounts
        (
            user_id,
            account_id,
            updated_at
        )

        VALUES
        (
            ?,
            ?,
            CURRENT_TIMESTAMP
        )

        ON CONFLICT(user_id)

        DO UPDATE SET

            account_id =
                excluded.account_id,

            updated_at =
                CURRENT_TIMESTAMP
    `).run(

        userId,

        accountId

    );


    return buildAccountContext(
        user,
        account
    );

}


// ======================================================
// SET CURRENT ACCOUNT
// ======================================================
//
// Telegram convenience wrapper.
//
// ======================================================

function setCurrentAccount(
    telegramId,
    accountId
) {

    const user =
        getUserByTelegramId(
            telegramId
        );


    if (!user) {

        return null;

    }


    return setCurrentAccountByUserId(
        user.id,
        accountId
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    getUserById,

    getUserByTelegramId,

    getUserAccounts,

    getCurrentAccountByUserId,

    getCurrentAccount,

    requireAccountByUserId,

    requireAccount,

    getAccountContextByUserId,

    getAccountContext,

    setCurrentAccountByUserId,

    setCurrentAccount

};