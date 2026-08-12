const db = require("../database/database");
const entitlementService = require("./entitlementService");

// ======================================================
// FEATURE USAGE SERVICE
// ======================================================
//
// Handles usage limits for subscription features.
//
// Entitlement Service:
// "Is this feature included in the plan?"
//
// Feature Usage Service:
// "Has this account used its allowed amount?"
//
// Usage is ACCOUNT-based.
// ======================================================


// ======================================================
// GET CURRENT BILLING PERIOD
// ======================================================

function getCurrentPeriod() {

    const now = new Date();

    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();

    const periodStart = new Date(
        Date.UTC(year, month, 1, 0, 0, 0)
    );

    const periodEnd = new Date(
        Date.UTC(year, month + 1, 1, 0, 0, 0)
    );

    return {
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString()
    };
}


// ======================================================
// GET USAGE RECORD
// ======================================================

function getUsage(accountId, featureCode) {

    const {
        periodStart
    } = getCurrentPeriod();

    return db.prepare(`
        SELECT *
        FROM feature_usage
        WHERE account_id = ?
        AND feature_code = ?
        AND period_start = ?
    `).get(
        accountId,
        featureCode,
        periodStart
    );
}


// ======================================================
// GET OR CREATE USAGE RECORD
// ======================================================

function getOrCreateUsage(accountId, featureCode) {

    const {
        periodStart,
        periodEnd
    } = getCurrentPeriod();

    let usage = db.prepare(`
        SELECT *
        FROM feature_usage
        WHERE account_id = ?
        AND feature_code = ?
        AND period_start = ?
    `).get(
        accountId,
        featureCode,
        periodStart
    );

    if (usage) {
        return usage;
    }

    db.prepare(`
        INSERT INTO feature_usage (
            account_id,
            feature_code,
            usage_count,
            period_start,
            period_end
        )
        VALUES (?, ?, 0, ?, ?)
    `).run(
        accountId,
        featureCode,
        periodStart,
        periodEnd
    );

    return db.prepare(`
        SELECT *
        FROM feature_usage
        WHERE account_id = ?
        AND feature_code = ?
        AND period_start = ?
    `).get(
        accountId,
        featureCode,
        periodStart
    );
}


// ======================================================
// GET USAGE COUNT
// ======================================================

function getUsageCount(accountId, featureCode) {

    const usage = getUsage(
        accountId,
        featureCode
    );

    if (!usage) {
        return 0;
    }

    return Number(usage.usage_count);
}


// ======================================================
// CHECK WHETHER FEATURE CAN BE USED
// ======================================================

function canUseFeature(accountId, featureCode) {

    const entitlement =
        entitlementService.getEntitlement(
            accountId,
            featureCode
        );

    // --------------------------------------------------
    // FEATURE NOT INCLUDED
    // --------------------------------------------------

    if (!entitlement.allowed) {

        return {
            allowed: false,
            reason: entitlement.reason,
            accountId,
            featureCode,
            planCode: entitlement.planCode,
            planName: entitlement.planName,
            usageCount: 0,
            limitValue: null
        };
    }


    // --------------------------------------------------
    // UNLIMITED FEATURE
    // --------------------------------------------------

    if (
        entitlement.limitValue === null ||
        entitlement.limitValue === undefined
    ) {

        return {
            allowed: true,
            reason: "UNLIMITED",
            accountId,
            featureCode,
            planCode: entitlement.planCode,
            planName: entitlement.planName,
            usageCount: getUsageCount(
                accountId,
                featureCode
            ),
            limitValue: null,
            remaining: null
        };
    }


    // --------------------------------------------------
    // LIMITED FEATURE
    // --------------------------------------------------

    const usageCount =
        getUsageCount(
            accountId,
            featureCode
        );

    const limitValue =
        Number(entitlement.limitValue);


    if (usageCount >= limitValue) {

        return {
            allowed: false,
            reason: "LIMIT_REACHED",
            accountId,
            featureCode,
            planCode: entitlement.planCode,
            planName: entitlement.planName,
            usageCount,
            limitValue,
            remaining: 0
        };
    }


    return {
        allowed: true,
        reason: "WITHIN_LIMIT",
        accountId,
        featureCode,
        planCode: entitlement.planCode,
        planName: entitlement.planName,
        usageCount,
        limitValue,
        remaining: limitValue - usageCount
    };
}


// ======================================================
// RECORD USAGE
// ======================================================

function recordUsage(accountId, featureCode) {

    const usage =
        getOrCreateUsage(
            accountId,
            featureCode
        );

    const newCount =
        Number(usage.usage_count) + 1;

    db.prepare(`
        UPDATE feature_usage
        SET
            usage_count = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(
        newCount,
        usage.id
    );

    return db.prepare(`
        SELECT *
        FROM feature_usage
        WHERE id = ?
    `).get(usage.id);
}


// ======================================================
// USE FEATURE
// ======================================================
//
// Checks entitlement and usage limit.
// If allowed, usage is immediately recorded.
//
// ======================================================

function useFeature(accountId, featureCode) {

    const access =
        canUseFeature(
            accountId,
            featureCode
        );


    // --------------------------------------------------
    // BLOCKED
    // --------------------------------------------------

    if (!access.allowed) {
        return access;
    }


    // --------------------------------------------------
    // RECORD USAGE
    // --------------------------------------------------

    const usage =
        recordUsage(
            accountId,
            featureCode
        );


    return {
        ...access,

        allowed: true,

        usageCount:
            Number(usage.usage_count),

        remaining:
            access.limitValue === null
                ? null
                : Math.max(
                    0,
                    Number(access.limitValue) -
                    Number(usage.usage_count)
                )
    };
}


// ======================================================
// GET USAGE INFORMATION
// ======================================================

function getUsageInfo(accountId, featureCode) {

    const access =
        canUseFeature(
            accountId,
            featureCode
        );

    return {
        accountId,
        featureCode,

        planCode: access.planCode,
        planName: access.planName,

        allowed: access.allowed,

        reason: access.reason,

        usageCount:
            access.usageCount || 0,

        limitValue:
            access.limitValue ?? null,

        remaining:
            access.remaining ?? null
    };
}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    getCurrentPeriod,

    getUsage,

    getOrCreateUsage,

    getUsageCount,

    canUseFeature,

    recordUsage,

    useFeature,

    getUsageInfo

};