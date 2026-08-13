const db = require("../database/database");


// ======================================================
// REGISTRATION SERVICE
// ======================================================
//
// Interface-neutral registration engine.
//
// This service does NOT know about:
//
// - Telegram
// - WhatsApp
// - Web
// - Mobile
// - UI buttons
// - Conversation states
//
// It only knows how to create a valid CFO user and
// their initial account structure.
//
// Architecture:
//
// Interface
//      ↓
// Onboarding / Controller
//      ↓
// registrationService
//      ↓
// User
//      ↓
// Account
//      ↓
// Account Membership
//      ↓
// Current Account
//
// ======================================================


// ======================================================
// ACCOUNT TYPES
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
            accountType ||
            ACCOUNT_TYPES.BUSINESS
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
// NORMALIZE REGISTRATION DATA
// ======================================================

function normalizeRegistrationData(
    data = {}
) {

    const fullName =
        String(
            data.fullName ||
            ""
        )
        .trim();


    const email =
        String(
            data.email ||
            ""
        )
        .trim()
        .toLowerCase();


    const phone =
        String(
            data.phone ||
            ""
        )
        .trim();


    const accountName =
        String(
            data.accountName ||
            ""
        )
        .trim();


    const accountType =
        validateAccountType(
            data.accountType
        );


    const telegramId =
        data.telegramId !== undefined &&
        data.telegramId !== null &&
        data.telegramId !== ""

            ? Number(data.telegramId)

            : null;


    const username =
        data.username !== undefined &&
        data.username !== null &&
        data.username !== ""

            ? String(data.username).trim()

            : null;


    return {

        fullName,

        email,

        phone,

        accountName,

        accountType,

        telegramId,

        username

    };

}


// ======================================================
// VALIDATE REGISTRATION DATA
// ======================================================

function validateRegistrationData(
    data
) {

    if (!data.fullName) {

        throw new Error(
            "Full name is required."
        );

    }


    if (!data.email) {

        throw new Error(
            "Email address is required."
        );

    }


    // --------------------------------------------------
    // Basic email validation
    // --------------------------------------------------

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (
        !emailPattern.test(
            data.email
        )
    ) {

        throw new Error(
            "Please provide a valid email address."
        );

    }


    if (!data.phone) {

        throw new Error(
            "Phone number is required."
        );

    }


    if (!data.accountName) {

        throw new Error(
            "Account name is required."
        );

    }


    if (
        !data.accountType
    ) {

        throw new Error(
            "Account type is required."
        );

    }


    // --------------------------------------------------
    // Telegram identity validation
    // --------------------------------------------------
    //
    // telegramId is optional because this service is
    // interface-neutral.
    //
    // Web users, WhatsApp users and other interfaces
    // can register without a Telegram ID.
    //
    // --------------------------------------------------

    if (
        data.telegramId !== null
        &&
        (
            !Number.isInteger(
                data.telegramId
            )
            ||
            data.telegramId <= 0
        )
    ) {

        throw new Error(
            "Invalid Telegram identity."
        );

    }


    return true;

}


// ======================================================
// FIND EXISTING USER BY TELEGRAM ID
// ======================================================
//
// Telegram is optional.
//
// This lookup exists only when a Telegram identity is
// supplied.
//
// ======================================================

function findUserByTelegramId(
    telegramId
) {

    if (
        telegramId === null ||
        telegramId === undefined
    ) {

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

        WHERE
            telegram_id = ?

        LIMIT 1
    `).get(
        telegramId
    );

}


// ======================================================
// FIND EXISTING USER BY EMAIL
// ======================================================
//
// Email is currently used as the primary cross-interface
// duplicate check.
//
// ======================================================

function findUserByEmail(
    email
) {

    if (!email) {

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

        WHERE
            LOWER(email) = LOWER(?)

        LIMIT 1
    `).get(
        email
    );

}


// ======================================================
// FIND EXISTING USER
// ======================================================
//
// Checks supported identities.
//
// Priority:
//
// 1. Telegram identity when supplied
// 2. Email address
//
// ======================================================

function findExistingUser(
    data
) {

    let user = null;


    if (
        data.telegramId !== null
    ) {

        user =
            findUserByTelegramId(
                data.telegramId
            );

    }


    if (!user) {

        user =
            findUserByEmail(
                data.email
            );

    }


    return user;

}


// ======================================================
// CREATE USER
// ======================================================

function createUser(
    data
) {

    const result =
        db.prepare(`
            INSERT INTO users
            (
                telegram_id,
                full_name,
                username,
                email,
                phone
            )

            VALUES
            (
                ?,
                ?,
                ?,
                ?,
                ?
            )
        `).run(

            data.telegramId,

            data.fullName,

            data.username,

            data.email,

            data.phone

        );


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
        result.lastInsertRowid
    );

}


// ======================================================
// CREATE ACCOUNT
// ======================================================

function createAccount(
    userId,
    accountName,
    accountType
) {

    const result =
        db.prepare(`
            INSERT INTO accounts
            (
                name,
                account_type,
                owner_user_id
            )

            VALUES
            (
                ?,
                ?,
                ?
            )
        `).run(

            accountName,

            accountType,

            userId

        );


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
        result.lastInsertRowid
    );

}


