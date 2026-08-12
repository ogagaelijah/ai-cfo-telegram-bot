const db = require("../database/database");

// ======================================================
// ENTITLEMENT SERVICE
// ======================================================
//
// This service determines whether an ACCOUNT has access
// to a particular CFO feature.
//
// IMPORTANT:
//
// Subscription belongs to ACCOUNT.
// Entitlements therefore belong to ACCOUNT.
//
// We NEVER determine paid access from user ID.
//
// Architecture:
//
// User
//   ↓
// Current Account
//   ↓
// Account Subscription
//   ↓
// Subscription Plan
//   ↓
// Plan Features
//   ↓
// Entitlement
//
// ======================================================


// ======================================================
// FEATURE CODES
// ======================================================
//
// Keep feature codes centralized.
//
// These codes should be used throughout the application
// instead of repeatedly typing raw strings.
//
// ======================================================

const FEATURES = {

    // ------------------------------------------
    // CORE FINANCIAL FEATURES
    // ------------------------------------------

    SALES:
        "SALES",

    EXPENSES:
        "EXPENSES",

    INCOME:
        "INCOME",

    INVENTORY:
        "INVENTORY",

    CUSTOMERS:
        "CUSTOMERS",

    SUPPLIERS:
        "SUPPLIERS",

    DEBTORS:
        "DEBTORS",

    CREDITORS:
        "CREDITORS",

    PURCHASES:
        "PURCHASES",


    // ------------------------------------------
    // REPORTING
    // ------------------------------------------

    REPORTS:
        "REPORTS",

    PROFIT_LOSS:
        "PROFIT_LOSS",

    CASH_FLOW:
        "CASH_FLOW",

    KPI_DASHBOARD:
        "KPI_DASHBOARD",

    BUSINESS_TRENDS:
        "BUSINESS_TRENDS",

    FORECASTING:
        "FORECASTING",


    // ------------------------------------------
    // AI INTELLIGENCE
    // ------------------------------------------

    AI_INSIGHTS:
        "AI_INSIGHTS",

    AI_ADVISOR:
        "AI_ADVISOR",

    DECISION_ENGINE:
        "DECISION_ENGINE",

    RISK_INTELLIGENCE:
        "RISK_INTELLIGENCE",

    RECOMMENDATIONS:
        "RECOMMENDATIONS",

    EXECUTIVE_DASHBOARD:
        "EXECUTIVE_DASHBOARD",

    EXECUTIVE_REPORT:
        "EXECUTIVE_REPORT",


    // ------------------------------------------
    // EXPORTS
    // ------------------------------------------

    PDF_EXPORT:
        "PDF_EXPORT",

    EXCEL_EXPORT:
        "EXCEL_EXPORT"
};


// ======================================================
// SUBSCRIPTION STATUS
// ======================================================

const ACTIVE_STATUSES = [
    "ACTIVE",
    "TRIAL"
];


// ======================================================
// GET ACCOUNT SUBSCRIPTION
// ======================================================
//
// Returns the current subscription for an account.
//
// IMPORTANT:
//
// accountId is the security boundary.
//
// ======================================================

