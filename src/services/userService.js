const db = require("../database/database");

// ======================================================
// CREATE / LOAD USER
// ======================================================
//
// Central user creation service.
//
// Architecture:
//
// Interface
//    ↓
// userService
//    ↓
// User
//    ↓
// Account
//    ↓
// Account Membership
//    ↓
// Current Account
//
// Current account is stored in:
//
// user_current_accounts
//
// NOT inside users.
//
// This keeps the user/account architecture compatible
// with the multi-account system.
// ======================================================

function createUser(user) {

    // ==================================================
    // CHECK WHETHER USER ALREADY EXISTS
    // ==================================================

    let existingUser = db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            created_at

        FROM users

        WHERE telegram_id = ?
    `).get(
        user.id
    );


    // ==================================================
    // CREATE USER IF NECESSARY
    // ==================================================

    if (!existingUser) {

        const fullName =
            (
                user.first_name ||
                ""
            ) +
            (
                user.last_name
                    ? " " + user.last_name
                    : ""
            );


        const result = db.prepare(`
            INSERT INTO users
            (
                telegram_id,
                full_name,
                username
            )

            VALUES
            (
                ?,
                ?,
                ?
            )
        `).run(

            user.id,

            fullName.trim() ||
                "Telegram User",

            user.username || null

        );


        const userId =
            result.lastInsertRowid;


        existingUser = db.prepare(`
            SELECT
                id,
                telegram_id,
                full_name,
                username,
                created_at

            FROM users

            WHERE id = ?
        `).get(
            userId
        );

    }


    // ==================================================
    // CHECK CURRENT ACCOUNT
    // ==================================================

    let currentAccount = db.prepare(`
        SELECT
            a.id,
            a.name,
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
        existingUser.id
    );


    // ==================================================
    // IF NO CURRENT ACCOUNT EXISTS
    // CHECK WHETHER USER ALREADY OWNS / BELONGS TO ONE
    // ==================================================

    if (!currentAccount) {

        currentAccount = db.prepare(`
            SELECT
                a.id,
                a.name,
                a.owner_user_id,
                a.created_at,
                am.role

            FROM account_members am

            INNER JOIN accounts a
                ON a.id = am.account_id

            WHERE
                am.user_id = ?

            ORDER BY
                a.id ASC

            LIMIT 1
        `).get(
            existingUser.id
        );

    }


    // ==================================================
    // CREATE FIRST ACCOUNT
    // ==================================================
    //
    // If this user has never had an account,
    // automatically create one.
    //
    // Default name:
    //
    // "My Business"
    //
    // The account settings flow can later allow
    // the owner to rename it.
    // ==================================================

    if (!currentAccount) {

        const accountResult = db.prepare(`
            INSERT INTO accounts
            (
                name,
                owner_user_id
            )

            VALUES
            (
                ?,
                ?
            )
        `).run(

            "My Business",

            existingUser.id

        );


        const accountId =
            accountResult.lastInsertRowid;


        // ==============================================
        // ADD USER AS OWNER
        // ==============================================

        db.prepare(`
            INSERT INTO account_members
            (
                account_id,
                user_id,
                role
            )

            VALUES
            (
                ?,
                ?,
                ?
            )
        `).run(

            accountId,

            existingUser.id,

            "OWNER"

        );


        // ==============================================
        // SET CURRENT ACCOUNT
        // ==============================================

        db.prepare(`
            INSERT INTO user_current_accounts
            (
                user_id,
                account_id
            )

            VALUES
            (
                ?,
                ?
            )

            ON CONFLICT(user_id)
            DO UPDATE SET
                account_id = excluded.account_id,
                updated_at = CURRENT_TIMESTAMP
        `).run(

            existingUser.id,

            accountId

        );


        // ==============================================
        // LOAD ACCOUNT
        // ==============================================

        currentAccount = db.prepare(`
            SELECT
                a.id,
                a.name,
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

            existingUser.id,

            accountId

        );

    }


    // ==================================================
    // ENSURE CURRENT ACCOUNT IS STORED
    // ==================================================

    const currentAccountRecord = db.prepare(`
        SELECT
            id,
            account_id

        FROM user_current_accounts

        WHERE user_id = ?

        LIMIT 1
    `).get(
        existingUser.id
    );


    if (!currentAccountRecord) {

        db.prepare(`
            INSERT INTO user_current_accounts
            (
                user_id,
                account_id
            )

            VALUES
            (
                ?,
                ?
            )
        `).run(

            existingUser.id,

            currentAccount.id

        );

    }


    // ==================================================
    // RETURN USER + CURRENT ACCOUNT
    // ==================================================

    return {

        id:
            existingUser.id,

        telegram_id:
            existingUser.telegram_id,

        full_name:
            existingUser.full_name,

        username:
            existingUser.username,

        account: {

            id:
                currentAccount.id,

            name:
                currentAccount.name,

            role:
                currentAccount.role ||
                (
                    currentAccount.owner_user_id ===
                    existingUser.id
                        ? "OWNER"
                        : "MEMBER"
                )

        }

    };

}


// ======================================================
// GET USER BY TELEGRAM ID
// ======================================================

function getUserByTelegramId(
    telegramId
) {

    const user = db.prepare(`
        SELECT
            id,
            telegram_id,
            full_name,
            username,
            created_at

        FROM users

        WHERE telegram_id = ?
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
// EXPORT
// ======================================================

module.exports = {

    createUser,

    getUserByTelegramId

};