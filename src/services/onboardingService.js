const db = require("../database/database");

// ======================================================
// ONBOARDING SERVICE
// ======================================================
//
// Generic onboarding/business registration service.
//
// IMPORTANT:
//
// This service does NOT know about Telegram,
// WhatsApp, Web, Mobile, etc.
//
// Interfaces collect the information and pass it here.
//
// Architecture:
//
// Interface
//     ↓
// Onboarding Service
//     ↓
// User Profile
//     ↓
// Account
//     ↓
// Owner Membership
//     ↓
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

function validateAccountType(accountType) {

    const type =
        String(accountType || "")
            .trim()
            .toUpperCase();

    if (
        !Object.values(ACCOUNT_TYPES).includes(type)
    ) {
        throw new Error(
            "Account type must be BUSINESS or PERSONAL."
        );
    }

    return type;
}


// ======================================================
// NORMALIZE REGISTRATION DATA
// ======================================================

function normalizeRegistrationData(data = {}) {

    const fullName =
        String(data.fullName || "")
            .trim();

    const email =
        String(data.email || "")
            .trim()
            .toLowerCase();

    const phone =
        String(data.phone || "")
            .trim();

    const accountName =
        String(data.accountName || "")
            .trim();

    const accountType =
        validateAccountType(
            data.accountType ||
            ACCOUNT_TYPES.BUSINESS
        );

    return {
        fullName,
        email,
        phone,
        accountName,
        accountType
    };
}


// ======================================================
// VALIDATE REGISTRATION DATA
// ======================================================

function validateRegistrationData(data = {}) {

    const normalized =
        normalizeRegistrationData(data);


    // ------------------------------------------
    // FULL NAME
    // ------------------------------------------

    if (!normalized.fullName) {
        throw new Error(
            "Full name is required."
        );
    }


    // ------------------------------------------
    // EMAIL
    // ------------------------------------------

    if (!normalized.email) {
        throw new Error(
            "Email address is required."
        );
    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
        !emailPattern.test(
            normalized.email
        )
    ) {
        throw new Error(
            "Please provide a valid email address."
        );
    }


    // ------------------------------------------
    // ACCOUNT NAME
    // ------------------------------------------

    if (!normalized.accountName) {
        throw new Error(
            "Business or account name is required."
        );
    }


    return normalized;
}


// ======================================================
// CHECK EXISTING USER BY INTERFACE IDENTITY
// ======================================================
//
// Currently Telegram is the first interface.
//
// IMPORTANT:
//
// This function is deliberately isolated so that
// future interfaces can introduce their own identity
// mapping without changing the onboarding logic.
//
// ======================================================

function getUserByTelegramId(telegramId) {

    if (!telegramId) {
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

        WHERE telegram_id = ?

        LIMIT 1
    `).get(
        telegramId
    );
}


// ======================================================
// CHECK ONBOARDING STATUS
// ======================================================
//
// Returns whether the interface identity already
// belongs to a registered user.
//
// ======================================================

function getOnboardingStatus(
    identity = {}
) {

    const telegramId =
        identity.telegramId ||
        identity.telegram_id ||
        null;

    const user =
        getUserByTelegramId(
            telegramId
        );

    if (!user) {

        return {
            registered: false,
            user: null,
            account: null
        };

    }


    const account =
        db.prepare(`
            SELECT
                a.id,
                a.name,
                a.account_type,
                a.owner_user_id,
                am.role,
                a.created_at

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
        registered: true,
        user,
        account: account || null
    };
}


// ======================================================
// CREATE REGISTERED USER + ACCOUNT
// ======================================================
//
// This is the central registration operation.
//
// The entire operation is transactional.
//
// If any part fails, everything is rolled back.
//
// ======================================================

function completeOnboarding(
    identity = {},
    registrationData = {}
) {

    const telegramId =
        identity.telegramId ||
        identity.telegram_id ||
        null;

    if (!telegramId) {

        throw new Error(
            "Interface identity is required."
        );

    }


    const data =
        validateRegistrationData(
            registrationData
        );


    // ==================================================
    // CHECK WHETHER USER ALREADY EXISTS
    // ==================================================

    const existingUser =
        getUserByTelegramId(
            telegramId
        );

    if (existingUser) {

        throw new Error(
            "This user is already registered."
        );

    }


    // ==================================================
    // TRANSACTION
    // ==================================================

    const transaction =
        db.transaction(() => {

            // ==========================================
            // CREATE USER
            // ==========================================

            const userResult =
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

                    telegramId,

                    data.fullName,

                    identity.username ||
                        null,

                    data.email,

                    data.phone ||
                        null

                );


            const userId =
                userResult.lastInsertRowid;


            // ==========================================
            // CREATE ACCOUNT
            // ==========================================

            const accountResult =
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

                    data.accountName,

                    data.accountType,

                    userId

                );


            const accountId =
                accountResult.lastInsertRowid;


            // ==========================================
            // CREATE OWNER MEMBERSHIP
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
            // SET CURRENT ACCOUNT
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


            // ==========================================
            // RETURN IDS
            // ==========================================

            return {
                userId,
                accountId
            };

        });


    // ==================================================
    // LOAD COMPLETE REGISTRATION
    // ==================================================

    const result =
        db.prepare(`
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

            result.accountId,

            result.userId

        );


    return result;
}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    ACCOUNT_TYPES,

    normalizeRegistrationData,

    validateRegistrationData,

    getUserByTelegramId,

    getOnboardingStatus,

    completeOnboarding

};