function getAccountSubscription(accountId) {

    if (!accountId) {

        return null;

    }


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
            s.id DESC

        LIMIT 1
    `).get(accountId);

}


// ======================================================
// CHECK SUBSCRIPTION ACTIVE
// ======================================================
//
// ACTIVE and TRIAL subscriptions are considered
// entitled to their plan.
//
// Expired and cancelled subscriptions are not.
//
// ======================================================

function isSubscriptionActive(subscription) {

    if (!subscription) {

        return false;

    }


    if (
        !ACTIVE_STATUSES.includes(
            subscription.status
        )
    ) {

        return false;

    }


    // ------------------------------------------
    // EXPIRED SUBSCRIPTION
    // ------------------------------------------

    if (subscription.expires_at) {

        const expiresAt =
            new Date(
                subscription.expires_at
            );

        if (
            !Number.isNaN(
                expiresAt.getTime()
            )
            &&
            expiresAt <= new Date()
        ) {

            return false;

        }

    }


    // ------------------------------------------
    // EXPIRED TRIAL
    // ------------------------------------------

    if (
        subscription.status === "TRIAL"
        &&
        subscription.trial_ends_at
    ) {

        const trialEndsAt =
            new Date(
                subscription.trial_ends_at
            );

        if (
            !Number.isNaN(
                trialEndsAt.getTime()
            )
            &&
            trialEndsAt <= new Date()
        ) {

            return false;

        }

    }


    return true;

}


// ======================================================
// GET PLAN FEATURE
// ======================================================
//
// Looks up whether the subscription's plan contains
// the requested feature.
//
// ======================================================

function getPlanFeature(
    planId,
    featureCode
) {

    if (
        !planId
        ||
        !featureCode
    ) {

        return null;

    }


    return db.prepare(`
        SELECT

            id,
            plan_id,
            feature_code,
            enabled,
            limit_value

        FROM plan_features

        WHERE
            plan_id = ?

            AND feature_code = ?

        LIMIT 1
    `).get(

        planId,

        featureCode

    );

}


// ======================================================
// GET FEATURE ENTITLEMENT
// ======================================================
//
// Returns a detailed entitlement object.
//
// This is useful for:
//
// debugging
// API responses
// Telegram messages
// web dashboards
//
// ======================================================

function getEntitlement(
    accountId,
    featureCode
) {

    const feature =
        String(
            featureCode || ""
        )
        .trim()
        .toUpperCase();


    if (!accountId || !feature) {

        return {

            allowed:
                false,

            reason:
                "INVALID_REQUEST",

            accountId,

            featureCode:
                feature

        };

    }


    const subscription =
        getAccountSubscription(
            accountId
        );


    if (!subscription) {

        return {

            allowed:
                false,

            reason:
                "NO_SUBSCRIPTION",

            accountId,

            featureCode:
                feature

        };

    }


    if (
        !isSubscriptionActive(
            subscription
        )
    ) {

        return {

            allowed:
                false,

            reason:
                "SUBSCRIPTION_INACTIVE",

            accountId,

            featureCode:
                feature,

            subscription

        };

    }


    const planFeature =
        getPlanFeature(
            subscription.plan_id,
            feature
        );


    if (!planFeature) {

        return {

            allowed:
                false,

            reason:
                "FEATURE_NOT_INCLUDED",

            accountId,

            featureCode:
                feature,

            planCode:
                subscription.plan_code,

            planName:
                subscription.plan_name

        };

    }


    if (
        !planFeature.enabled
    ) {

        return {

            allowed:
                false,

            reason:
                "FEATURE_DISABLED",

            accountId,

            featureCode:
                feature,

            planCode:
                subscription.plan_code,

            planName:
                subscription.plan_name

        };

    }


    return {

        allowed:
            true,

        reason:
            "FEATURE_INCLUDED",

        accountId,

        featureCode:
            feature,

        planCode:
            subscription.plan_code,

        planName:
            subscription.plan_name,

        subscriptionId:
            subscription.id,

        limitValue:
            planFeature.limit_value

    };

}


// ======================================================
// HAS FEATURE
// ======================================================
//
// Simple boolean check.
//
// Example:
//
// hasFeature(
//     accountId,
//     FEATURES.AI_INSIGHTS
// )
//
// → true / false
//
// ======================================================

function hasFeature(
    accountId,
    featureCode
) {

    const entitlement =
        getEntitlement(
            accountId,
            featureCode
        );


    return entitlement.allowed === true;

}


// ======================================================
// REQUIRE FEATURE
// ======================================================
//
// Use this when a feature MUST be available before
// continuing.
//
// Throws a controlled error.
//
// ======================================================

function requireFeature(
    accountId,
    featureCode
) {

    const entitlement =
        getEntitlement(
            accountId,
            featureCode
        );


    if (
        !entitlement.allowed
    ) {

        const error =
            new Error(
                `Feature "${featureCode}" is not available for this account.`
            );


        error.code =
            entitlement.reason;

        error.entitlement =
            entitlement;


        throw error;

    }


    return entitlement;

}


// ======================================================
// GET ACCOUNT ENTITLEMENTS
// ======================================================
//
// Returns every feature configured for the account's
// current plan.
//
// Useful for dashboards and debugging.
//
// ======================================================

function getAccountEntitlements(
accountId
) {

    const subscription =
        getAccountSubscription(
            accountId
        );


    if (!subscription) {

        return {

            accountId,

            subscription:
                null,

            features:
                []

        };

    }


    const features =
        db.prepare(`
            SELECT

                feature_code,
                enabled,
                limit_value

            FROM plan_features

            WHERE
                plan_id = ?

            ORDER BY
                feature_code ASC
        `).all(
            subscription.plan_id
        );


    return {

        accountId,

        subscription: {

            id:
                subscription.id,

            status:
                subscription.status,

            planId:
                subscription.plan_id,

            planCode:
                subscription.plan_code,

            planName:
                subscription.plan_name,

            expiresAt:
                subscription.expires_at,

            trialEndsAt:
                subscription.trial_ends_at

        },

        active:
            isSubscriptionActive(
                subscription
            ),

        features

    };

}


// ======================================================
// GET FEATURE LIMIT
// ======================================================
//
// Some future features may have limits.
//
// Example:
//
// FREE
// AI_CHAT_LIMIT = 10
//
// PRO
// AI_CHAT_LIMIT = 100
//
// BUSINESS
// AI_CHAT_LIMIT = NULL
// meaning unlimited.
//
// ======================================================

function getFeatureLimit(
accountId,
featureCode
) {

    const entitlement =
        getEntitlement(
            accountId,
            featureCode
        );


    if (
        !entitlement.allowed
    ) {

        return null;

    }


    return entitlement.limitValue;

}


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    FEATURES,

    ACTIVE_STATUSES,

    getAccountSubscription,

    isSubscriptionActive,

    getPlanFeature,

    getEntitlement,

    hasFeature,

    requireFeature,

    getAccountEntitlements,

    getFeatureLimit

};