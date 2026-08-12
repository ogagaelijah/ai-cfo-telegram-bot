const db = require("../database/database");

// ======================================================
// SUBSCRIPTION SERVICE
// ======================================================
//
// IMPORTANT ARCHITECTURE:
//
// Subscription belongs to the ACCOUNT.
//
// NOT the USER.
//
// Example:
//
// User
//   ├── My Business
//   │      └── PRO subscription
//   │
//   ├── Hyperlog Fitness
//   │      └── FREE subscription
//   │
//   └── Nóstimo Foods
//          └── BUSINESS subscription
//
// Each account has its own subscription.
//
// A user's subscription NEVER automatically gives
// another account access to paid features.
//
// ======================================================


// ======================================================
// SUBSCRIPTION STATUSES
// ======================================================

const SUBSCRIPTION_STATUS = {

    ACTIVE: "ACTIVE",

    TRIAL: "TRIAL",

    EXPIRED: "EXPIRED",

    CANCELLED: "CANCELLED",

    PENDING: "PENDING"

};


// ======================================================
// PLAN CODES
// ======================================================

const PLAN_CODES = {

    FREE: "FREE",

    PRO: "PRO",

    BUSINESS: "BUSINESS"

};


// ======================================================
// GET PLAN BY ID
// ======================================================

function getPlanById(planId) {

    return db.prepare(`
        SELECT
            id,
            code,
            name,
            description,
            price,
            currency,
            billing_interval,
            is_active,
            created_at,
            updated_at

        FROM subscription_plans

        WHERE id = ?

        LIMIT 1
    `).get(
        planId
    );

}


// ======================================================
// GET PLAN BY CODE
// ======================================================

function getPlanByCode(planCode) {

    const code =
        String(
            planCode || ""
        )
        .trim()
        .toUpperCase();


    return db.prepare(`
        SELECT
            id,
            code,
            name,
            description,
            price,
            currency,
            billing_interval,
            is_active,
            created_at,
            updated_at

        FROM subscription_plans

        WHERE code = ?

        LIMIT 1
    `).get(
        code
    );

}


// ======================================================
// GET CURRENT SUBSCRIPTION
// ======================================================
//
// Returns the current subscription for an account.
//
// IMPORTANT:
//
// This function works ONLY with accountId.
//
// It does not accept userId.
//
// ======================================================

function getCurrentSubscription(accountId) {

    return db.prepare(`
        SELECT
            s.id,
            s.account_id,
            s.plan_id,
            s.status,

            s.started_at,
            s.expires_at,
            s.trial_ends_at,
            s.cancelled_at,
            s.payment_reference,

            s.created_at,
            s.updated_at,

            p.code AS plan_code,
            p.name AS plan_name,
            p.description AS plan_description,
            p.price AS plan_price,
            p.currency AS plan_currency,
            p.billing_interval

        FROM subscriptions s

        INNER JOIN subscription_plans p
            ON p.id = s.plan_id

        WHERE
            s.account_id = ?

        ORDER BY
            s.created_at DESC

        LIMIT 1
    `).get(
        accountId
    );

}


// ======================================================
// GET ACTIVE SUBSCRIPTION
// ======================================================
//
// This specifically checks for an ACTIVE subscription.
//
// Expired or cancelled subscriptions are not returned.
//
// ======================================================

function getActiveSubscription(accountId) {

    return db.prepare(`
        SELECT
            s.id,
            s.account_id,
            s.plan_id,
            s.status,

            s.started_at,
            s.expires_at,
            s.trial_ends_at,
            s.cancelled_at,
            s.payment_reference,

            s.created_at,
            s.updated_at,

            p.code AS plan_code,
            p.name AS plan_name,
            p.description AS plan_description,
            p.price AS plan_price,
            p.currency AS plan_currency,
            p.billing_interval

        FROM subscriptions s

        INNER JOIN subscription_plans p
            ON p.id = s.plan_id

        WHERE
            s.account_id = ?

            AND s.status = ?

            AND p.is_active = 1

        ORDER BY
            s.created_at DESC

        LIMIT 1
    `).get(
        accountId,
        SUBSCRIPTION_STATUS.ACTIVE
    );

}


