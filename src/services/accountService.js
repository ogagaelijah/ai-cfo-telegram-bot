const db = require("../database/database");


// ======================================================
// ACCOUNT TYPES
// ======================================================
//
// The CFO supports two primary account types:
//
// BUSINESS
// PERSONAL
//
// Roles are NOT account types.
//
// Roles belong to account membership.
//
// Example:
//
// Ogaga
//   ├── My Business
//   │      Type: BUSINESS
//   │      Role: OWNER
//   │
//   └── Ogaga Personal
//          Type: PERSONAL
//          Role: OWNER
//
// ======================================================

const ACCOUNT_TYPES = {

    BUSINESS: "BUSINESS",

    PERSONAL: "PERSONAL"

};


// ======================================================
// VALIDATE ACCOUNT TYPE
// ======================================================

function validateAccountType(
    accountType
) {

    const type =
        String(
            accountType || ""
        )
        .trim()
        .toUpperCase();


    if (
        !Object.values(
            ACCOUNT_TYPES
        ).includes(type)
    ) {

        throw new Error(
            "Invalid account type. Account type must be BUSINESS or PERSONAL."
        );

    }


    return type;

}


// ======================================================
// CREATE ACCOUNT
// ======================================================
//
// Creates either:
//
// BUSINESS
// PERSONAL
//
// The creator automatically becomes:
//
// OWNER
//
// The account is also set as the user's current account.
//
// ======================================================

function createAccount(
    userId,
    accountName,
    accountType = ACCOUNT_TYPES.BUSINESS
) {

    const name =
        String(
            accountName || ""
        ).trim();


    if (!name) {

        throw new Error(
            "Account name is required."
        );

    }


    const type =
        validateAccountType(
            accountType
        );


    // ==================================================
    // PREVENT DUPLICATE ACCOUNT NAMES
    // ==================================================
    //
    // Duplicate names are prevented for the same user
    // and account type.
    //
    // Therefore a user could technically have:
    //
    // BUSINESS: My Business
    // PERSONAL: My Business
    //
    // although the interface can later encourage
    // clearer names.
    //
    // ==================================================

    const existing =
        db.prepare(`
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

                AND LOWER(a.name) =
                    LOWER(?)

                AND a.account_type = ?

            LIMIT 1
        `).get(

            userId,

            name,

            type

        );


    if (existing) {

        // Make the existing account current.

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

            existing.id

        );


        return existing;

    }


    // ==================================================
    // CREATE ACCOUNT + OWNER MEMBERSHIP
    // ==================================================
    //
    // Both operations must succeed together.
    //
    // ==================================================

    const createAccountTransaction =
        db.transaction(() => {

            // ==========================================
            // CREATE ACCOUNT
            // ==========================================

            const account =
                db.prepare(`
                    INSERT INTO accounts
                    (
                        name,
                        owner_user_id,
                        account_type
                    )

                    VALUES
                    (
                        ?,
                        ?,
                        ?
                    )
                `).run(

                    name,

                    userId,

                    type

                );


            const accountId =
                account.lastInsertRowid;


            // ==========================================
            // ADD CREATOR AS OWNER
            // ==========================================

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

                userId,

                "OWNER"

            );


            // ==========================================
            // MAKE ACCOUNT CURRENT
            // ==========================================

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


            return accountId;

        });


    const accountId =
        createAccountTransaction();


    // ==================================================
    // RETURN CREATED ACCOUNT
    // ==================================================

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
            a.id = ?

            AND am.user_id = ?

        LIMIT 1
    `).get(

        accountId,

        userId

    );

}


// ======================================================
// GET USER ACCOUNTS
// ======================================================

function getUserAccounts(
    userId
) {

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
// GET ACCOUNT BY ID
// ======================================================

function getAccountById(
    accountId
) {

    return db.prepare(`
        SELECT
            id,
            name,
            account_type,
            owner_user_id,
            created_at

        FROM accounts

        WHERE id = ?
    `).get(
        accountId
    );

}


// ======================================================
// CHECK ACCOUNT MEMBERSHIP
// ======================================================

function isAccountMember(
    accountId,
    userId
) {

    const member =
        db.prepare(`
            SELECT
                id,
                account_id,
                user_id,
                role

            FROM account_members

            WHERE
                account_id = ?

                AND user_id = ?
        `).get(

            accountId,

            userId

        );


    return !!member;

}


// ======================================================
// GET MEMBER ROLE
// ======================================================

function getAccountMemberRole(
    accountId,
    userId
) {

    const member =
        db.prepare(`
            SELECT
                role

            FROM account_members

            WHERE
                account_id = ?

                AND user_id = ?
        `).get(

            accountId,

            userId

        );


    return member
        ? member.role
        : null;

}


// ======================================================
// GET ACCOUNT OWNER
// ======================================================

function getAccountOwner(
    accountId
) {

    return db.prepare(`
        SELECT
            u.id,
            u.telegram_id,
            u.full_name,
            u.username

        FROM users u

        INNER JOIN accounts a
            ON a.owner_user_id = u.id

        WHERE
            a.id = ?
    `).get(
        accountId
    );

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    ACCOUNT_TYPES,

    createAccount,

    getUserAccounts,

    getAccountById,

    isAccountMember,

    getAccountMemberRole,

    getAccountOwner

};