// ======================================================
// CREATE OWNER MEMBERSHIP
// ======================================================

function createOwnerMembership(
    accountId,
    userId
) {

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


    return db.prepare(`
        SELECT

            id,
            account_id,
            user_id,
            role,
            created_at

        FROM account_members

        WHERE
            account_id = ?

            AND user_id = ?

        LIMIT 1
    `).get(

        accountId,

        userId

    );

}


// ======================================================
// SET CURRENT ACCOUNT
// ======================================================

function setCurrentAccount(
    userId,
    accountId
) {

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


    return db.prepare(`
        SELECT

            user_id,
            account_id,
            updated_at

        FROM user_current_accounts

        WHERE
            user_id = ?

        LIMIT 1
    `).get(
        userId
    );

}


// ======================================================
// GET REGISTERED USER
// ======================================================

function getRegisteredUser(
    userId,
    accountId
) {

    return db.prepare(`
        SELECT

            u.id AS user_id,
            u.telegram_id,
            u.full_name,
            u.username,
            u.email,
            u.phone,
            u.created_at AS user_created_at,

            a.id AS account_id,
            a.name AS account_name,
            a.account_type,
            a.owner_user_id,
            a.created_at AS account_created_at,

            am.role

        FROM users u

        INNER JOIN accounts a
            ON a.id = ?

        INNER JOIN account_members am
            ON am.account_id = a.id
            AND am.user_id = u.id

        WHERE
            u.id = ?

        LIMIT 1
    `).get(

        accountId,

        userId

    );

}


// ======================================================
// REGISTER
// ======================================================
//
// Main public registration method.
//
// This is the function that future interfaces should
// call.
//
// Example:
//
// registrationService.register({
//     fullName: "John Doe",
//     email: "john@example.com",
//     phone: "+2348012345678",
//     accountName: "John Business",
//     accountType: "BUSINESS"
// });
//
// Telegram can additionally provide:
//
// telegramId
// username
//
// Web / WhatsApp / Mobile do not have to.
//
// ======================================================

function register(
    registrationData
) {

    const data =
        normalizeRegistrationData(
            registrationData
        );


    validateRegistrationData(
        data
    );


    // ==================================================
    // PREVENT DUPLICATE USER
    // ==================================================

    const existingUser =
        findExistingUser(
            data
        );


    if (existingUser) {

        const error =
            new Error(
                "A user with this identity already exists."
            );


        error.code =
            "USER_ALREADY_EXISTS";


        error.user =
            existingUser;


        throw error;

    }


    // ==================================================
    // CREATE USER + ACCOUNT + MEMBERSHIP + CURRENT
    // ACCOUNT IN ONE TRANSACTION
    // ==================================================
    //
    // If any operation fails, SQLite rolls back the
    // entire registration.
    //
    // We never want:
    //
    // User created
    // but account missing
    //
    // or:
    //
    // Account created
    // but owner membership missing.
    //
    // ==================================================

    const transaction =
        db.transaction(() => {

            // ==========================================
            // CREATE USER
            // ==========================================

            const user =
                createUser(
                    data
                );


            // ==========================================
            // CREATE ACCOUNT
            // ==========================================

            const account =
                createAccount(

                    user.id,

                    data.accountName,

                    data.accountType

                );


            // ==========================================
            // CREATE OWNER MEMBERSHIP
            // ==========================================

            const membership =
                createOwnerMembership(

                    account.id,

                    user.id

                );


            // ==========================================
            // SET CURRENT ACCOUNT
            // ==========================================

            const currentAccount =
                setCurrentAccount(

                    user.id,

                    account.id

                );


            return {

                user,

                account,

                membership,

                currentAccount

            };

        });


    const result =
        transaction();


    // ==================================================
    // RETURN COMPLETE REGISTRATION
    // ==================================================

    const registeredUser =
        getRegisteredUser(

            result.user.id,

            result.account.id

        );


    return {

        success:
            true,

        user: {

            id:
                registeredUser.user_id,

            telegramId:
                registeredUser.telegram_id,

            fullName:
                registeredUser.full_name,

            username:
                registeredUser.username,

            email:
                registeredUser.email,

            phone:
                registeredUser.phone,

            createdAt:
                registeredUser.user_created_at

        },

        account: {

            id:
                registeredUser.account_id,

            name:
                registeredUser.account_name,

            type:
                registeredUser.account_type,

            ownerUserId:
                registeredUser.owner_user_id,

            createdAt:
                registeredUser.account_created_at

        },

        membership: {

            id:
                registeredUser.role
                    ? result.membership.id
                    : null,

            role:
                registeredUser.role

        },

        currentAccount: {

            userId:
                result.currentAccount.user_id,

            accountId:
                result.currentAccount.account_id

        }

    };

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    ACCOUNT_TYPES,

    normalizeRegistrationData,

    validateRegistrationData,

    findUserByTelegramId,

    findUserByEmail,

    findExistingUser,

    register

};