// ======================================================
// GET ACCOUNT PLAN
// ======================================================
//
// Returns the plan currently assigned to an account.
//
// Example:
//
// {
//     accountId: 1,
//     planId: 2,
//     planCode: "PRO",
//     planName: "Pro"
// }
//
// ======================================================

function getAccountPlan(accountId) {

    const subscription =
        getActiveSubscription(
            accountId
        );


    if (!subscription) {

        return null;

    }


    return {

        accountId:
            subscription.account_id,

        subscriptionId:
            subscription.id,

        planId:
            subscription.plan_id,

        planCode:
            subscription.plan_code,

        planName:
            subscription.plan_name,

        status:
            subscription.status,

        expiresAt:
            subscription.expires_at,

        trialEndsAt:
            subscription.trial_ends_at

    };

}


// ======================================================
// HAS ACTIVE SUBSCRIPTION
// ======================================================

function hasActiveSubscription(accountId) {

    const subscription =
        getActiveSubscription(
            accountId
        );


    return !!subscription;

}


// ======================================================
// CREATE FREE SUBSCRIPTION
// ======================================================
//
// Every newly created account should receive FREE access.
//
// IMPORTANT:
//
// This creates the subscription for the ACCOUNT.
//
// NOT the USER.
//
// ======================================================

function createFreeSubscription(accountId) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    // ==============================================
    // CHECK WHETHER ACCOUNT ALREADY HAS SUBSCRIPTION
    // ==============================================

    const existing =
        getCurrentSubscription(
            accountId
        );


    if (existing) {

        return existing;

    }


    // ==============================================
    // GET FREE PLAN
    // ==============================================

    const freePlan =
        getPlanByCode(
            PLAN_CODES.FREE
        );


    if (!freePlan) {

        throw new Error(
            "FREE subscription plan does not exist."
        );

    }


    // ==============================================
    // CREATE SUBSCRIPTION
    // ==============================================

    const result =
        db.prepare(`
            INSERT INTO subscriptions
            (
                account_id,
                plan_id,
                status
            )

            VALUES
            (
                ?,
                ?,
                ?
            )
        `).run(

            accountId,

            freePlan.id,

            SUBSCRIPTION_STATUS.ACTIVE

        );


    return db.prepare(`
        SELECT
            s.id,
            s.account_id,
            s.plan_id,
            s.status,

            s.started_at,
            s.expires_at,
            s.trial_ends_at,
            s.cancelled_at,
            s.payment_reference,

            s.created_at,
            s.updated_at,

            p.code AS plan_code,
            p.name AS plan_name,
            p.description AS plan_description,
            p.price AS plan_price,
            p.currency AS plan_currency,
            p.billing_interval

        FROM subscriptions s

        INNER JOIN subscription_plans p
            ON p.id = s.plan_id

        WHERE s.id = ?

        LIMIT 1
    `).get(
        result.lastInsertRowid
    );

}


// ======================================================
// ACTIVATE SUBSCRIPTION
// ======================================================
//
// Used after successful payment.
//
// Example:
//
// activateSubscription(
//     1,
//     "PRO",
//     "PAYSTACK_REFERENCE"
// )
//
// This function changes the subscription for the
// specific ACCOUNT.
//
// ======================================================

function activateSubscription(
    accountId,
    planCode,
    paymentReference = null,
    expiresAt = null
) {

    if (!accountId) {

        throw new Error(
            "Account ID is required."
        );

    }


    const plan =
        getPlanByCode(
            planCode
        );


    if (!plan) {

        throw new Error(
            "Subscription plan not found."
        );

    }


    if (!plan.is_active) {

        throw new Error(
            "This subscription plan is currently inactive."
        );

    }


    const transaction =
        db.transaction(() => {

            // ======================================
            // CANCEL EXISTING ACTIVE SUBSCRIPTION
            // ======================================

            db.prepare(`
                UPDATE subscriptions

                SET
                    status = ?,
                    cancelled_at = CURRENT_TIMESTAMP,
                    updated_at = CURRENT_TIMESTAMP

                WHERE
                    account_id = ?

                    AND status = ?
            `).run(

                SUBSCRIPTION_STATUS.CANCELLED,

                accountId,

                SUBSCRIPTION_STATUS.ACTIVE

            );


            // ======================================
            // CREATE NEW ACTIVE SUBSCRIPTION
            // ======================================

            const result =
                db.prepare(`
                    INSERT INTO subscriptions
                    (
                        account_id,
                        plan_id,
                        status,
                        expires_at,
                        payment_reference
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

                    accountId,

                    plan.id,

                    SUBSCRIPTION_STATUS.ACTIVE,

                    expiresAt,

                    paymentReference

                );


            return result.lastInsertRowid;

        });


    return db.prepare(`
        SELECT
            s.id,
            s.account_id,
            s.plan_id,
            s.status,

            s.started_at,
            s.expires_at,
            s.trial_ends_at,
            s.cancelled_at,
            s.payment_reference,

            s.created_at,
            s.updated_at,

            p.code AS plan_code,
            p.name AS plan_name,
            p.description AS plan_description,
            p.price AS plan_price,
            p.currency AS plan_currency,
            p.billing_interval

        FROM subscriptions s

        INNER JOIN subscription_plans p
            ON p.id = s.plan_id

        WHERE s.id = ?

        LIMIT 1
    `).get(
        transaction
    );

}


// ======================================================
// CANCEL SUBSCRIPTION
// ======================================================
//
// This cancels the current active subscription.
//
// We do NOT delete subscription history.
//
// This is important for:
//
// Billing history
// Payment records
// Auditing
// Customer support
//
// ======================================================

function cancelSubscription(accountId) {

    const result =
        db.prepare(`
            UPDATE subscriptions

            SET
                status = ?,
                cancelled_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP

            WHERE
                account_id = ?

                AND status = ?
        `).run(

            SUBSCRIPTION_STATUS.CANCELLED,

            accountId,

            SUBSCRIPTION_STATUS.ACTIVE

        );


    return result.changes > 0;

}


// ======================================================
// EXPIRE SUBSCRIPTION
// ======================================================
//
// Used by scheduled jobs.
//
// Any subscription whose expiration date has passed
// becomes EXPIRED.
//
// ======================================================

function expireSubscriptions() {

    const result =
        db.prepare(`
            UPDATE subscriptions

            SET
                status = ?,
                updated_at = CURRENT_TIMESTAMP

            WHERE
                status = ?

                AND expires_at IS NOT NULL

                AND datetime(expires_at)
                    <= datetime('now')
        `).run(

            SUBSCRIPTION_STATUS.EXPIRED,

            SUBSCRIPTION_STATUS.ACTIVE

        );


    return result.changes;

}


// ======================================================
// GET ALL ACTIVE SUBSCRIPTIONS
// ======================================================
//
// Useful later for:
//
// Scheduled expiration checks
// Billing reminders
// Subscription dashboards
// Admin tools
//
// ======================================================

function getActiveSubscriptions() {

    return db.prepare(`
        SELECT
            s.id,
            s.account_id,
            s.plan_id,
            s.status,
            s.started_at,
            s.expires_at,
            s.payment_reference,

            p.code AS plan_code,
            p.name AS plan_name

        FROM subscriptions s

        INNER JOIN subscription_plans p
            ON p.id = s.plan_id

        WHERE
            s.status = ?

        ORDER BY
            s.created_at ASC
    `).all(
        SUBSCRIPTION_STATUS.ACTIVE
    );

}


// ======================================================
// REQUIRE ACTIVE SUBSCRIPTION
// ======================================================
//
// Used by protected services.
//
// If the account does not have an active subscription,
// an error is thrown.
//
// ======================================================

function requireActiveSubscription(accountId) {

    const subscription =
        getActiveSubscription(
            accountId
        );


    if (!subscription) {

        throw new Error(
            "This account does not have an active subscription."
        );

    }


    return subscription;

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    SUBSCRIPTION_STATUS,

    PLAN_CODES,

    getPlanById,

    getPlanByCode,

    getCurrentSubscription,

    getActiveSubscription,

    getAccountPlan,

    hasActiveSubscription,

    createFreeSubscription,

    activateSubscription,

    cancelSubscription,

    expireSubscriptions,

    getActiveSubscriptions,

    requireActiveSubscription

};